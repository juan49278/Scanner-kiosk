
import React, { useState, useCallback, useEffect } from 'react';
import { PackageSearch, AlertCircle, Store, Barcode } from 'lucide-react';
import { AppStatus, Product } from './types';
import { getProductByCode } from './services/supabaseClient';
import ScannerInput from './components/ScannerInput';
import ProductDisplay from './components/ProductDisplay';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [product, setProduct] = useState<Product | null>(null);
  const [lastScannedCode, setLastScannedCode] = useState<string>('');

  const resetScanner = useCallback(() => {
    setStatus(AppStatus.IDLE);
    setProduct(null);
    setLastScannedCode('');
  }, []);

  // Temporizador para resetear el estado después de 10 segundos de mostrar un resultado
  useEffect(() => {
    if (status !== AppStatus.IDLE && status !== AppStatus.LOADING) {
      const timer = setTimeout(() => {
        resetScanner();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [status, resetScanner]);

  const handleScan = useCallback(async (code: string) => {
    if (!code.trim()) return;
    
    setStatus(AppStatus.LOADING);
    setLastScannedCode(code);
    setProduct(null);

    try {
      const foundProduct = await getProductByCode(code);
      
      if (foundProduct) {
        setProduct(foundProduct);
        setStatus(AppStatus.SUCCESS);
      } else {
        setStatus(AppStatus.NOT_FOUND);
      }
    } catch (error: any) {
      console.error('Error detectado:', error?.message || error);
      setStatus(AppStatus.ERROR);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10 px-4 bg-slate-50 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-slate-200 rounded-full blur-3xl opacity-50 pointer-events-none" />

      {/* Header - Minimalista */}
      <header className="absolute top-10 left-0 right-0 px-10 flex justify-center items-center pointer-events-none opacity-50">
        <div className="flex items-center gap-3">
          <Store className="text-indigo-600 h-6 w-6" />
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Kiosco de Precios</h1>
        </div>
      </header>

      {/* Área de contenido principal - Centrada */}
      <main className="w-full flex-1 flex flex-col items-center justify-center z-10 gap-12 max-w-4xl">
        
        {status === AppStatus.IDLE && (
          <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 inline-block mb-4">
               <PackageSearch className="h-20 w-20 text-indigo-500" strokeWidth={1.5} />
            </div>
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-slate-800 tracking-tighter uppercase">Consulta tu Precio</h2>
              <p className="text-lg text-slate-400 font-medium">Escanea el código de barras para continuar</p>
            </div>
          </div>
        )}

        {status === AppStatus.LOADING && (
          <div className="flex flex-col items-center gap-6 animate-pulse">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-24 h-24 border-4 border-indigo-100 rounded-full"></div>
              <div className="absolute w-24 h-24 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <Barcode className="h-8 w-8 text-indigo-600" />
            </div>
            <p className="text-xl font-black text-slate-400 uppercase tracking-widest">Buscando...</p>
          </div>
        )}

        {status === AppStatus.SUCCESS && product && (
          <ProductDisplay product={product} />
        )}

        {status === AppStatus.NOT_FOUND && (
          <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl max-w-lg w-full border border-red-50 flex flex-col items-center text-center animate-in zoom-in duration-300">
            <div className="bg-red-50 p-6 rounded-full mb-8">
              <AlertCircle className="h-16 w-16 text-red-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-4 uppercase">No se encontró el producto</h3>
            <p className="text-slate-500 mb-0 text-lg leading-relaxed">
              Código escaneado: <span className="font-bold text-red-500 text-xl">"{lastScannedCode}"</span>
              <br/><br/>
              Intenta de nuevo o consulte al personal sobre este artículo.
            </p>
            <div className="mt-8 pt-8 border-t border-slate-50 w-full">
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                El buscador se activará en unos segundos...
              </p>
            </div>
          </div>
        )}

        {status === AppStatus.ERROR && (
          <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl max-w-lg w-full border border-amber-50 flex flex-col items-center text-center animate-in zoom-in duration-300">
             <div className="bg-amber-50 p-6 rounded-full mb-8">
              <AlertCircle className="h-16 w-16 text-amber-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-4 uppercase">Error de sistema</h3>
            <p className="text-slate-500 text-lg leading-relaxed">Hubo un problema al conectar con la base de datos.<br/>Reiniciando sistema...</p>
          </div>
        )}
      </main>

      {/* Sección de entrada - Siempre lista y visible en la parte inferior */}
      <div className="w-full flex flex-col items-center gap-6 mt-12 z-20">
        <ScannerInput 
          onScan={handleScan} 
          isLoading={status === AppStatus.LOADING} 
          isSuccess={status === AppStatus.SUCCESS}
          appStatus={status}
        />
        
        {status !== AppStatus.IDLE && (
          <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-100 rounded-full">
             <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nueva consulta disponible en 10s...</span>
          </div>
        )}
      </div>

      <footer className="absolute bottom-6 text-slate-300 text-[9px] font-black uppercase tracking-[0.3em] pointer-events-none">
        ScannerKiosk SpeedMode v5.0
      </footer>
    </div>
  );
};

export default App;

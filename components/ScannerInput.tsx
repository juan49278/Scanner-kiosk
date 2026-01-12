
import React, { useState, useEffect, useRef } from 'react';
import { Search, Barcode, CheckCircle2 } from 'lucide-react';
import { AppStatus } from '../types';

interface ScannerInputProps {
  onScan: (code: string) => void;
  isLoading: boolean;
  isSuccess: boolean;
  appStatus: AppStatus;
}

const ScannerInput: React.FC<ScannerInputProps> = ({ onScan, isLoading, isSuccess, appStatus }) => {
  const [inputValue, setInputValue] = useState('');
  const [showPulse, setShowPulse] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Efecto para la animación de éxito
  useEffect(() => {
    if (isSuccess) {
      setShowPulse(true);
      const timer = setTimeout(() => setShowPulse(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  // Función para forzar el foco
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Mantener el foco de manera agresiva para el scanner físico
  useEffect(() => {
    focusInput();
    
    // Forzar foco al hacer click en cualquier parte del documento
    const handleDocumentClick = () => focusInput();
    document.addEventListener('click', handleDocumentClick);

    // Forzar foco cada vez que el estado de la app cambie a IDLE
    if (appStatus === AppStatus.IDLE) {
      focusInput();
    }

    // Intervalo de seguridad para asegurar el foco (muy útil en kioscos)
    const interval = setInterval(focusInput, 1000);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
      clearInterval(interval);
    };
  }, [appStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onScan(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
          {showPulse ? (
            <CheckCircle2 className="h-6 w-6 text-green-500 animate-bounce" />
          ) : (
            <Barcode className={`h-6 w-6 transition-colors ${isLoading ? 'text-indigo-400' : 'text-slate-400 group-focus-within:text-indigo-500'}`} />
          )}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          autoFocus
          autoComplete="off"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Escanear código..."
          disabled={isLoading}
          className={`
            block w-full pl-12 pr-12 py-5 bg-white border-2 rounded-2xl text-xl font-medium outline-none transition-all duration-300
            ${showPulse 
              ? 'border-green-500 ring-4 ring-green-100 shadow-[0_0_25px_rgba(34,197,94,0.2)]' 
              : 'border-transparent shadow-lg focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500'
            }
            ${isLoading ? 'opacity-75 cursor-wait' : 'opacity-100'}
          `}
        />

        <button
          type="submit"
          className="absolute inset-y-0 right-0 pr-4 flex items-center z-10"
        >
          <div className={`
            p-2 rounded-xl transition-all active:scale-95
            ${showPulse ? 'bg-green-500' : 'bg-indigo-600 hover:bg-indigo-700'}
            text-white
          `}>
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : showPulse ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </div>
        </button>
      </form>
      <p className="text-center mt-3 text-slate-400 text-sm">
        {showPulse ? '¡Código detectado correctamente!' : 'El escáner está listo. Simplemente pase el producto.'}
      </p>
    </div>
  );
};

export default ScannerInput;

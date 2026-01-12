
import React from 'react';
import { Product } from '../types';
import { Package } from 'lucide-react';

interface ProductDisplayProps {
  product: Product;
}

const ProductDisplay: React.FC<ProductDisplayProps> = ({ product }) => {
  return (
    <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden animate-in fade-in zoom-in duration-300 border border-slate-100 flex flex-col items-center text-center p-10">
      {/* Generic Icon Container */}
      <div className="mb-8 p-8 bg-slate-50 rounded-full">
        <Package className="h-24 w-24 text-slate-300" strokeWidth={1} />
      </div>

      <div className="space-y-4 mb-10">
        <h2 className="text-3xl font-black text-slate-800 leading-tight uppercase tracking-tight">
          {product.name}
        </h2>
        <div className="inline-block px-4 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
          {product.category || 'ARTÍCULO DISPONIBLE'}
        </div>
      </div>

      {/* Price Container */}
      <div className="bg-indigo-600 px-12 py-6 rounded-[2rem] shadow-xl shadow-indigo-100 text-white mb-8">
        <span className="text-7xl font-black tabular-nums tracking-tighter">
          ${product.price.toFixed(2)}
        </span>
      </div>

      {/* Footer / Scanned Code */}
      <div className="w-full pt-8 border-t border-slate-50">
        <p className="text-[12px] text-slate-400 font-bold uppercase tracking-[0.2em]">
          CÓDIGO: <span className="text-indigo-500">{product.code}</span>
        </p>
      </div>
    </div>
  );
};

export default ProductDisplay;

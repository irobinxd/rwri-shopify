
import React from 'react';
import { SeoResult } from '../types';

interface AdPreviewProps {
  result: SeoResult;
}

const AdPreview: React.FC<AdPreviewProps> = ({ result }) => {
  if (result.status !== 'completed') return null;

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm max-w-sm mx-auto">
      {/* Header */}
      <div className="p-3 flex items-center gap-2">
        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-400">
          S
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-900 leading-tight">Your Shop Name</div>
          <div className="text-xs text-slate-500">Sponsored · 🌐</div>
        </div>
      </div>
      
      {/* Ad Body Text (Hook + Description) */}
      <div className="px-3 pb-3 text-sm text-slate-900 leading-relaxed">
        <span className="font-bold block mb-1">🔥 {result.hook}</span>
        {result.metaDescription}
      </div>

      {/* Image Placeholder */}
      <div className="aspect-[1.91/1] bg-slate-100 flex flex-col items-center justify-center border-y border-slate-100 relative group">
        <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-[10px] uppercase tracking-widest text-slate-400 mt-2">Product Image</span>
      </div>

      {/* Headline & CTA */}
      <div className="bg-slate-50 p-3 flex justify-between items-center border-b border-slate-200">
        <div className="flex-1 min-w-0 pr-2">
          <div className="text-[10px] text-slate-500 uppercase tracking-tighter">YourShop.com</div>
          <div className="text-sm font-bold text-slate-900 truncate">{result.h1}</div>
          <div className="text-xs text-slate-500 truncate">{result.primaryBenefit}</div>
        </div>
        <button className="bg-slate-200 hover:bg-slate-300 transition-colors text-slate-800 text-xs font-bold py-2 px-4 rounded uppercase tracking-wide">
          Shop Now
        </button>
      </div>

      {/* Engagement Footer */}
      <div className="px-3 py-2 flex justify-between items-center border-t border-slate-100">
        <div className="flex -space-x-1">
          <div className="w-4 h-4 rounded-full bg-blue-500 ring-1 ring-white"></div>
          <div className="w-4 h-4 rounded-full bg-red-400 ring-1 ring-white"></div>
        </div>
        <div className="text-[10px] text-slate-500">2.4k Likes · 12 Comments</div>
      </div>
    </div>
  );
};

export default AdPreview;

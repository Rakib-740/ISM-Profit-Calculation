import React from 'react';
import { Calculator, FileText, ChevronLeft } from 'lucide-react';

export default function Header({ onBack }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {onBack && (
            <>
              <button
                onClick={onBack}
                className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-100 px-2 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </button>
              <div className="h-5 w-px bg-slate-200" />
            </>
          )}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 m-0 leading-tight tracking-tight">
                ISM Return Message Generator
              </h1>
              <p className="text-xs text-slate-500 m-0 font-bengali">
                আইএসএম প্রজেক্ট রিটার্ন মেসেজ এবং প্রফিট ক্যালকুলেটর
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-full border border-emerald-200 font-medium font-bengali">
          <FileText className="w-4 h-4 text-emerald-600" />
          <span>অটোমেটিক মেসেজ জেনারেটর</span>
        </div>
      </div>
    </header>
  );
}

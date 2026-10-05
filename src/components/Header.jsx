import React from 'react';
import { Calculator, FileText } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
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
        <div className="flex items-center gap-2 text-xs bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-full border border-emerald-200 font-medium font-bengali">
          <FileText className="w-4 h-4 text-emerald-600" />
          <span>অটোমেটিক মেসেজ জেনারেটর</span>
        </div>
      </div>
    </header>
  );
}

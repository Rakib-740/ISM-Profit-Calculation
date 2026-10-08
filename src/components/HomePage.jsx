import React from 'react';
import { ClipboardList, ArrowRight, TrendingUp, FileSpreadsheet, Calculator } from 'lucide-react';

export default function HomePage({ onSelectTool }) {
  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col">
      {/* Site header */}
      <header className="bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="flex-shrink-0">
            <img
              src="/ISM-logo.jpeg"
              alt="ISM Logo"
              className="h-12 w-12 rounded-xl object-cover shadow-sm"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 m-0 leading-tight tracking-tight">
              ISM Workshop
            </h1>
            <p className="text-xs text-slate-500 m-0 font-bengali">
              আইএসএম ওয়ার্কশপ টুলস
            </p>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 max-w-5xl mx-auto px-4 py-12 w-full">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">
            Select a Tool
          </h2>
          <p className="text-sm text-slate-500 font-bengali">
            নিচের যেকোনো টুল বেছে নিন
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {/* Card 1 — Profit Calculator */}
          <button
            onClick={() => onSelectTool('profit')}
            className="group text-left bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all active:scale-[0.98] cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-emerald-100 rounded-xl group-hover:bg-emerald-600 transition-colors">
                <TrendingUp className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all mt-1" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1.5">
              Profit Calculator
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-bengali">
              রিটার্ন মেসেজ জেনারেটর — প্রফিট ক্যালকুলেশন, ইনভেস্টর লিস্ট এবং বাংলা মেসেজ তৈরি করুন।
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full">
                <Calculator className="w-3 h-3" />
                Return Calculator
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                <FileSpreadsheet className="w-3 h-3" />
                Bulk Input
              </span>
            </div>
          </button>

          {/* Card 2 — Project Documentation Management */}
          <button
            onClick={() => onSelectTool('docs')}
            className="group text-left bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-violet-300 transition-all active:scale-[0.98] cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-violet-100 rounded-xl group-hover:bg-violet-600 transition-colors">
                <ClipboardList className="w-6 h-6 text-violet-600 group-hover:text-white transition-colors" />
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-violet-600 group-hover:translate-x-0.5 transition-all mt-1" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1.5">
              Project Documentation Management
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-bengali">
              ISM ID তালিকা পেস্ট করুন এবং Agreement ID, Investment ID সহ চারটি আলাদা কপিযোগ্য কলাম তৈরি করুন।
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-violet-50 text-violet-700 border border-violet-200 px-2.5 py-1 rounded-full">
                <ClipboardList className="w-3 h-3" />
                ID Generator
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                Google Sheets Ready
              </span>
            </div>
          </button>
        </div>
      </main>

      <footer className="text-center text-xs text-slate-400 py-6">
        ISM Workshop • All processing done locally in browser
      </footer>
    </div>
  );
}

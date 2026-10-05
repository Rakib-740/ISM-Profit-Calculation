import React, { useState } from 'react';
import { FileSpreadsheet, CheckCircle2, AlertCircle, AlertTriangle, Trash2, ArrowRight } from 'lucide-react';
import { parseInvestorInput } from '../utils/parserUtils';

export default function BulkInvestorInput({ investors, onUpdateInvestors }) {
  const [text, setText] = useState('');
  const [parseResult, setParseResult] = useState(null);

  const handleParse = () => {
    if (!text.trim()) {
      setParseResult(null);
      return;
    }

    const { parsed, invalid } = parseInvestorInput(text);

    // Existing names set for duplicate checking (case-insensitive)
    const existingNamesSet = new Set(
      (investors || []).map((inv) => (inv.name ? inv.name.trim().toUpperCase() : ''))
    );

    const validToAdd = [];
    const duplicates = [];

    parsed.forEach((item) => {
      const normalizedId = item.id.trim().toUpperCase();
      if (existingNamesSet.has(normalizedId)) {
        duplicates.push(item.id);
      } else {
        existingNamesSet.add(normalizedId);
        validToAdd.push(item);
      }
    });

    if (validToAdd.length > 0) {
      const newInvestorObjects = validToAdd.map((item, idx) => ({
        id: `bulk-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`,
        name: item.id,
        investmentLacs: item.amount
      }));

      onUpdateInvestors([...investors, ...newInvestorObjects]);
    }

    setParseResult({
      addedCount: validToAdd.length,
      invalidLines: invalid,
      duplicates: duplicates
    });
  };

  const handleClearInput = () => {
    setText('');
    setParseResult(null);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-800 m-0 flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
          Bulk Investor Input
        </h2>
        <span className="text-xs text-slate-400 font-bengali">একাধিক ইনভেস্টর একসাথে যুক্ত করুন</span>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 font-bengali">
            পাস্ট টেক্সট (Paste Investor Data):
          </label>
          <textarea
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`ISM-096: 2 Lacs\nISM-069 - 13 Lacs\nISM-126: 1 Lac`}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors placeholder:text-slate-400"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleParse}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <span>Parse & Add Investors</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleClearInput}
            className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-slate-500" />
            <span>Clear Input</span>
          </button>
        </div>

        {/* Parse Result Summary */}
        {parseResult && (
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-3.5">
            <div className="flex flex-wrap gap-4 font-semibold text-sm">
              <span className="text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Successfully added: {parseResult.addedCount}
              </span>
              <span
                className={
                  parseResult.invalidLines.length > 0
                    ? 'text-rose-600 flex items-center gap-1.5'
                    : 'text-slate-500 flex items-center gap-1.5'
                }
              >
                <AlertCircle className="w-4 h-4" />
                Invalid lines: {parseResult.invalidLines.length}
              </span>
              <span
                className={
                  parseResult.duplicates.length > 0
                    ? 'text-amber-600 flex items-center gap-1.5'
                    : 'text-slate-500 flex items-center gap-1.5'
                }
              >
                <AlertTriangle className="w-4 h-4" />
                Duplicates skipped: {parseResult.duplicates.length}
              </span>
            </div>

            {parseResult.invalidLines.length > 0 && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-md text-rose-700">
                <span className="font-semibold block mb-1">Invalid lines:</span>
                <ul className="list-disc list-inside space-y-0.5 font-mono text-xs">
                  {parseResult.invalidLines.map((line, idx) => (
                    <li key={idx}>- {line}</li>
                  ))}
                </ul>
              </div>
            )}

            {parseResult.duplicates.length > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
                <span className="font-semibold block mb-1">Duplicates skipped:</span>
                <ul className="list-disc list-inside space-y-0.5 font-mono text-xs">
                  {parseResult.duplicates.map((dup, idx) => (
                    <li key={idx}>- {dup}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

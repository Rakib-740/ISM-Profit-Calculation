import React, { useState, useCallback } from 'react';
import {
  FileText,
  Copy,
  Check,
  ChevronLeft,
  AlertCircle,
  Hash,
  CalendarDays,
  ClipboardList,
  Layers,
  BadgeCheck,
  Wallet
} from 'lucide-react';

// ─── Parser ──────────────────────────────────────────────────────────────────
// Re-uses the same regex as parserUtils.js but returns structured records
// keeping the original entry order and raw amount string.
const LINE_REGEX = /^\s*(ISM-\d{3})\s*[:-]\s*(\d+(?:\.\d+)?)\s*Lacs?\b/i;

function parseDocInput(text) {
  const lines = text.split(/\r?\n/);
  const records = [];  // { id, ismNum, amount, lineIndex, rawLine }
  const invalid = [];  // { lineIndex, rawLine }

  lines.forEach((rawLine, lineIndex) => {
    const trimmed = rawLine.trim();
    if (!trimmed) return; // skip blank lines

    const m = trimmed.match(LINE_REGEX);
    if (!m) {
      invalid.push({ lineIndex: lineIndex + 1, rawLine: trimmed });
      return;
    }

    const [, id, amountStr] = m;
    const ismNum = id.replace('ISM-', ''); // e.g. "096"
    records.push({ id, ismNum, amount: amountStr, lineIndex: lineIndex + 1, rawLine: trimmed });
  });

  return { records, invalid };
}

// ─── Generate all four outputs ───────────────────────────────────────────────
function generateOutputs(records, year, projectNum) {
  return records.map((rec, idx) => {
    const serial = String(idx + 1).padStart(2, '0');
    return {
      ismId: rec.id,
      amount: rec.amount,
      agreementId: `A-${year}-${rec.ismNum}-${projectNum}-${serial}`,
      investmentId: `I-${year}-${rec.ismNum}-${projectNum}-${serial}`
    };
  });
}

// ─── Copy-button sub-component ───────────────────────────────────────────────
function CopyButton({ text, label }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;left:-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer shrink-0 ${
        copied
          ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 shadow-2xs'
      }`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}

// ─── Output panel ────────────────────────────────────────────────────────────
function OutputPanel({ icon: Icon, iconColor, title, subtitle, content, copyLabel }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`p-1.5 rounded-lg ${iconColor}`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 m-0 leading-tight">{title}</p>
            {subtitle && <p className="text-[11px] text-slate-400 m-0 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        <CopyButton text={content} label={copyLabel} />
      </div>
      <textarea
        readOnly
        value={content}
        rows={Math.min(Math.max(content.split('\n').length, 4), 16)}
        className="w-full p-3.5 bg-slate-900 text-emerald-400 font-mono text-xs leading-relaxed focus:outline-none resize-none flex-1"
        spellCheck={false}
      />
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function DocGenerator({ onBack }) {
  const [year, setYear]           = useState('');
  const [projectNum, setProjectNum] = useState('');
  const [inputText, setInputText] = useState('');
  const [outputs, setOutputs]     = useState(null);   // null = not yet generated
  const [invalid, setInvalid]     = useState([]);
  const [generated, setGenerated] = useState(false);

  const inputCls =
    'w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 ' +
    'focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 ' +
    'transition-colors placeholder:text-slate-400 font-mono';

  const handleGenerate = useCallback(() => {
    const y = year.trim();
    const p = projectNum.trim();

    if (!y || !p || !inputText.trim()) return;

    const { records, invalid: inv } = parseDocInput(inputText);
    setInvalid(inv);

    if (records.length === 0) {
      setOutputs(null);
      setGenerated(true);
      return;
    }

    const rows = generateOutputs(records, y, p);
    setOutputs(rows);
    setGenerated(true);
  }, [year, projectNum, inputText]);

  const handleReset = () => {
    setYear('');
    setProjectNum('');
    setInputText('');
    setOutputs(null);
    setInvalid([]);
    setGenerated(false);
  };

  // Build plain-text strings for each column
  const colIsmIds      = outputs ? outputs.map(r => r.ismId).join('\n')      : '';
  const colAmounts     = outputs ? outputs.map(r => r.amount).join('\n')     : '';
  const colAgreements  = outputs ? outputs.map(r => r.agreementId).join('\n') : '';
  const colInvestments = outputs ? outputs.map(r => r.investmentId).join('\n') : '';

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 pb-16">
      {/* Page Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <div className="h-5 w-px bg-slate-200" />
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-violet-600 text-white rounded-xl shadow-xs">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-800 m-0 leading-tight">
                  Project Documentation Management
                </h1>
                <p className="text-xs text-slate-400 m-0 font-bengali">
                  ISM ID তালিকা থেকে ডকুমেন্টেশন আইডি তৈরি করুন
                </p>
              </div>
            </div>
          </div>
          {outputs && (
            <button
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-6 space-y-6">

        {/* ── Inputs Card ────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-200 flex items-center gap-2">
            <FileText className="w-5 h-5 text-violet-600" />
            <h2 className="text-base font-semibold text-slate-800 m-0">Project Information</h2>
          </div>

          <div className="p-5 space-y-5">
            {/* Year + Project Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                  <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                  Project Year
                </label>
                <input
                  type="text"
                  value={year}
                  onChange={e => setYear(e.target.value)}
                  placeholder="e.g. 2026"
                  maxLength={4}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5 text-slate-400" />
                  Project Number
                </label>
                <input
                  type="text"
                  value={projectNum}
                  onChange={e => setProjectNum(e.target.value)}
                  placeholder="e.g. 33"
                  className={inputCls}
                />
              </div>
            </div>

            {/* ISM List textarea */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                ISM Investor List
                <span className="ml-1 text-slate-400 font-normal">(one entry per line)</span>
              </label>
              <textarea
                rows={12}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder={
                  'ISM-096: 3 Lacs\nISM-126: 1 Lac\nISM-127: 5 Lacs\nISM-081: 5 Lacs\nISM-011: 2 Lacs\n...'
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors placeholder:text-slate-400 resize-y"
                spellCheck={false}
              />
            </div>

            {/* Generate button */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleGenerate}
                disabled={!year.trim() || !projectNum.trim() || !inputText.trim()}
                className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-all shadow-xs active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <ClipboardList className="w-4 h-4" />
                Generate Documentation
              </button>
              {generated && outputs && (
                <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  {outputs.length} entries generated
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Validation errors ──────────────────────────────── */}
        {generated && invalid.length > 0 && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <p className="text-sm font-semibold text-rose-700 m-0">
                {invalid.length} invalid line{invalid.length > 1 ? 's' : ''} skipped
              </p>
            </div>
            <ul className="space-y-1 pl-6">
              {invalid.map((item, i) => (
                <li key={i} className="text-xs font-mono text-rose-600">
                  Line {item.lineIndex}: <span className="text-rose-800">{item.rawLine}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── No valid entries ───────────────────────────────── */}
        {generated && (!outputs || outputs.length === 0) && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700 font-medium">
            No valid ISM entries found. Please check the input format.
          </div>
        )}

        {/* ── Four Output Panels ─────────────────────────────── */}
        {outputs && outputs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <OutputPanel
              icon={BadgeCheck}
              iconColor="bg-slate-600"
              title="ISM IDs"
              subtitle={`${outputs.length} entries • ready to paste in Google Sheets`}
              content={colIsmIds}
              copyLabel="Copy ISM IDs"
            />

            <OutputPanel
              icon={Wallet}
              iconColor="bg-blue-500"
              title="Amounts"
              subtitle="Numeric values only — no units"
              content={colAmounts}
              copyLabel="Copy Amounts"
            />

            <OutputPanel
              icon={FileText}
              iconColor="bg-violet-600"
              title="Agreement IDs"
              subtitle={`Format: A-${year || 'YYYY'}-ISM_NUM-${projectNum || 'XX'}-SERIAL`}
              content={colAgreements}
              copyLabel="Copy Agreement IDs"
            />

            <OutputPanel
              icon={ClipboardList}
              iconColor="bg-teal-600"
              title="Investment IDs"
              subtitle={`Format: I-${year || 'YYYY'}-ISM_NUM-${projectNum || 'XX'}-SERIAL`}
              content={colInvestments}
              copyLabel="Copy Investment IDs"
            />
          </div>
        )}
      </main>

      <footer className="max-w-5xl mx-auto px-4 mt-12 text-center text-xs text-slate-400">
        ISM Workshop • Project Documentation Management • All processing done locally in browser
      </footer>
    </div>
  );
}

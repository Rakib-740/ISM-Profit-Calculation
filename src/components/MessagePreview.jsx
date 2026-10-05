import React, { useState } from 'react';
import { Copy, Check, FileText, CalendarClock } from 'lucide-react';
import { generateBengaliMessage } from '../utils/messageGenerator';

export default function MessagePreview({
  project,
  activeReturn,
  investors,
  nextReturnRange,
  onNextReturnRangeChange
}) {
  const [copied, setCopied] = useState(false);

  const generatedMessage = generateBengaliMessage(
    project,
    activeReturn,
    investors,
    nextReturnRange
  );

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(generatedMessage);
      } else {
        // Fallback for older browsers or non-HTTPS
        const textArea = document.createElement('textarea');
        textArea.value = generatedMessage;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-600" />
          <h2 className="text-base font-semibold text-slate-800 m-0">
            Generated Return Message (বাংলা আউটপুট)
          </h2>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 shadow-sm cursor-pointer ${
            copied
              ? 'bg-emerald-600 text-white shadow-emerald-200 ring-2 ring-emerald-400'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>✓ Message Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Message</span>
            </>
          )}
        </button>
      </div>

      <div className="p-5 space-y-4">
        {/* Next Return Days Inputs */}
        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <CalendarClock className="w-4 h-4 text-emerald-600" />
            <span>সম্ভাব্য পরবর্তী রিটার্ন (Next Return Days):</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <input
              type="text"
              value={nextReturnRange?.minDays ?? ''}
              onChange={(e) =>
                onNextReturnRangeChange({ ...nextReturnRange, minDays: e.target.value })
              }
              className="w-16 px-2.5 py-1 bg-white border border-slate-300 rounded text-center text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              placeholder="45"
            />
            <span className="text-slate-400">থেকে</span>
            <input
              type="text"
              value={nextReturnRange?.maxDays ?? ''}
              onChange={(e) =>
                onNextReturnRangeChange({ ...nextReturnRange, maxDays: e.target.value })
              }
              className="w-16 px-2.5 py-1 bg-white border border-slate-300 rounded text-center text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              placeholder="50"
            />
            <span className="text-slate-600 font-medium">দিন পর</span>
          </div>
        </div>

        {/* Message Output Box */}
        <div className="relative">
          <textarea
            readOnly
            value={generatedMessage}
            rows={18}
            className="w-full p-4 bg-slate-900 text-emerald-400 rounded-xl font-mono text-sm leading-relaxed border border-slate-800 focus:outline-none select-all shadow-inner resize-y"
          />
          <div className="absolute top-3 right-3 text-xs text-slate-500 bg-slate-800/80 px-2 py-1 rounded border border-slate-700">
            Read-only Output
          </div>
        </div>

        {/* Prominent Copy Button Bottom */}
        <div className="flex justify-center pt-1">
          <button
            onClick={handleCopy}
            className={`w-full sm:w-auto px-8 py-3 rounded-xl text-base font-bold transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white ring-4 ring-emerald-200'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-98 hover:shadow-lg'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                <span>✓ Message Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                <span>Copy Message to Send</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

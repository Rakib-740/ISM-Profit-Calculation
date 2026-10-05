import React from 'react';
import { Plus, Trash2, Calendar, Clock, DollarSign, Percent, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';
import { calculateReturnMetrics } from '../utils/messageGenerator';
import {
  formatBengaliAmountWords,
  formatBengaliNumberWithCommas,
  toBengaliDigits,
  getBengaliOrdinal
} from '../utils/bengaliUtils';

export default function ReturnForm({
  returns,
  activeReturnId,
  onSelectReturn,
  onAddReturn,
  onDeleteReturn,
  onUpdateReturn
}) {
  const activeReturn = returns.find((r) => r.id === activeReturnId) || returns[0];

  const handleFieldChange = (field, value) => {
    if (!activeReturn) return;
    onUpdateReturn({
      ...activeReturn,
      [field]: value
    });
  };

  const { passiveProfit, profitPerLakh, invInLacs } = activeReturn
    ? calculateReturnMetrics(
        activeReturn.totalInvestment,
        activeReturn.totalProfit,
        activeReturn.passivePercentage
      )
    : { passiveProfit: 0, profitPerLakh: 0, invInLacs: 0 };

  const inputCls =
    'w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 ' +
    'focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors';

  const labelCls = 'block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1 font-bengali';

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Return Tabs Header */}
      <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto py-0.5">
          {returns.map((ret, index) => {
            const isActive = ret.id === activeReturnId;
            const ordinal = getBengaliOrdinal(ret.returnNumber || index + 1);
            return (
              <button
                key={ret.id}
                onClick={() => onSelectReturn(ret.id)}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span className="font-bengali">{ordinal} রিটার্ন</span>
                <span className="text-xs opacity-60">(Return {ret.returnNumber || index + 1})</span>
              </button>
            );
          })}

          <button
            onClick={onAddReturn}
            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Return</span>
          </button>
        </div>

        {returns.length > 1 && (
          <button
            onClick={() => onDeleteReturn(activeReturn.id)}
            className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-md flex items-center gap-1.5 transition-colors border border-rose-200 cursor-pointer"
            title="Delete current return"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Return</span>
          </button>
        )}
      </div>

      {/* Return Inputs */}
      <div className="p-5 space-y-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Return Number */}
          <div>
            <label className={labelCls}>
              রিটার্ন নাম্বার
            </label>
            <input
              type="number"
              value={activeReturn?.returnNumber ?? 1}
              onChange={(e) => handleFieldChange('returnNumber', parseInt(e.target.value, 10) || 1)}
              className={inputCls}
            />
          </div>

          {/* Return Date */}
          <div className="col-span-2">
            <label className={labelCls}>
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              রিটার্ন ডেট (Return Date)
            </label>
            <input
              type="text"
              value={activeReturn?.returnDate || ''}
              onChange={(e) => handleFieldChange('returnDate', e.target.value)}
              placeholder="০৫ আগস্ট, ২০২৬"
              className={`${inputCls} font-bengali`}
            />
          </div>

          {/* Days Taken */}
          <div>
            <label className={labelCls}>
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              সময় (Days)
            </label>
            <input
              type="text"
              value={activeReturn?.daysTaken || ''}
              onChange={(e) => handleFieldChange('daysTaken', e.target.value)}
              placeholder="46"
              className={inputCls}
            />
          </div>

          {/* Total Investment */}
          <div>
            <label className={labelCls}>
              <DollarSign className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              ইনভেস্টমেন্ট ( লক্ষ টাকা)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="any"
                value={activeReturn?.totalInvestment ?? ''}
                onChange={(e) => handleFieldChange('totalInvestment', e.target.value)}
                placeholder="110"
                className={`${inputCls} pr-10 font-mono`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 pointer-events-none font-bengali">
                লক্ষ
              </span>
            </div>
          </div>

          {/* Total Profit */}
          <div>
            <label className={labelCls}>
              <TrendingUp className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              মোট প্রফিট (টাকা)
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={activeReturn?.totalProfit ?? ''}
              onChange={(e) => handleFieldChange('totalProfit', e.target.value)}
              placeholder="429904.8"
              className={`${inputCls} font-mono`}
            />
          </div>

          {/* Passive Percentage */}
          <div>
            <label className={labelCls}>
              <Percent className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              নিষ্ক্রিয় পক্ষের %
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={activeReturn?.passivePercentage ?? 50}
              onChange={(e) => handleFieldChange('passivePercentage', e.target.value)}
              placeholder="50"
              className={inputCls}
            />
          </div>
        </div>

        {/* Calculated Results Banner */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Passive Profit */}
          <div className="bg-white p-4 rounded-lg border border-emerald-100 shadow-2xs">
            <div className="text-xs text-slate-500 font-medium mb-1.5 flex items-center gap-1.5 font-bengali">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              নিষ্ক্রিয় পক্ষের মোট লাভ ({toBengaliDigits(activeReturn?.passivePercentage || 50)}%)
            </div>
            <div className="text-xl font-bold text-emerald-700 font-bn-financial">
              {formatBengaliAmountWords(passiveProfit)}
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">
              {activeReturn?.totalProfit || 0} × {activeReturn?.passivePercentage || 50}%
            </div>
          </div>

          {/* Profit Per Lakh */}
          <div className="bg-white p-4 rounded-lg border border-emerald-100 shadow-2xs">
            <div className="text-xs text-slate-500 font-medium mb-1.5 flex items-center gap-1.5 font-bengali">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              প্রতি ১ লক্ষ টাকায় প্রফিট
            </div>
            <div className="text-xl font-bold text-teal-700 font-bn-financial">
              {formatBengaliNumberWithCommas(profitPerLakh)}
              <span className="text-sm font-normal text-slate-500 font-bengali ml-1">টাকা</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">
              {passiveProfit} ÷ {invInLacs} লক্ষ = {formatBengaliNumberWithCommas(profitPerLakh)} ৳
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

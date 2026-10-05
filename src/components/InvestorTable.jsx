import React from 'react';
import { Users, Plus, Trash2, UserPlus, DollarSign } from 'lucide-react';
import { calculateInvestorProfit } from '../utils/messageGenerator';
import { formatBengaliNumberWithCommas, toBengaliDigits } from '../utils/bengaliUtils';

export default function InvestorTable({ investors, profitPerLakh, onUpdateInvestors }) {
  const handleInvestorChange = (id, field, value) => {
    const updated = investors.map((inv) => {
      if (inv.id === id) {
        return { ...inv, [field]: value };
      }
      return inv;
    });
    onUpdateInvestors(updated);
  };

  const handleAddInvestor = () => {
    const newId = Date.now().toString();
    const nextNum = investors.length + 1;
    const padded = nextNum < 10 ? `00${nextNum}` : nextNum < 100 ? `0${nextNum}` : `${nextNum}`;
    const newInvestor = {
      id: newId,
      name: `ISM-${padded}`,
      investmentLacs: 1
    };
    onUpdateInvestors([...investors, newInvestor]);
  };

  const handleRemoveInvestor = (id) => {
    const filtered = investors.filter((inv) => inv.id !== id);
    onUpdateInvestors(filtered);
  };

  const totalLacs = investors.reduce((sum, inv) => sum + (parseFloat(inv.investmentLacs) || 0), 0);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Users className="w-5 h-5 text-emerald-600 shrink-0" />
          <h2 className="text-base font-semibold text-slate-800 m-0">
            Section C — Investor / ISM List
          </h2>
          <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-semibold font-bengali">
            মোট: {toBengaliDigits(investors.length)} জন
          </span>
        </div>
        <button
          onClick={handleAddInvestor}
          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Add Investor</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" style={{ minWidth: '600px' }}>
          <thead>
            <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
              <th className="py-2.5 px-3 w-12 text-center">#</th>
              <th className="py-2.5 px-3">ISM ID / Name</th>
              <th className="py-2.5 px-3 w-44 text-right">Investment (লক্ষ)</th>
              <th className="py-2.5 px-3 w-44 text-right">Calculated Profit</th>
              <th className="py-2.5 px-3 w-14 text-center">Del</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {investors.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-slate-400 font-bengali text-sm">
                  কোন ইনভেস্টর পাওয়া যায়নি। উপরের &ldquo;+ Add Investor&rdquo; বাটনে ক্লিক করুন।
                </td>
              </tr>
            ) : (
              investors.map((investor, index) => {
                const profit = calculateInvestorProfit(investor.investmentLacs, profitPerLakh);
                return (
                  <tr key={investor.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Serial */}
                    <td className="py-2 px-3 text-center text-slate-400 font-medium text-xs tabular-nums">
                      {index + 1}
                    </td>

                    {/* ISM ID / Name */}
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={investor.name || ''}
                        onChange={(e) => handleInvestorChange(investor.id, 'name', e.target.value)}
                        placeholder="e.g. ISM-075"
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium transition-colors"
                      />
                    </td>

                    {/* Investment in Lacs */}
                    <td className="py-2 px-3">
                      <div className="relative flex items-center justify-end">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={investor.investmentLacs ?? ''}
                          onChange={(e) =>
                            handleInvestorChange(investor.id, 'investmentLacs', e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && index === investors.length - 1) {
                              handleAddInvestor();
                            }
                          }}
                          placeholder="10"
                          className="w-full px-2.5 py-1.5 pr-10 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 text-right focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono transition-colors"
                        />
                        <span className="absolute right-2.5 text-[11px] text-slate-400 pointer-events-none font-bengali leading-none">
                          লক্ষ
                        </span>
                      </div>
                    </td>

                    {/* Calculated Profit */}
                    <td className="py-2 px-3 text-right">
                      <span className="font-bn-financial font-semibold text-emerald-700 text-sm">
                        {formatBengaliNumberWithCommas(profit)}
                      </span>
                      <span className="font-bengali text-slate-500 text-xs ml-1">টাকা</span>
                    </td>

                    {/* Action */}
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => handleRemoveInvestor(investor.id)}
                        className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                        title="Remove investor"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          {investors.length > 0 && (
            <tfoot>
              <tr className="bg-slate-50 border-t-2 border-slate-200">
                <td colSpan="2" className="py-3 px-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Total Investment
                </td>
                <td className="py-3 px-3 text-right">
                  <span className="font-mono font-bold text-emerald-800 text-sm">{totalLacs}</span>
                  <span className="font-bengali text-slate-500 text-xs ml-1">লক্ষ টাকা</span>
                </td>
                <td className="py-3 px-3 text-right text-xs text-slate-400 font-bengali">
                  {toBengaliDigits(investors.length)} জন ইনভেস্টর
                </td>
                <td />
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Footer Add Button */}
      <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <button
          onClick={handleAddInvestor}
          className="px-4 py-2 bg-white hover:bg-slate-100 active:scale-95 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
        >
          <Plus className="w-4 h-4 text-emerald-600" />
          <span>+ Add Investor</span>
        </button>
        <p className="text-xs text-slate-400 font-bengali hidden sm:block">
          ইনভেস্টমেন্ট মান &ldquo;লক্ষ&rdquo; এককে লিখুন&nbsp;(যেমন: 10 = ১০ লক্ষ টাকা)
        </p>
      </div>
    </div>
  );
}

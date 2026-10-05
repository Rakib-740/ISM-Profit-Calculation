import React from 'react';
import { FolderKanban, Calendar, Hash, Package, Clock, RefreshCw } from 'lucide-react';

export default function ProjectForm({ project, onChange }) {
  const handleChange = (field, value) => {
    onChange({
      ...project,
      [field]: value
    });
  };

  const inputCls =
    'w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 ' +
    'focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ' +
    'transition-colors placeholder:text-slate-400 font-bengali';

  const labelCls = 'block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1 font-bengali';

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-800 m-0 flex items-center gap-2">
          <FolderKanban className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Section A —</span>
          <span className="font-bengali font-semibold">প্রজেক্ট তথ্য</span>
          <span className="text-slate-500 font-normal text-sm">(Project Information)</span>
        </h2>
        <span className="text-xs text-slate-400 font-bengali hidden sm:inline">সম্পাদনাযোগ্য</span>
      </div>

      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Project Number */}
        <div>
          <label className={labelCls}>
            <Hash className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            প্রজেক্ট নাম্বার
          </label>
          <input
            type="text"
            value={project.projectNumber || ''}
            onChange={(e) => handleChange('projectNumber', e.target.value)}
            placeholder="উদাহরণ: 21"
            className={inputCls}
          />
        </div>

        {/* Project Name */}
        <div className="sm:col-span-2">
          <label className={labelCls}>
            <FolderKanban className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            প্রজেক্টের নাম
          </label>
          <input
            type="text"
            list="project-name-suggestions"
            value={project.projectName || ''}
            onChange={(e) => handleChange('projectName', e.target.value)}
            placeholder="নাম লিখুন বা নিচের অপশন থেকে বেছে নিন"
            className={inputCls}
            autoComplete="off"
          />
          {/* Predefined suggestions — user can also type anything custom */}
          <datalist id="project-name-suggestions">
            <option value="ইমপোর্টেড স্টক বিজনেস" />
            <option value="এক্সপোর্ট বিজনেস" />
          </datalist>
        </div>


        {/* Product */}
        <div>
          <label className={labelCls}>
            <Package className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            প্রোডাক্ট
          </label>
          <input
            type="text"
            value={project.product || ''}
            onChange={(e) => handleChange('product', e.target.value)}
            placeholder="উদাহরণ: সয়াবিন অয়েল"
            className={inputCls}
          />
        </div>

        {/* Start Date */}
        <div>
          <label className={labelCls}>
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            প্রজেক্ট শুরু
          </label>
          <input
            type="text"
            value={project.startDate || ''}
            onChange={(e) => handleChange('startDate', e.target.value)}
            placeholder="উদাহরণ: ২০-জুন-২০২৬"
            className={inputCls}
          />
        </div>

        {/* Duration */}
        <div>
          <label className={labelCls}>
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            মেয়াদ
          </label>
          <input
            type="text"
            value={project.duration || ''}
            onChange={(e) => handleChange('duration', e.target.value)}
            placeholder="উদাহরণ: ১২ মাস"
            className={inputCls}
          />
        </div>

        {/* Number of Returns */}
        <div>
          <label className={labelCls}>
            <RefreshCw className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            রিটার্ন সংখ্যা
          </label>
          <input
            type="text"
            value={project.numberOfReturns || ''}
            onChange={(e) => handleChange('numberOfReturns', e.target.value)}
            placeholder="উদাহরণ: ৮"
            className={inputCls}
          />
        </div>

        {/* End Date */}
        <div>
          <label className={labelCls}>
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            প্রজেক্ট শেষ হবে
          </label>
          <input
            type="text"
            value={project.endDate || ''}
            onChange={(e) => handleChange('endDate', e.target.value)}
            placeholder="উদাহরণ: ২০-জুন-২০২৭"
            className={inputCls}
          />
        </div>
      </div>
    </div>
  );
}

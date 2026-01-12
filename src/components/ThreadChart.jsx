import React, { useState } from 'react';
import { generatePrintableHtml, triggerPrint } from '../utils/printHelpers';

/**
 * @module components/ThreadChart
 * @description Provides an interactive preview and configuration for printable workshop charts.
 */
const ThreadChart = ({ threads, selectedClasses, unit, standardName, material }) => {
    const [includeInternal, setIncludeInternal] = useState(true);
    const [includeExternal, setIncludeExternal] = useState(false);

    const isImperial = unit === 'in';
    const f = (val) => (typeof val === 'number' ? val.toFixed(4) : '-');

    const handlePrint = () => {
        const html = generatePrintableHtml({
            threads,
            selectedClasses,
            unit,
            standardName,
            material,
            includeInternal,
            includeExternal
        });
        triggerPrint(html);
    };

    if (!threads || threads.length === 0) {
        return (
            <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-700/50 p-12 text-center">
                <p className="text-slate-500 italic">No threads selected to generate a chart.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Chart Configuration Panel */}
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                <div className="flex flex-wrap items-center gap-8">
                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Chart Focus</p>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-sky-500"
                                    checked={includeInternal}
                                    onChange={(e) => setIncludeInternal(e.target.checked)}
                                />
                                <span className={`text-xs font-bold transition-colors ${includeInternal ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>Internal Taps</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-sky-500"
                                    checked={includeExternal}
                                    onChange={(e) => setIncludeExternal(e.target.checked)}
                                />
                                <span className={`text-xs font-bold transition-colors ${includeExternal ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>External Threads</span>
                            </label>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handlePrint}
                    className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-slate-950 font-black py-3 px-8 rounded-xl shadow-lg shadow-sky-500/10 transform active:scale-[0.98] transition-all text-[10px] uppercase tracking-widest"
                >
                    Print Shop Chart
                </button>
            </div>

            {/* High-Contrast Print Preview Container */}
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-300 mx-auto w-full max-w-6xl transition-all duration-500">
                <div className="px-6 py-4 border-b-2 border-slate-200">
                    <div className="flex justify-between items-baseline mb-1">
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">
                            Thread Specification Chart
                        </h2>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2 py-0.5 bg-slate-100 rounded">
                            {standardName} • {material}
                        </span>
                    </div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                        Generated for Shop Use • {unit.toUpperCase()} Units
                    </p>
                </div>

                <div className="p-4 overflow-x-auto">
                    <table className="w-full text-left border-collapse table-fixed">
                        <thead>
                            <tr className="border-b-2 border-slate-900">
                                <th className="w-[15%] px-2 py-2 text-[10px] font-semibold text-slate-900 uppercase tracking-wider">Size / Designation</th>
                                <th className="w-[8%] px-2 py-2 text-[10px] font-semibold text-slate-900 uppercase tracking-wider text-center">{isImperial ? 'TPI' : 'Pitch'}</th>
                                <th className="w-[8%] px-2 py-2 text-[10px] font-semibold text-slate-900 uppercase tracking-wider text-center">Gender</th>
                                <th className="w-[10%] px-2 py-2 text-[10px] font-semibold text-slate-900 uppercase tracking-wider text-right">Major Dia</th>
                                <th className="w-[24%] px-2 py-2 text-[10px] font-semibold text-slate-900 uppercase tracking-wider pl-4">Tap Drill (Tool)</th>
                                <th className="w-[35%] px-2 py-2 text-[10px] font-semibold text-slate-900 uppercase tracking-wider pl-4">Workshop Advisory</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {Object.entries(threads.reduce((acc, t) => {
                                const series = t.series || 'Other';
                                if (!acc[series]) acc[series] = [];
                                acc[series].push(t);
                                return acc;
                            }, {})).map(([seriesName, seriesThreads]) => (
                                <React.Fragment key={seriesName}>
                                    {/* Series Header Row */}
                                    <tr className="bg-slate-900 text-white">
                                        <td colSpan="6" className="px-2 py-1 text-[8px] font-black uppercase tracking-[0.2em]">
                                            {seriesName} Series
                                        </td>
                                    </tr>

                                    {seriesThreads.map((thread) => {
                                        const activeClasses = selectedClasses.filter(c => thread.classes[c]);

                                        return ['External', 'Internal'].map((gender) => {
                                            if (gender === 'Internal' && !includeInternal) return null;
                                            if (gender === 'External' && !includeExternal) return null;

                                            const genderClasses = activeClasses.filter(cls => thread.classes[cls][gender.toLowerCase()]);
                                            if (genderClasses.length === 0) return null;

                                            const cls = genderClasses[0];
                                            const c = thread.classes[cls];
                                            const data = gender === 'External' ? c.external : c.internal;

                                            // Advisory Logic (keep consistent with printHelpers)
                                            let advisoryText = '';
                                            let isDanger = false;
                                            if (gender === 'Internal' && data.tapDrillName) {
                                                const engagement = Math.round(data.tapDrillValidation?.engagement || 0);
                                                const status = (data.tapDrillValidation?.status || '').toLowerCase();
                                                isDanger = status.includes('danger');
                                                if (status === 'warning-loose') advisoryText = `Caution: Loose Fit (${engagement}% PTE)`;
                                                else if (status === 'warning-tight') advisoryText = `Caution: tight fit (${engagement}% PTE)`;
                                                else if (status.includes('danger-loose') || status.includes('danger-very-loose')) advisoryText = `Danger: loose, risk of stripping (${engagement}% PTE)`;
                                                else if (status.includes('danger-tight')) advisoryText = `Danger: tight, risk of tap breaking (${engagement}% PTE)`;
                                            }

                                            return (
                                                <tr key={`${thread.designation}-${gender}`} className="group hover:bg-slate-50 transition-colors">
                                                    <td className="px-2 py-1.5 whitespace-nowrap">
                                                        <div className="flex flex-col">
                                                            <span className="text-slate-900 font-medium text-xs">{thread.designation}</span>
                                                            <span className="text-[10px] font-medium text-slate-400 uppercase leading-none">{thread.nominalFraction || thread.size}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-2 py-1.5 font-mono text-slate-400 font-medium text-xs text-center">
                                                        {isImperial ? thread.tpi : f(thread.basic.p)}
                                                    </td>
                                                    <td className="px-2 py-1.5 text-center">
                                                        <span className={`text-[8px] font-semibold uppercase px-1.5 py-0.5 rounded ${gender === 'External' ? 'text-slate-400' : 'text-slate-600'}`}>
                                                            {gender}
                                                        </span>
                                                    </td>
                                                    <td className="px-2 py-1.5 text-right font-mono text-slate-900 font-medium text-xs">
                                                        {f(data.major)}
                                                    </td>
                                                    <td className="px-2 py-1.5 pl-4">
                                                        {gender === 'Internal' && data.tapDrillName ? (
                                                            <span className="text-slate-900 font-semibold text-xs whitespace-nowrap">
                                                                {data.tapDrillName} <span className="font-normal text-slate-400">{data.tapDrillToolSize ? `(${f(data.tapDrillToolSize)})` : ''}</span>
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-200 px-4 text-xs">—</span>
                                                        )}
                                                    </td>
                                                    <td className="px-2 py-1.5 pl-4">
                                                        {advisoryText && (
                                                            <span className={`text-[10px] uppercase tracking-tight ${isDanger ? 'font-semibold text-rose-600' : 'font-normal text-slate-400'}`}>
                                                                {advisoryText}
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        });
                                    })}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>

                {!includeInternal && !includeExternal && (
                    <div className="p-20 text-center">
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                            Select thread types above to preview chart
                        </p>
                    </div>
                )}

                <div className="px-8 py-4 bg-slate-50 border-t border-slate-200">
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center">
                        Official Workshop Reference • Proportions optimized for A4 / A3 paper
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ThreadChart;

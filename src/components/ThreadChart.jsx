import React, { useState } from 'react';
import { generatePrintableHtml, triggerPrint } from '../utils/printHelpers';
import ThreadChartTable from './ThreadChartTable';

/**
 * @module components/ThreadChart
 * @description Provides an interactive preview and configuration for printable workshop charts.
 */
const ThreadChart = ({ threads, selectedClasses, unit, standardName, material }) => {
    const [includeInternal, setIncludeInternal] = useState(true);
    const [includeExternal, setIncludeExternal] = useState(false);

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
                    <ThreadChartTable
                        threads={threads}
                        selectedClasses={selectedClasses}
                        unit={unit}
                        includeInternal={includeInternal}
                        includeExternal={includeExternal}
                        isPrint={false}
                    />
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

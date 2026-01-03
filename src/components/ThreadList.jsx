import React from 'react';
import EngagementMeter from './EngagementMeter';

/**
 * Data table component for viewing and managing thread sizes.
 * 
 * @param {Object} props
 * @param {Array<Object>} props.threads - List of thread objects with calculated geometry.
 * @param {Function} props.onRemove - Callback to remove a thread from the list.
 * @param {string} props.unit - The unit of measurement (mm or in).
 */
const ThreadList = ({ threads, onRemove, unit }) => {
    // 1. Handle empty state
    if (threads.length === 0) {
        return (
            <div className="glass-panel" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                No threads in the list. Switch standards or add custom sizes below.
            </div>
        );
    }

    const isMetric = unit === 'mm';

    return (
        <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 md:p-8 shadow-2xl mb-8 w-full border-b-4 border-b-slate-900/60">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6 border-b border-slate-700/50 pb-4">
                Standard Sizes ({threads.length})
            </h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">
                    <thead>
                        <tr>
                            <th className="px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-700">Designation</th>
                            <th className="px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-700">{isMetric ? 'BA No.' : 'Size (in)'}</th>
                            <th className="px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-700 text-center">{isMetric ? 'Pitch (mm)' : 'TPI'}</th>
                            <th className="px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-700 text-right">Major (Basic)</th>
                            <th className="px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-700">Tap Drill Tool</th>
                            <th className="px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-700 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {threads.map((t, idx) => {
                            const primaryClass = t.classes['Medium'] || t.classes['Normal'] || Object.values(t.classes)[0];
                            const internalData = primaryClass?.internal;

                            return (
                                <tr key={`${t.designation}-${idx}`} className="group hover:bg-sky-500/10 transition-colors border-b border-slate-100/10">
                                    <td className="px-4 py-3 border-b border-slate-100/20">
                                        <div className="font-bold text-white text-sm tracking-tight group-hover:text-sky-400 transition-colors">{t.designation}</div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter opacity-60">{t.ctd}</div>
                                    </td>
                                    <td className="px-4 py-2 text-slate-300 font-mono text-xs border-b border-slate-100/20">{isMetric ? t.size : typeof t.size === 'number' ? t.size.toFixed(3) : t.size}</td>
                                    <td className="px-4 py-2 text-slate-300 font-mono text-xs border-b border-slate-100/20 text-center font-bold">{isMetric ? t.basic.p.toFixed(4) : t.tpi}</td>
                                    <td className="px-4 py-2 text-slate-300 font-mono text-xs border-b border-slate-100/20 text-right font-bold">{t.basic.major}</td>
                                    <td className="px-4 py-2 min-w-[200px] border-b border-slate-100/20">
                                        {internalData?.tapDrillName && !internalData.tapDrillValidation?.status?.startsWith('catastrophic') ? (
                                            <div className="flex flex-col gap-1">
                                                <div className="text-[10px] font-black text-white uppercase tracking-tight flex justify-between">
                                                    <span className="text-sky-400">{internalData.tapDrillName}</span>
                                                    <span className="text-slate-600">({internalData.tapDrillToolSize})</span>
                                                </div>
                                                <EngagementMeter
                                                    engagement={internalData.tapDrillValidation.engagement}
                                                    range={internalData.tapDrillValidation.range}
                                                    status={internalData.tapDrillValidation.status}
                                                />
                                            </div>
                                        ) : (
                                            <span className="text-[9px] text-rose-500 font-black uppercase tracking-widest italic opacity-30">
                                                No drill found
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 text-center border-b border-slate-100/20">
                                        <button
                                            onClick={() => onRemove(idx)}
                                            className="bg-[#EF4444] hover:bg-[#DC2626] text-[#0F172A] px-3 py-1.5 rounded-md text-xs font-bold transition-all transform active:scale-95 shadow-sm"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ThreadList;

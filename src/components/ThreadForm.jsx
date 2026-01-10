/**
 * @module components/ThreadForm
 * @description Provides a form for users to add custom thread sizes to the current list.
 * Dynamically adjusts fields based on whether the standard is Whitworth, BA, ME, or BSC.
 * 
 * @exports
 * - ThreadForm (default): React component for custom size entry.
 * 
 * @internal
 * - parseFraction: Converts fraction strings to decimal values.
 * - handleSubmit: Validates and processes the form submission.
 */

import React, { useState } from 'react';

/**
 * Form component for adding custom thread sizes.
 * Dynamically adjusts fields based on whether the standard is Whitworth or BA.
 * 
 * @param {Object} props
 * @param {Function} props.onAdd - Callback when a valid size is submitted.
 * @param {string} props.currentStandard - Name of the active thread standard.
 * @param {string} props.standardId - Unique ID of the active thread standard.
 */
const ThreadForm = ({ onAdd, currentStandard, standardId, inline = false, defaultSeries = '' }) => {
    const [designation, setDesignation] = useState('');
    const [size, setSize] = useState('');
    const [tpi, setTpi] = useState('');
    const [series, setSeries] = useState(defaultSeries);
    const [customSeries, setCustomSeries] = useState('');

    const isWhitworth = standardId === 'WHITWORTH';
    const isME = standardId === 'ME';
    const isBSC = standardId === 'BSC';
    const usesTpi = isWhitworth || isME || isBSC;

    // Series options based on standard
    const standardSeries = {
        'WHITWORTH': ['BSW', 'BSF'],
        'BA': ['BA'],
        'ME': ['Fine (40 TPI)', 'Medium (32 TPI)', 'BSB (26 TPI)'],
        'BSB': ['BSB'],
        'BSC': ['Standard', 'BSA']
    }[standardId] || [];

    const parseFraction = (f) => {
        if (!f || typeof f !== 'string') return parseFloat(f);
        if (!f.includes('/')) return parseFloat(f);
        const parts = f.trim().split(/\s+/);
        if (parts.length === 2) {
            const [whole, frat] = parts;
            const [num, den] = frat.split('/').map(Number);
            return parseFloat(whole) + (num / den);
        }
        const [num, den] = f.split('/').map(Number);
        return num / den;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // 1. Validate mandatory fields based on the standard's type
        if (!designation || !size) return;
        if (usesTpi && !tpi) return;

        // 2. Parse input dimensions
        // For TPI-based standards (Whitworth/ME/BSC), we allow fraction inputs (1/4")
        const nominalSize = usesTpi ? parseFraction(size) : size;
        const nominalFraction = (usesTpi && size.includes('/')) ? size : null;

        // 3. Handle custom series logic
        // If the user selected "+ New Series...", we use the custom text input instead.
        const finalSeries = series === 'CUSTOM' ? customSeries : (series || defaultSeries);

        onAdd({
            designation,
            size: nominalSize,
            nominalFraction,
            tpi: usesTpi ? parseFloat(tpi) : null,
            series: finalSeries
        });

        // 4. Reset form state for next entry
        setDesignation('');
        setSize('');
        setTpi('');
        setCustomSeries('');
    };

    if (inline) {
        return (
            <form onSubmit={handleSubmit} className="bg-slate-800/30 p-4 border-b border-slate-800">
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
                    <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 pl-1">New Designation</label>
                        <input
                            type="text"
                            placeholder="e.g. 1/4 Fine"
                            className="bg-slate-950/50 border border-slate-700/50 rounded-lg p-2 text-xs text-white outline-none focus:border-sky-500 transition-all"
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 pl-1">{usesTpi ? "Nominal Size (in)" : "BA Number"}</label>
                        <input
                            type="text"
                            placeholder={usesTpi ? "1/4 or 0.25" : "0"}
                            className="bg-slate-950/50 border border-slate-700/50 rounded-lg p-2 text-xs text-white outline-none focus:border-sky-500 transition-all"
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 pl-1">{usesTpi ? "TPI / Pitch" : "Placeholder"}</label>
                        {usesTpi ? (
                            <input
                                type="number"
                                step="any"
                                placeholder="20"
                                className="bg-slate-950/50 border border-slate-700/50 rounded-lg p-2 text-xs text-white outline-none focus:border-sky-500 transition-all"
                                value={tpi}
                                onChange={(e) => setTpi(e.target.value)}
                            />
                        ) : <div className="h-8" />}
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 pl-1">Series</label>
                        {series === 'CUSTOM' ? (
                            <input
                                type="text"
                                placeholder="Custom series name"
                                className="bg-slate-950/50 border border-slate-700/50 rounded-lg p-2 text-xs text-white outline-none focus:border-sky-500 transition-all"
                                value={customSeries}
                                onChange={(e) => setCustomSeries(e.target.value)}
                                autoFocus
                            />
                        ) : (
                            <select
                                className="bg-slate-950/50 border border-slate-700/50 rounded-lg p-2 text-xs text-slate-400 outline-none focus:border-sky-500 transition-all"
                                value={series || defaultSeries}
                                onChange={(e) => setSeries(e.target.value)}
                            >
                                {standardSeries.map(s => <option key={s} value={s}>{s}</option>)}
                                <option value="CUSTOM">+ New Series...</option>
                            </select>
                        )}
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-black uppercase text-[10px] tracking-widest py-2.5 rounded-lg transition-all shadow-lg shadow-sky-500/10 active:scale-95"
                        >
                            Add Custom
                        </button>
                    </div>
                </div>
            </form>
        );
    }

    return (
        <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 md:p-8 shadow-2xl mb-8 w-full border-t-4 border-t-sky-500/20">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-8 border-b border-slate-700/50 pb-4">
                Add Custom Size to {currentStandard}
            </h2>
            {/* ... rest of the original form JSX ... */}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Designation (Name)</label>
                        <input
                            type="text"
                            className="bg-slate-950/50 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-700 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 outline-none transition-all font-mono text-sm"
                            placeholder={isWhitworth ? "e.g. 1/4 BSW" : (isME ? "e.g. 1/4 ME" : "e.g. 2 BA")}
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">
                            {usesTpi ? 'Nominal Diameter (inches)' : 'BA Number'}
                        </label>
                        <input
                            type="text"
                            className="bg-slate-950/50 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-700 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 outline-none transition-all font-mono text-sm"
                            placeholder={isWhitworth || isME ? "e.g. 1/4 or 0.25" : "e.g. 2"}
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                        />
                    </div>
                    {usesTpi && (
                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Threads Per Inch (TPI)</label>
                            <input
                                type="number"
                                step="any"
                                className="bg-slate-950/50 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-700 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 outline-none transition-all font-mono text-sm"
                                placeholder="e.g. 20"
                                value={tpi}
                                onChange={(e) => setTpi(e.target.value)}
                            />
                        </div>
                    )}
                    <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Series</label>
                        {series === 'CUSTOM' ? (
                            <input
                                type="text"
                                placeholder="Custom series name"
                                className="bg-slate-950/50 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-700 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 outline-none transition-all font-mono text-sm"
                                value={customSeries}
                                onChange={(e) => setCustomSeries(e.target.value)}
                                autoFocus
                            />
                        ) : (
                            <select
                                className="bg-slate-950/50 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-sky-500 transition-all font-mono text-sm"
                                value={series || defaultSeries}
                                onChange={(e) => setSeries(e.target.value)}
                            >
                                {standardSeries.map(s => <option key={s} value={s}>{s}</option>)}
                                <option value="CUSTOM">+ New Series...</option>
                            </select>
                        )}
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black uppercase tracking-widest py-4 px-10 rounded-xl shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] transition-all transform hover:-translate-y-1 active:scale-95 text-xs"
                    >
                        Add Size
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ThreadForm;

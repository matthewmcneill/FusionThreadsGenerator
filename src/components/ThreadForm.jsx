/**
 * @module components/ThreadForm
 * @description Provides a form for users to add custom thread sizes to the current list.
 * 
 * Main functions:
 * - ThreadForm (default export): Renders the input fields and validation logic.
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
const ThreadForm = ({ onAdd, currentStandard, standardId }) => {
    const [designation, setDesignation] = useState('');
    const [size, setSize] = useState('');
    const [tpi, setTpi] = useState('');

    const isWhitworth = standardId === 'WHITWORTH';
    const isME = standardId === 'ME';
    const isBSC = standardId === 'BSC';
    const usesTpi = isWhitworth || isME || isBSC;

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

    /**
     * Handles form submission and validation.
     * @param {Event} e - Submit event object.
     */
    const handleSubmit = (e) => {
        // 1. Prevent default form submission and page reload
        e.preventDefault();

        // 2. Perform validation to ensure required fields are present
        if (!designation || !size) return;
        if (usesTpi && !tpi) return;

        // 3. Transform input values and pass to parent callback
        // Converts strings to numbers where appropriate for the calculator
        const nominalSize = usesTpi ? parseFraction(size) : size;
        const nominalFraction = (usesTpi && size.includes('/')) ? size : null;

        onAdd({
            designation,
            size: nominalSize,
            nominalFraction,
            tpi: usesTpi ? parseFloat(tpi) : null
        });

        // 4. Reset form state to clear inputs for next entry
        setDesignation('');
        setSize('');
        setTpi('');
    };

    return (
        <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 md:p-8 shadow-2xl mb-8 w-full border-t-4 border-t-sky-500/20">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-8 border-b border-slate-700/50 pb-4">
                Add Custom Size to {currentStandard}
            </h2>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
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

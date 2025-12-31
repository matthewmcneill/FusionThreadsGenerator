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
 */
const ThreadForm = ({ onAdd, currentStandard }) => {
    const [designation, setDesignation] = useState('');
    const [size, setSize] = useState('');
    const [tpi, setTpi] = useState('');

    const isWhitworth = currentStandard.includes('Whitworth');
    const isME = currentStandard.includes('ME');
    const usesTpi = isWhitworth || isME;

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
        <div className="glass-panel" style={{ marginBottom: '2rem' }}>
            <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Add Custom Size to {currentStandard}</h2>

            <form onSubmit={handleSubmit}>
                <div className="grid-form">
                    <div className="input-group">
                        <label>Designation (Name)</label>
                        <input
                            type="text"
                            placeholder={isWhitworth ? "e.g. 1/4 BSW" : (isME ? "e.g. 1/4 ME" : "e.g. 2 BA")}
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label>{usesTpi ? 'Nominal Diameter (inches)' : 'BA Number'}</label>
                        <input
                            type="text"
                            placeholder={isWhitworth || isME ? "e.g. 1/4 or 0.25" : "e.g. 2"}
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                        />
                    </div>
                    {usesTpi && (
                        <div className="input-group">
                            <label>Threads Per Inch (TPI)</label>
                            <input
                                type="number"
                                step="any"
                                placeholder="e.g. 20"
                                value={tpi}
                                onChange={(e) => setTpi(e.target.value)}
                            />
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <button type="submit">Add Size</button>
                </div>
            </form>
        </div>
    );
};

export default ThreadForm;

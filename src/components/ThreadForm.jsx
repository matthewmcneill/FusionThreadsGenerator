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

    /**
     * Handles form submission and validation.
     * @param {Event} e - Submit event.
     */
    const handleSubmit = (e) => {
        // 1. Prevent default reload
        e.preventDefault();

        // 2. Perform basic validation
        if (!designation || !size) return;
        if (isWhitworth && !tpi) return;

        // 3. Format and send data to parent
        onAdd({
            designation,
            size: isWhitworth ? parseFloat(size) : size,
            tpi: isWhitworth ? parseFloat(tpi) : null
        });

        // 4. Clear form
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
                            placeholder={isWhitworth ? "e.g. 1/4 BSW" : "e.g. 2 BA"}
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label>{isWhitworth ? 'Nominal Diameter (inches)' : 'BA Number'}</label>
                        <input
                            type={isWhitworth ? "number" : "text"}
                            step="any"
                            placeholder={isWhitworth ? "e.g. 0.25" : "e.g. 2"}
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                        />
                    </div>
                    {isWhitworth && (
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


import React, { useState } from 'react';

const ThreadForm = ({ onAdd, onGenerate }) => {
    // Local state for inputs
    const [designation, setDesignation] = useState(''); // e.g. "1/4 BSW"
    const [size, setSize] = useState(''); // Nominal diameter
    const [tpi, setTpi] = useState(''); // Threads per inch

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!designation || !size || !tpi) return;

        onAdd({
            designation,
            size: parseFloat(size),
            tpi: parseFloat(tpi)
        });

        // Reset fields (optional, maybe keep for easy next entry?)
        // setDesignation(''); 
        // setSize('');
        // setTpi('');
    };

    // Pre-fill Logic helper (could be expanded)
    const handlePreset = (e) => {
        const val = e.target.value;
        if (val === '1/4 BSW') {
            setDesignation('1/4 BSW');
            setSize('0.25');
            setTpi('20');
        }
        // Add more presets later or via config
    };

    return (
        <div className="glass-panel">
            <h2 style={{ marginTop: 0, textAlign: 'left' }}>Add Thread Size</h2>
            <form onSubmit={handleSubmit}>
                <div className="grid-form">
                    <div className="input-group">
                        <label>Designation (Name)</label>
                        <input
                            type="text"
                            placeholder="e.g. 1/4 BSW"
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label>Nominal Diameter (inches)</label>
                        <input
                            type="number"
                            step="any"
                            placeholder="e.g. 0.25"
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                        />
                    </div>
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
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                    {/* Preset demo */}
                    <select onChange={handlePreset} style={{ width: 'auto', background: 'rgba(255,255,255,0.1)' }}>
                        <option value="">Select Preset...</option>
                        <option value="1/4 BSW">1/4 BSW</option>
                        {/* TODO: Add full BSW table */}
                    </select>

                    <button type="submit">Add Size</button>
                </div>
            </form>
        </div>
    );
};

export default ThreadForm;

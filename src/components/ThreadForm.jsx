
import React, { useState } from 'react';

const ThreadForm = ({ onAdd, currentStandard, onStandardChange }) => {
    // Local state for inputs
    const [designation, setDesignation] = useState('');
    const [size, setSize] = useState('');
    const [tpi, setTpi] = useState('');

    const isWhitworth = currentStandard === 'Whitworth';

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!designation || !size) return;
        if (isWhitworth && !tpi) return;

        onAdd({
            designation,
            size: isWhitworth ? parseFloat(size) : size, // BA size is number string
            tpi: isWhitworth ? parseFloat(tpi) : null
        });

        // Reset fields
        setDesignation('');
        setSize('');
        setTpi('');
    };

    const handlePreset = (e) => {
        const val = e.target.value;
        if (!val) return;

        if (isWhitworth) {
            if (val === '1/4 BSW') {
                setDesignation('1/4 BSW');
                setSize('0.25');
                setTpi('20');
            } else if (val === '1/2 BSW') {
                setDesignation('1/2 BSW');
                setSize('0.5');
                setTpi('12');
            }
        } else {
            // BA Presets
            setDesignation(`${val} BA`);
            setSize(val);
            setTpi(''); // Not used for BA calculator as it's lookup based
        }
    };

    return (
        <div className="glass-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0 }}>Add Thread Size</h2>
                <div className="input-group" style={{ margin: 0, flexDirection: 'row', alignItems: 'center' }}>
                    <label style={{ marginRight: '1rem' }}>Standard:</label>
                    <select
                        value={currentStandard}
                        onChange={(e) => onStandardChange(e.target.value)}
                        style={{ width: 'auto' }}
                    >
                        <option value="Whitworth">Whitworth</option>
                        <option value="BA Threads">BA</option>
                    </select>
                </div>
            </div>

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

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                    <select onChange={handlePreset} style={{ width: 'auto', background: 'rgba(255,255,255,0.1)' }}>
                        <option value="">Select Preset...</option>
                        {isWhitworth ? (
                            <>
                                <option value="1/4 BSW">1/4 BSW</option>
                                <option value="1/2 BSW">1/2 BSW</option>
                            </>
                        ) : (
                            <>
                                <option value="0">0 BA</option>
                                <option value="2">2 BA</option>
                                <option value="4">4 BA</option>
                                <option value="6">6 BA</option>
                            </>
                        )}
                    </select>

                    <button type="submit">Add Size</button>
                </div>
            </form>
        </div>
    );
};

export default ThreadForm;

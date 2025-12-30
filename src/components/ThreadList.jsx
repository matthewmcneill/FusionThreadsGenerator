
import React from 'react';

const ThreadList = ({ threads, onRemove, unit }) => {
    if (threads.length === 0) {
        return (
            <div className="glass-panel" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                No threads added yet. Use the form above to add a size.
            </div>
        );
    }

    const isMetric = unit === 'mm';

    return (
        <div className="glass-panel">
            <h2 style={{ marginTop: 0, textAlign: 'left' }}>Defined Sizes ({threads.length})</h2>
            <div style={{ overflowX: 'auto' }}>
                <table>
                    <thead>
                        <tr>
                            <th>Designation</th>
                            <th>{isMetric ? 'BA No.' : 'Size (in)'}</th>
                            <th>{isMetric ? 'Pitch (mm)' : 'TPI'}</th>
                            <th>Major</th>
                            <th>Minor</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {threads.map((t, idx) => (
                            <tr key={idx}>
                                <td>{t.designation}</td>
                                <td>{isMetric ? t.size : t.size.toFixed(3)}</td>
                                <td>{isMetric ? t.basic.p.toFixed(4) : t.tpi}</td>
                                <td>{t.external.major}</td>
                                <td>{t.internal.minor}</td>
                                <td className="row-actions">
                                    <button onClick={() => onRemove(idx)}>Remove</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ThreadList;

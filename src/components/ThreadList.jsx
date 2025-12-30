
import React from 'react';

const ThreadList = ({ threads, onRemove }) => {
    if (threads.length === 0) {
        return (
            <div className="glass-panel" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                No threads added yet. Use the form above to add a size.
            </div>
        );
    }

    return (
        <div className="glass-panel">
            <h2 style={{ marginTop: 0, textAlign: 'left' }}>Defined Sizes ({threads.length})</h2>
            <div style={{ overflowX: 'auto' }}>
                <table>
                    <thead>
                        <tr>
                            <th>Designation</th>
                            <th>Size (in)</th>
                            <th>TPI</th>
                            <th>Pitch (in)</th>
                            <th>Major (Ext)</th>
                            <th>Minor (Int)</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {threads.map((t, idx) => (
                            <tr key={idx}>
                                <td>{t.designation}</td>
                                <td>{t.size}</td>
                                <td>{t.tpi}</td>
                                <td>{(1 / t.tpi).toFixed(4)}</td>
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

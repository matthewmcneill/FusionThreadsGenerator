/**
 * @module components/ThreadList
 * @description Displays the list of defined threads in a tabular format for review.
 * 
 * Main functions:
 * - ThreadList (default export): Renders the table of thread data.
 */

import React from 'react';

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
                No threads in the list. Switch standards or add custom sizes above.
            </div>
        );
    }

    const isMetric = unit === 'mm';

    return (
        <div className="glass-panel">
            <h2 style={{ marginTop: 0, textAlign: 'left', marginBottom: '1.5rem' }}>
                Defined Sizes ({threads.length})
            </h2>
            <div style={{ overflowX: 'auto' }}>
                <table>
                    <thead>
                        <tr>
                            <th>Designation</th>
                            <th>CTD (Export)</th>
                            <th>{isMetric ? 'BA No.' : 'Size (in)'}</th>
                            <th>{isMetric ? 'Pitch (mm)' : 'TPI'}</th>
                            <th>Major (Basic)</th>
                            <th>Minor (Basic)</th>
                            <th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* 2. Map through threads to render rows */}
                        {threads.map((t, idx) => (
                            <tr key={`${t.designation}-${idx}`}>
                                <td>{t.designation}</td>
                                <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t.ctd}</td>
                                <td>{isMetric ? t.size : typeof t.size === 'number' ? t.size.toFixed(3) : t.size}</td>
                                <td>{isMetric ? t.basic.p.toFixed(4) : t.tpi}</td>
                                <td>{t.basic.major}</td>
                                <td>{t.basic.minor}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <button
                                        onClick={() => onRemove(idx)}
                                        style={{
                                            padding: '0.4rem 0.8rem',
                                            background: '#ef4444',
                                            fontSize: '0.9rem',
                                            boxShadow: 'none'
                                        }}
                                    >
                                        Remove
                                    </button>
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

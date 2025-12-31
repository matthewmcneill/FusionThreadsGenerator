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
        <div className="glass-panel">
            <h2 style={{ marginTop: 0, textAlign: 'left', marginBottom: '1.5rem' }}>
                Standard Sizes ({threads.length})
            </h2>
            <div style={{ overflowX: 'auto' }}>
                <table>
                    <thead>
                        <tr>
                            <th>Designation</th>
                            <th>{isMetric ? 'BA No.' : 'Size (in)'}</th>
                            <th>{isMetric ? 'Pitch (mm)' : 'TPI'}</th>
                            <th>Major (Basic)</th>
                            <th>Tap Drill Tool</th>
                            <th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* 2. Map through threads to render rows */}
                        {threads.map((t, idx) => {
                            // Find the first internal class (typically Medium or Normal) to show a drill preview
                            const primaryClass = t.classes['Medium'] || t.classes['Normal'] || Object.values(t.classes)[0];
                            const internalData = primaryClass?.internal;

                            return (
                                <tr key={`${t.designation}-${idx}`}>
                                    <td>
                                        <div>{t.designation}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{t.ctd}</div>
                                    </td>
                                    <td>{isMetric ? t.size : typeof t.size === 'number' ? t.size.toFixed(3) : t.size}</td>
                                    <td>{isMetric ? t.basic.p.toFixed(4) : t.tpi}</td>
                                    <td>{t.basic.major}</td>
                                    <td style={{ minWidth: '150px' }}>
                                        {internalData?.tapDrillName && !internalData.tapDrillValidation?.status?.startsWith('catastrophic') ? (
                                            <div style={{ padding: '0.2rem 0' }}>
                                                <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
                                                    {internalData.tapDrillName} ({internalData.tapDrillToolSize})
                                                </div>
                                                <EngagementMeter
                                                    engagement={internalData.tapDrillValidation.engagement}
                                                    range={internalData.tapDrillValidation.range}
                                                    status={internalData.tapDrillValidation.status}
                                                />
                                            </div>
                                        ) : (
                                            <span style={{ opacity: 0.5, fontStyle: 'italic', fontSize: '0.8rem' }}>
                                                No safe drill
                                            </span>
                                        )}
                                    </td>
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
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ThreadList;

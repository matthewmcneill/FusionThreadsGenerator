import React, { useState } from 'react';

/**
 * @module components/ThreadPreview
 * @description Renders a comprehensive, manual-style table of thread data.
 */

const ThreadPreview = ({ threads, selectedClasses, unit }) => {
    const [copied, setCopied] = useState(false);

    if (!threads || threads.length === 0) {
        return (
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                <p style={{ opacity: 0.6 }}>No threads selected to preview.</p>
            </div>
        );
    }

    // Helper to format decimals to 4 places
    const f = (val) => (typeof val === 'number' ? val.toFixed(4) : '-');

    // Group threads by Nominal Size
    const groupedBySize = threads.reduce((acc, t) => {
        const sizeKey = t.nominalFraction || t.size.toString();
        if (!acc[sizeKey]) acc[sizeKey] = [];
        acc[sizeKey].push(t);
        return acc;
    }, {});

    const isImperial = unit === 'in';

    /**
     * Copies the table data to clipboard in a clean Markdown format.
     */
    const handleCopy = () => {
        const headers = ['Nominal Size', 'Designation', isImperial ? 'TPI' : 'Pitch (mm)', 'Gender', 'Class', 'Major Dia', 'Pitch Dia', 'Minor Dia', 'Tap Drill'];
        let rows = [headers.join('\t')];

        // Sort groups by the decimal size of their first thread
        const sortedGroups = Object.entries(groupedBySize).sort((a, b) => a[1][0].size - b[1][0].size);

        sortedGroups.forEach(([sizeKey, sizeThreads]) => {
            const sizeValue = isImperial
                ? (sizeThreads[0].nominalFraction
                    ? `${sizeThreads[0].nominalFraction} (${f(sizeThreads[0].size)})`
                    : f(sizeThreads[0].size))
                : sizeKey;

            sizeThreads.forEach((thread) => {
                const activeClasses = selectedClasses.filter(c => thread.classes[c]);
                const pitchValue = isImperial ? thread.tpi : f(thread.basic.p);

                ['External', 'Internal'].forEach((gender) => {
                    activeClasses.forEach((cls) => {
                        const c = thread.classes[cls];
                        const data = gender === 'External' ? c.external : c.internal;
                        if (!data) return;

                        let diaRange;
                        if (gender === 'External') {
                            diaRange = {
                                major: `${f(data.majorMin)}-${f(data.major)}`,
                                pitch: `${f(data.pitchMin)}-${f(data.pitch)}`,
                                minor: `${f(data.minorMin)}-${f(data.minor)}`,
                                tapDrill: '-'
                            };
                        } else {
                            diaRange = {
                                major: `${f(data.major)}-${f(data.major + 0.01)}`,
                                pitch: `${f(data.pitch)}-${f(data.pitchMax)}`,
                                minor: `${f(data.minor)}-${f(data.minorMax)}`,
                                tapDrill: data.tapDrillName ? `${data.tapDrillName} (${f(data.tapDrill)})` : f(data.tapDrill)
                            };
                        }

                        rows.push([
                            sizeValue,
                            thread.designation,
                            pitchValue,
                            gender,
                            cls,
                            diaRange.major,
                            diaRange.pitch,
                            diaRange.minor,
                            diaRange.tapDrill
                        ].join('\t'));
                    });
                });
            });
        });

        const tableText = rows.join('\n');
        navigator.clipboard.writeText(tableText).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="preview-container glass-panel">
            <div className="preview-header">
                <h3>Thread Specification Table</h3>
                <button
                    onClick={handleCopy}
                    className={`copy-btn ${copied ? 'copied' : ''}`}
                >
                    {copied ? 'Copied' : 'Copy'}
                </button>
            </div>
            <div className="preview-scroll-area">
                <table className="preview-table">
                    <thead>
                        <tr>
                            <th>Nominal Size</th>
                            <th>Designation</th>
                            <th>{isImperial ? 'TPI' : 'Pitch (mm)'}</th>
                            <th>Gender</th>
                            <th>Class</th>
                            <th>Major Dia</th>
                            <th>Pitch Dia</th>
                            <th>Minor Dia</th>
                            <th>Tap Drill</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(groupedBySize)
                            .sort((a, b) => a[1][0].size - b[1][0].size)
                            .map(([sizeKey, sizeThreads]) => {
                                // Calculate total rows for this size to handle rowSpan correctly
                                const sizeTotalRows = sizeThreads.reduce((sum, t) => {
                                    const activeClasses = selectedClasses.filter(c => t.classes[c]);
                                    let rowsForThread = 0;
                                    ['External', 'Internal'].forEach(gender => {
                                        rowsForThread += activeClasses.filter(cls => t.classes[cls][gender.toLowerCase()]).length;
                                    });
                                    return sum + rowsForThread;
                                }, 0);

                                const sizeDisplay = isImperial
                                    ? (sizeThreads[0].nominalFraction
                                        ? `${sizeThreads[0].nominalFraction} (${f(sizeThreads[0].size)})`
                                        : f(sizeThreads[0].size))
                                    : sizeKey;

                                let sizeRowUsed = false;

                                return sizeThreads.map((thread, threadIdx) => {
                                    const activeClasses = selectedClasses.filter(c => thread.classes[c]);

                                    // Total rows for this thread across all valid gender/class combinations
                                    const threadTotalRows = ['External', 'Internal'].reduce((sum, gender) => {
                                        return sum + activeClasses.filter(cls => thread.classes[cls][gender.toLowerCase()]).length;
                                    }, 0);

                                    let threadRowUsed = false;

                                    return ['External', 'Internal'].map((gender) => {
                                        const genderClasses = activeClasses.filter(cls => thread.classes[cls][gender.toLowerCase()]);
                                        const genderTotalRows = genderClasses.length;
                                        let genderRowUsed = false;

                                        if (genderTotalRows === 0) return null;

                                        return genderClasses.map((cls, clsIdx) => {
                                            const c = thread.classes[cls];
                                            const data = gender === 'External' ? c.external : c.internal;

                                            const isFirstInSize = !sizeRowUsed;
                                            const isFirstInThread = !threadRowUsed;
                                            const isFirstInGender = !genderRowUsed;

                                            sizeRowUsed = true;
                                            threadRowUsed = true;
                                            genderRowUsed = true;

                                            return (
                                                <tr key={`${thread.designation}-${gender}-${cls}`} className={`${gender.toLowerCase()}-row`}>
                                                    {isFirstInSize && (
                                                        <td rowSpan={sizeTotalRows} className="size-column">
                                                            {sizeDisplay}
                                                        </td>
                                                    )}
                                                    {isFirstInThread && (
                                                        <td rowSpan={threadTotalRows} className="designation-column">
                                                            {thread.designation}
                                                        </td>
                                                    )}
                                                    {isFirstInThread && (
                                                        <td rowSpan={threadTotalRows} className="num-column">
                                                            {isImperial ? thread.tpi : f(thread.basic.p)}
                                                        </td>
                                                    )}
                                                    {isFirstInGender && (
                                                        <td rowSpan={genderTotalRows} className="gender-column" style={{ color: gender === 'External' ? 'var(--accent-primary)' : 'var(--accent-secondary)' }}>
                                                            {gender}
                                                        </td>
                                                    )}
                                                    <td className="class-column">{cls}</td>

                                                    {/* Major Dia */}
                                                    <td className="num-column">
                                                        <div className="limit-range">
                                                            <span className="nominal">{f(data.major)}</span>
                                                            <span className="limits">
                                                                ({gender === 'External' ? `${f(data.majorMin)} - ${f(data.major)}` : `${f(data.major)} - ${f(data.major + 0.01)}`})
                                                            </span>
                                                        </div>
                                                    </td>

                                                    {/* Pitch Dia */}
                                                    <td className="num-column">
                                                        <div className="limit-range">
                                                            <span className="nominal">{f(data.pitch)}</span>
                                                            <span className="limits">
                                                                ({gender === 'External' ? `${f(data.pitchMin)} - ${f(data.pitch)}` : `${f(data.pitch)} - ${f(data.pitchMax)}`})
                                                            </span>
                                                        </div>
                                                    </td>

                                                    {/* Minor Dia */}
                                                    <td className="num-column">
                                                        <div className="limit-range">
                                                            <span className="nominal">{f(data.minor)}</span>
                                                            <span className="limits">
                                                                ({gender === 'External' ? `${f(data.minorMin)} - ${f(data.minor)}` : `${f(data.minor)} - ${f(data.minorMax)}`})
                                                            </span>
                                                        </div>
                                                    </td>

                                                    {/* Tap Drill */}
                                                    <td className="num-column">
                                                        {gender === 'External' ? '-' : (
                                                            <div className="drill-recommendation">
                                                                {data.tapDrillName ? (
                                                                    <>
                                                                        <div className="drill-row">
                                                                            <span className="drill-label">Tool:</span>
                                                                            <span
                                                                                className="drill-name"
                                                                                style={{ color: data.tapDrillValidation?.color || 'inherit' }}
                                                                            >
                                                                                {data.tapDrillName} ({f(data.tapDrillToolSize)})
                                                                            </span>
                                                                        </div>
                                                                        <div className="drill-row">
                                                                            <span className="drill-label">Target:</span>
                                                                            <span className="drill-size">{f(data.tapDrillTarget)}</span>
                                                                        </div>
                                                                        {data.tapDrillValidation && (
                                                                            <div
                                                                                className="drill-status"
                                                                                style={{ color: data.tapDrillValidation.color }}
                                                                            >
                                                                                {data.tapDrillValidation.label} ({Math.round(data.tapDrillValidation.engagement)}%)
                                                                            </div>
                                                                        )}
                                                                    </>
                                                                ) : '-'}
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        });
                                    });
                                });
                            })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ThreadPreview;

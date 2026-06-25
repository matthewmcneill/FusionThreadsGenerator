import React, { useState } from 'react';
import EngagementMeter from './EngagementMeter';

/**
 * @module components/ThreadPreview
 * @description Renders a comprehensive, manual-style table of thread data.
 * Supports bidirectional hierarchical highlighting and markdown copy to clipboard.
 * 
 * @exports
 * - ThreadPreview (default): React component for data visualization.
 * 
 * @internal
 * - handleCopy: Formats and copies table data to the clipboard.
 * 
 * @param {Object} props
 * @param {Array<Object>} props.threads - List of thread objects to display.
 * @param {Array<string>} props.selectedClasses - Tolerance classes to include.
 * @param {string} props.unit - Base unit ('in' or 'mm').
 */
const ThreadPreview = ({ threads, selectedClasses, unit }) => {
    const [copied, setCopied] = useState(false);
    // Track hierarchical hover state (Size -> Thread -> Gender -> Class)
    const [hoveredPath, setHoveredPath] = useState({ size: null, designation: null, gender: null, cls: null });

    if (!threads || threads.length === 0) {
        return (
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                <p style={{ opacity: 0.6 }}>No threads selected to preview.</p>
            </div>
        );
    }

    // Helper to format decimals to 4 places
    const f = (val) => (typeof val === 'number' ? val.toFixed(4) : '');

    // Group threads by Nominal Size
    const groupedBySize = threads.reduce((acc, t) => {
        const sizeKey = t.nominalFraction || t.size.toString();
        if (!acc[sizeKey]) acc[sizeKey] = [];
        acc[sizeKey].push(t);
        return acc;
    }, {});

    const isImperial = unit === 'in';

    /**
     * Copies the table data to clipboard in a clean, columnar TSV format.
     * Optimized for pasting into spreadsheet applications like Excel.
     */
    const handleCopy = () => {
        const headers = [
            'Nominal Size',
            'Designation',
            isImperial ? 'TPI' : 'Pitch (mm)',
            'Gender',
            'Class',
            'Major Nominal',
            'Major Min',
            'Major Max',
            'Pitch Nominal',
            'Pitch Min',
            'Pitch Max',
            'Minor Nominal',
            'Minor Min',
            'Minor Max',
            'Tap Drill Tool',
            'Tap Drill Size',
            'Tap Drill Target',
            'Engagement %',
            'Fit Status',
            'Turn Blank Diameter',
            'Turn Plunge (Radial)',
            'Turn Compound Angle',
            'Turn Compound Travel'
        ];
        let rows = [headers.join('\t')];

        // Sort groups by the decimal size of their first thread
        const sortedGroups = Object.entries(groupedBySize).sort((a, b) => a[1][0].size - b[1][0].size);

        // Processes the nested data structure into a flat, tab-separated format 
        // that retains the hierarchical information in row format.
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

                        let drillInfo = {
                            toolName: '',
                            toolSize: '',
                            target: '',
                            engagement: '',
                            status: ''
                        };

                        // Extract tapping drill metadata specifically for internal threads
                        if (gender === 'Internal' && data.tapDrillName) {
                            drillInfo = {
                                toolName: data.tapDrillName,
                                toolSize: f(data.tapDrillToolSize),
                                target: f(data.tapDrillTarget),
                                engagement: `${Math.round(data.tapDrillValidation?.engagement)}%`,
                                status: data.tapDrillValidation?.label || ''
                            };
                        }

                        let turnInfo = {
                            blank: '',
                            plunge: '',
                            angle: '',
                            depth: ''
                        };

                        // Extract turning metadata specifically for external threads
                        if (gender === 'External' && thread.basic.turning) {
                            turnInfo = {
                                blank: f(thread.basic.turning.turnDia),
                                plunge: f(thread.basic.turning.radialDepth),
                                angle: `${thread.basic.turning.compoundAngle}°`,
                                depth: f(thread.basic.turning.compoundDepth)
                            };
                        }

                        rows.push([
                            sizeValue,
                            thread.designation,
                            pitchValue,
                            gender,
                            cls,
                            // Major Dia (Nominal, Min, Max)
                            f(data.major),
                            gender === 'External' ? f(data.majorMin) : f(data.major),
                            gender === 'External' ? f(data.major) : f(data.major + 0.01),
                            // Pitch Dia (Nominal, Min, Max)
                            f(data.pitch),
                            gender === 'External' ? f(data.pitchMin) : f(data.pitch),
                            gender === 'External' ? f(data.pitch) : f(data.pitchMax),
                            // Minor Dia (Nominal, Min, Max)
                            f(data.minor),
                            gender === 'External' ? f(data.minorMin) : f(data.minor),
                            gender === 'External' ? f(data.minor) : f(data.minorMax),
                            // Internal Workshop Data
                            drillInfo.toolName,
                            drillInfo.toolSize,
                            drillInfo.target,
                            drillInfo.engagement,
                            drillInfo.status,
                            // External Workshop Data
                            turnInfo.blank,
                            turnInfo.plunge,
                            turnInfo.angle,
                            turnInfo.depth
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
        <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl mb-8 w-full">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-700/50 bg-slate-900/80">
                <h3 className="text-sm font-black text-sky-400 uppercase tracking-widest">
                    Thread Specification Table
                </h3>
                <button
                    onClick={handleCopy}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${copied
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                        : 'bg-slate-800/80 text-sky-400 border-sky-400/30 hover:bg-sky-500 hover:text-slate-950'
                        }`}
                >
                    {copied ? 'Copied' : 'Copy for Spreadsheet'}
                </button>
            </div>
            <div className="overflow-x-auto max-h-[75vh]">
                <table className="w-full text-left border-collapse border-separate border-spacing-0">
                    <thead className="sticky top-0 z-20">
                        <tr className="bg-slate-900 border-b-2 border-slate-700">
                            <th className="px-4 py-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-700">Nominal Size</th>
                            <th className="px-4 py-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-700">Designation</th>
                            <th className="px-4 py-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-700">{isImperial ? 'TPI' : 'Pitch (mm)'}</th>
                            <th className="px-4 py-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-700">Gender</th>
                            <th className="px-4 py-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-700">Class</th>
                            <th className="px-4 py-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-700 text-right">Major Dia</th>
                            <th className="px-4 py-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-700 text-right">Pitch Dia</th>
                            <th className="px-4 py-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-700 text-right">Minor Dia</th>
                            <th className="px-4 py-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-700">Workshop Data</th>
                        </tr>
                    </thead>
                    <tbody
                        className="font-mono text-xs leading-normal"
                        onMouseLeave={() => setHoveredPath({ size: null, designation: null, gender: null, cls: null })}
                    >
                        {Object.entries(groupedBySize)
                            .sort((a, b) => a[1][0].size - b[1][0].size)
                            .map(([sizeKey, sizeThreads]) => {
                                // Calculate total row count for the nominal size block to set rowSpan.
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
                                    const threadTotalRows = ['External', 'Internal'].reduce((sum, gender) => {
                                        return sum + activeClasses.filter(cls => thread.classes[cls][gender.toLowerCase()]).length;
                                    }, 0);

                                    let threadRowUsed = false;

                                    return ['External', 'Internal'].map((gender) => {
                                        const genderClasses = activeClasses.filter(cls => thread.classes[cls][gender.toLowerCase()]);
                                        const genderTotalRows = genderClasses.length;
                                        let genderRowUsed = false;

                                        if (genderTotalRows === 0) return null;

                                        return genderClasses.map((cls) => {
                                            const c = thread.classes[cls];
                                            const data = gender === 'External' ? c.external : c.internal;

                                            const isFirstInSize = !sizeRowUsed;
                                            const isFirstInThread = !threadRowUsed;
                                            const isFirstInGender = !genderRowUsed;

                                            sizeRowUsed = true;
                                            threadRowUsed = true;
                                            genderRowUsed = true;

                                            // Determine current highlight scope
                                            const isSizeMatch = hoveredPath.size === sizeKey;
                                            const isThreadMatch = isSizeMatch && (hoveredPath.designation === null || hoveredPath.designation === thread.designation);
                                            const isGenderMatch = isThreadMatch && (hoveredPath.gender === null || hoveredPath.gender === gender);
                                            const isRowMatch = isGenderMatch && (hoveredPath.cls === null || hoveredPath.cls === cls);

                                            // Highlight levels
                                            const isSizeHighlighted = isSizeMatch;
                                            const isThreadHighlighted = isThreadMatch;
                                            const isGenderHighlighted = isGenderMatch;
                                            const isRowHighlighted = isRowMatch;

                                            return (
                                                <tr
                                                    key={`${thread.designation}-${gender}-${cls}`}
                                                    onMouseEnter={() => setHoveredPath({ size: sizeKey, designation: thread.designation, gender, cls })}
                                                    className={`transition-colors duration-150 ${isRowHighlighted ? 'bg-sky-500/20' : (threadIdx % 2 === 0 ? 'bg-slate-900/40' : 'bg-transparent')}`}
                                                >
                                                    {isFirstInSize && (
                                                        <td
                                                            rowSpan={sizeTotalRows}
                                                            onMouseEnter={(e) => {
                                                                e.stopPropagation();
                                                                setHoveredPath({ size: sizeKey, designation: null, gender: null, cls: null });
                                                            }}
                                                            className={`px-4 py-3 border-r border-b border-slate-700/50 font-black uppercase tracking-tighter align-top text-xs transition-colors duration-200 ${isSizeHighlighted ? 'bg-sky-500/15 text-sky-300' : 'bg-slate-400/[0.02] text-slate-400'}`}
                                                        >
                                                            {sizeDisplay}
                                                        </td>
                                                    )}
                                                    {isFirstInThread && (
                                                        <td
                                                            rowSpan={threadTotalRows}
                                                            onMouseEnter={(e) => {
                                                                e.stopPropagation();
                                                                setHoveredPath({ size: sizeKey, designation: thread.designation, gender: null, cls: null });
                                                            }}
                                                            className={`px-4 py-3 border-r border-b border-slate-700/50 font-black align-top uppercase tracking-tighter text-xs transition-colors duration-200 ${isThreadHighlighted ? 'bg-sky-500/15 text-sky-300 border-sky-500/30' : 'text-sky-400'}`}
                                                        >
                                                            {thread.designation}
                                                        </td>
                                                    )}
                                                    {isFirstInThread && (
                                                        <td
                                                            rowSpan={threadTotalRows}
                                                            onMouseEnter={(e) => {
                                                                e.stopPropagation();
                                                                setHoveredPath({ size: sizeKey, designation: thread.designation, gender: null, cls: null });
                                                            }}
                                                            className={`px-4 py-3 text-center border-r border-b border-slate-700/50 font-bold align-top text-xs transition-colors duration-200 ${isThreadHighlighted ? 'bg-sky-500/10 text-slate-300' : 'text-slate-500'}`}
                                                        >
                                                            {isImperial ? thread.tpi : f(thread.basic.p)}
                                                        </td>
                                                    )}
                                                    {isFirstInGender && (
                                                        <td
                                                            rowSpan={genderTotalRows}
                                                            onMouseEnter={(e) => {
                                                                e.stopPropagation();
                                                                setHoveredPath({ size: sizeKey, designation: thread.designation, gender, cls: null });
                                                            }}
                                                            className={`px-3 py-3 font-black uppercase text-[10px] text-center border-r border-b align-top tracking-[0.1em] transition-colors duration-200 ${isGenderHighlighted ? 'bg-sky-500/15 text-sky-400 border-sky-500/30' : `border-slate-100/20 ${gender === 'External' ? 'text-sky-500/60' : 'text-amber-500/60'}`}`}
                                                        >
                                                            {gender}
                                                        </td>
                                                    )}
                                                    <td className={`px-4 py-3 text-center border-r border-b border-slate-100/20 font-black text-xs uppercase tracking-tighter transition-colors duration-200 ${isRowHighlighted ? 'text-sky-300' : 'text-slate-400'}`}>{cls}</td>

                                                    {/* Major Dia */}
                                                    <td className="px-4 py-2 border-r border-b border-slate-100/20">
                                                        <div className="flex flex-col items-end leading-tight">
                                                            <span className={`font-black tracking-tighter transition-colors duration-200 ${isRowHighlighted ? 'text-sky-200' : 'text-slate-200'}`}>{f(data.major)}</span>
                                                            <span className="text-[10px] text-slate-600 font-bold tracking-tighter">
                                                                ({gender === 'External' ? `${f(data.majorMin)} - ${f(data.major)}` : `${f(data.major)} - ${f(data.major + 0.01)}`})
                                                            </span>
                                                        </div>
                                                    </td>

                                                    {/* Pitch Dia */}
                                                    <td className="px-4 py-2 border-r border-b border-slate-100/20">
                                                        <div className="flex flex-col items-end leading-tight">
                                                            <span className={`font-black tracking-tighter transition-colors duration-200 ${isRowHighlighted ? 'text-sky-200' : 'text-slate-200'}`}>{f(data.pitch)}</span>
                                                            <span className="text-[10px] text-slate-600 font-bold tracking-tighter">
                                                                ({gender === 'External' ? `${f(data.pitchMin)} - ${f(data.pitch)}` : `${f(data.pitch)} - ${f(data.pitchMax)}`})
                                                            </span>
                                                        </div>
                                                    </td>

                                                    {/* Minor Dia */}
                                                    <td className="px-4 py-2 border-r border-b border-slate-100/20">
                                                        <div className="flex flex-col items-end leading-tight">
                                                            <span className={`font-black tracking-tighter transition-colors duration-200 ${isRowHighlighted ? 'text-sky-200' : 'text-slate-200'}`}>{f(data.minor)}</span>
                                                            <span className="text-[10px] text-slate-600 font-bold tracking-tighter">
                                                                ({gender === 'External' ? `${f(data.minorMin)} - ${f(data.minor)}` : `${f(data.minor)} - ${f(data.minorMax)}`})
                                                            </span>
                                                        </div>
                                                    </td>

                                                    {/* Workshop Data */}
                                                    <td className="px-4 py-2 border-b border-slate-100/20 min-w-[210px] align-top">
                                                        {gender === 'External' ? (
                                                            <div className="flex flex-col gap-1.5 py-1">
                                                                {thread.basic.turning ? (
                                                                    <>
                                                                        <div className="flex justify-between items-center border-b border-slate-800/50 pb-1">
                                                                            <span className="text-[9px] text-slate-500 font-black uppercase tracking-tight">Blank Diameter</span>
                                                                            <span className="text-[11px] text-emerald-400 font-mono font-black">{f(thread.basic.turning.turnDia)}</span>
                                                                        </div>
                                                                        <div className="flex justify-between items-center border-b border-slate-800/50 pb-1">
                                                                            <span className="text-[9px] text-slate-500 font-black uppercase tracking-tight">Plunge (Radial)</span>
                                                                            <span className="text-[11px] text-sky-400 font-mono font-black">{f(thread.basic.turning.radialDepth)}</span>
                                                                        </div>
                                                                        <div className="flex justify-between items-center">
                                                                            <span className="text-[9px] text-slate-500 font-black uppercase tracking-tight">Compound Slide</span>
                                                                            <span className="text-[11px] text-amber-400 font-mono font-black">
                                                                                {thread.basic.turning.compoundAngle}° @ {f(thread.basic.turning.compoundDepth)}
                                                                            </span>
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <div className="text-[9px] text-slate-600 italic">Turning data unavailable</div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col gap-1.5 py-1">
                                                                {data.tapDrillName && !data.tapDrillValidation?.status?.startsWith('catastrophic') ? (
                                                                    <>
                                                                        <div className="flex justify-between items-center border-b border-slate-800/50 pb-1 mb-0.5">
                                                                            <span className="text-[9px] text-slate-500 font-black uppercase tracking-tight">Tapping Tool</span>
                                                                            <div className="flex gap-2 items-center">
                                                                                <span className="text-[11px] text-sky-400 font-mono font-black">{data.tapDrillName}</span>
                                                                                <span className="text-[10px] text-slate-600 font-mono">({f(data.tapDrillToolSize)})</span>
                                                                            </div>
                                                                        </div>
                                                                        <EngagementMeter
                                                                            engagement={data.tapDrillValidation.engagement}
                                                                            range={data.tapDrillValidation.range}
                                                                            status={data.tapDrillValidation.status}
                                                                        />
                                                                    </>
                                                                ) : (
                                                                    <div className="text-[10px] opacity-30 font-black uppercase tracking-widest italic text-rose-500 py-1">
                                                                        No drill found
                                                                    </div>
                                                                )}
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

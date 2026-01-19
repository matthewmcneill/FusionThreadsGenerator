import React from 'react';
import { f, getWorkshopAdvisory, groupThreadsBySeries, getThreadingData } from '../utils/chartLogic';

/**
 * @component ThreadChartTable
 * @description A high-fidelity presentational component that renders the core thread specification table.
 * It is designed to be dual-purpose:
 * 1. **Web Preview**: Uses Tailwind CSS for a modern, responsive interactive preview.
 * 2. **Print Engine**: Uses specialized 'print-table' classes and simplified styling for clean physical output.
 * 
 * The table displays internal (tapping) and external (turning) data side-by-side, 
 * including derived manual lathe constants.
 * 
 * @param {Object} props - Component properties.
 * @param {Array<Object>} props.threads - The filtered list of threads to display.
 * @param {Array<string>} props.selectedClasses - The tolerance classes currently active in the UI.
 * @param {('in'|'mm')} props.unit - The measurement unit for display.
 * @param {boolean} props.includeInternal - Whether to show the Tapping sections.
 * @param {boolean} props.includeExternal - Whether to show the Turning sections.
 * @param {boolean} [props.isPrint=false] - Flag to switch between web-preview and high-density print styles.
 */
const ThreadChartTable = ({
    threads,
    selectedClasses,
    unit,
    includeInternal,
    includeExternal,
    isPrint = false
}) => {
    const isImperial = unit === 'in';
    const groupedBySeries = groupThreadsBySeries(threads);

    return (
        <table className={`w-full text-left border-collapse ${isPrint ? 'print-table' : 'preview-table'}`}>
            <thead className={isPrint ? '' : 'bg-slate-50'}>
                {/* Row 1: Macro Headers */}
                <tr className={isPrint ? 'print-header-row' : 'border-b border-slate-200'}>
                    <th rowSpan="2" className={isPrint ? 'print-th size-col' : 'w-[12%] px-2 py-3 text-[10px] font-bold text-slate-800 uppercase tracking-wider'}>Size / Designation</th>
                    <th rowSpan="2" className={isPrint ? 'print-th pitch-col' : 'w-[6%] px-2 py-3 text-[10px] font-bold text-slate-800 uppercase tracking-wider text-center'}>{isImperial ? 'TPI' : 'Pitch'}</th>

                    {includeInternal && (
                        <th colSpan="3" className={isPrint ? 'macro-header-th section-start section-end' : 'px-2 py-3 text-[10px] font-black text-slate-900 border-x border-slate-200 uppercase tracking-[0.1em] text-center bg-slate-100/50'}>
                            Internal Threading (Tapping)
                        </th>
                    )}

                    {includeExternal && (
                        <th colSpan="4" className={isPrint ? 'macro-header-th section-start section-end' : 'px-2 py-3 text-[10px] font-black text-slate-900 border-x border-slate-200 uppercase tracking-[0.1em] text-center bg-slate-100/50'}>
                            External Threading (Turning/Die)
                        </th>
                    )}
                </tr>

                {/* Row 2: Specific Columns */}
                <tr className={isPrint ? 'print-header-row' : 'border-b-2 border-slate-900 bg-slate-50/50'}>
                    {includeInternal && (
                        <>
                            <th className={isPrint ? 'print-th data-col section-start' : 'px-2 py-2 text-[8px] font-bold text-slate-600 uppercase text-center border-l border-slate-200'}>Major Dia</th>
                            <th className={isPrint ? 'print-th drill-col' : 'px-2 py-2 text-[8px] font-bold text-slate-600 uppercase text-center border-x border-slate-200'}>Tap Drill (Tool)</th>
                            <th className={isPrint ? 'print-th advisory-col section-end' : 'px-2 py-2 text-[8px] font-bold text-slate-600 uppercase text-center border-r border-slate-200'}>Advisory</th>
                        </>
                    )}
                    {includeExternal && (
                        <>
                            <th className={isPrint ? 'print-th data-col section-start' : 'px-2 py-2 text-[8px] font-bold text-slate-600 uppercase text-center'}>Turn Dia</th>
                            <th className={isPrint ? 'print-th depth-col' : 'px-2 py-2 text-[8px] font-bold text-slate-600 uppercase text-center border-x border-slate-200'}>Radial Depth</th>
                            <th className={isPrint ? 'print-th angle-col' : 'px-2 py-2 text-[8px] font-bold text-slate-600 uppercase text-center'}>Comp. Angle</th>
                            <th className={isPrint ? 'print-th comp-depth-col section-end' : 'px-2 py-2 text-[8px] font-bold text-slate-600 uppercase text-center border-l border-slate-200'}>Comp. Depth</th>
                        </>
                    )}
                </tr>
            </thead>
            <tbody className={isPrint ? '' : 'divide-y divide-slate-100'}>
                {Object.entries(groupedBySeries).map(([seriesName, seriesThreads]) => {
                    const angle = seriesThreads[0]?.angle;
                    return (
                        <React.Fragment key={seriesName}>
                            {/* Series Header Row */}
                            <tr className={isPrint ? 'series-header-row' : 'bg-slate-900 text-white'}>
                                <td colSpan={2 + (includeInternal ? 3 : 0) + (includeExternal ? 4 : 0)} className={isPrint ? 'series-header-td' : 'px-2 py-1.5 text-[9px] font-black uppercase tracking-[0.2em]'}>
                                    {seriesName} Series {angle ? `(${angle}°)` : ''}
                                </td>
                            </tr>

                            {seriesThreads.map((thread) => {
                                // 1. Component State Identification:
                                // Find the first applicable class for internal (tapping) and 
                                // external (turning) threads based on the user's active selections.
                                const intClass = selectedClasses.find(cls => thread.classes[cls]?.internal);
                                const extClass = selectedClasses.find(cls => thread.classes[cls]?.external);

                                // If this specific thread has no data for the selected classes, skip it.
                                if (!intClass && !extClass) return null;

                                const intData = intClass ? thread.classes[intClass].internal : null;
                                const extData = extClass ? thread.classes[extClass].external : null;

                                // 2. Derived Technical Data:
                                // Calculate manual lathe parameters (Turn Dia, Comp Angle, etc.)
                                // h (radial depth) is the primary driver for compound travel.
                                const turning = getThreadingData(angle, thread.basic.p, thread.basic.h || thread.basic.d, thread.basic.major);

                                // 3. Safety Advisories:
                                // Generate cautionary text if the tapping drill has sub-optimal engagement.
                                const { advisoryText, isDanger } = getWorkshopAdvisory(intData || {}, 'Internal');

                                return (
                                    <tr key={thread.designation} className={isPrint ? '' : 'group hover:bg-slate-50 transition-colors border-b border-slate-100'}>
                                        {/* Size / Pitch */}
                                        <td className={isPrint ? 'size-col' : 'px-1 py-2 whitespace-nowrap'}>
                                            <div className={isPrint ? 'size-stack' : 'flex flex-col'}>
                                                <span className={isPrint ? 'size-designation' : 'text-slate-900 font-bold text-[11px]'}>{thread.designation}</span>
                                                <span className={isPrint ? 'size-nominal' : 'text-[9px] font-medium text-slate-400 uppercase leading-none'}>({thread.nominalFraction || thread.size})</span>
                                            </div>
                                        </td>
                                        <td className={isPrint ? 'pitch-col' : 'px-1 py-2 font-mono text-slate-500 font-bold text-[10px] text-center'}>
                                            {isImperial ? thread.tpi : f(thread.basic.p)}
                                        </td>

                                        {/* Internal Section */}
                                        {includeInternal && (
                                            <>
                                                <td className={isPrint ? 'data-col section-start' : 'px-1 py-2 text-center font-mono text-slate-900 font-medium text-[10px] bg-emerald-50/10 border-l border-slate-100'}>
                                                    {intData ? f(intData.major) : '—'}
                                                </td>
                                                <td className={isPrint ? 'drill-col' : 'px-1 py-2 text-center border-x border-slate-100'}>
                                                    {intData?.tapDrillName ? (
                                                        <div className={isPrint ? 'size-stack' : 'flex flex-col items-center leading-tight'}>
                                                            <span className={isPrint ? 'drill-name' : 'text-slate-900 font-bold text-[10px]'}>{intData.tapDrillName}</span>
                                                            <span className={isPrint ? 'drill-decimal' : 'text-[9px] text-slate-400'}>{f(intData.tapDrillToolSize)}</span>
                                                        </div>
                                                    ) : <span className="text-slate-200">—</span>}
                                                </td>
                                                <td className={isPrint ? 'advisory-col section-end' : 'px-1 py-2 text-center border-r border-slate-100'}>
                                                    {advisoryText && (
                                                        <span className={isPrint ? (isDanger ? 'status-danger' : 'status-caution') : `text-[8px] font-bold uppercase tracking-tighter ${isDanger ? 'text-rose-600' : 'text-slate-400'}`}>
                                                            {advisoryText}
                                                        </span>
                                                    )}
                                                </td>
                                            </>
                                        )}

                                        {/* External Section */}
                                        {includeExternal && turning && (
                                            <>
                                                <td className={isPrint ? 'data-col section-start' : 'px-1 py-2 text-center font-mono text-slate-900 font-medium text-[10px] bg-blue-50/10'}>
                                                    {f(turning.turnDia)}
                                                </td>
                                                <td className={isPrint ? 'depth-col' : 'px-1 py-2 text-center font-mono text-slate-600 font-medium text-[10px] border-x border-slate-100'}>
                                                    {f(turning.radialDepth)}
                                                </td>
                                                <td className={isPrint ? 'angle-col' : 'px-1 py-2 text-center font-mono text-blue-700 font-black text-[10px]'}>
                                                    {turning.compoundAngle}°
                                                </td>
                                                <td className={isPrint ? 'comp-depth-col section-end' : 'px-1 py-2 text-center font-mono text-slate-900 font-bold text-[10px] border-l border-slate-100'}>
                                                    {f(turning.compoundDepth)}
                                                </td>
                                            </>
                                        )}
                                        {includeExternal && !turning && <td colSpan="4" className={`text-center text-slate-200 ${isPrint ? 'section-start section-end' : ''}`}>—</td>}
                                    </tr>
                                );
                            })}
                        </React.Fragment>
                    );
                })}
            </tbody>
        </table>
    );
};

export default ThreadChartTable;

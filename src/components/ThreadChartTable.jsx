import React from 'react';
import { f, getWorkshopAdvisory, groupThreadsBySeries } from '../utils/chartLogic';

/**
 * @component ThreadChartTable
 * @description A presentational component that renders the thread specification table.
 * Used by both the on-screen preview and the print engine.
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
            <thead>
                <tr className={isPrint ? 'print-header-row' : 'border-b-2 border-slate-900'}>
                    <th className={isPrint ? 'print-th size-col' : 'w-[15%] px-2 py-2 text-[10px] font-semibold text-slate-900 uppercase tracking-wider'}>Size / Designation</th>
                    <th className={isPrint ? 'print-th pitch-col' : 'w-[8%] px-2 py-2 text-[10px] font-semibold text-slate-900 uppercase tracking-wider text-center'}>{isImperial ? 'TPI' : 'Pitch'}</th>
                    <th className={isPrint ? 'print-th gender-col' : 'w-[8%] px-2 py-2 text-[10px] font-semibold text-slate-900 uppercase tracking-wider text-center'}>Gender</th>
                    <th className={isPrint ? 'print-th data-col' : 'w-[10%] px-2 py-2 text-[10px] font-semibold text-slate-900 uppercase tracking-wider text-right'}>Major Dia</th>
                    <th className={isPrint ? 'print-th drill-col' : 'w-[24%] px-2 py-2 text-[10px] font-semibold text-slate-900 uppercase tracking-wider pl-4'}>Tap Drill (Tool)</th>
                    <th className={isPrint ? 'print-th advisory-col' : 'w-[35%] px-2 py-2 text-[10px] font-semibold text-slate-900 uppercase tracking-wider pl-4'}>Workshop Advisory</th>
                </tr>
            </thead>
            <tbody className={isPrint ? '' : 'divide-y divide-slate-100'}>
                {Object.entries(groupedBySeries).map(([seriesName, seriesThreads]) => (
                    <React.Fragment key={seriesName}>
                        {/* Series Header Row */}
                        <tr className={isPrint ? 'series-header-row' : 'bg-slate-900 text-white'}>
                            <td colSpan="6" className={isPrint ? 'series-header-td' : 'px-2 py-1 text-[8px] font-black uppercase tracking-[0.2em]'}>
                                {seriesName} Series
                            </td>
                        </tr>

                        {seriesThreads.map((thread) => {
                            const activeClasses = selectedClasses.filter(c => thread.classes[c]);

                            return ['External', 'Internal'].map((gender) => {
                                if (gender === 'Internal' && !includeInternal) return null;
                                if (gender === 'External' && !includeExternal) return null;

                                const genderClasses = activeClasses.filter(cls => thread.classes[cls][gender.toLowerCase()]);
                                if (genderClasses.length === 0) return null;

                                const cls = genderClasses[0];
                                const c = thread.classes[cls];
                                const data = gender === 'External' ? c.external : c.internal;

                                const { advisoryText, isDanger } = getWorkshopAdvisory(data, gender);

                                return (
                                    <tr key={`${thread.designation}-${gender}`} className={isPrint ? '' : 'group hover:bg-slate-50 transition-colors'}>
                                        <td className={isPrint ? 'size-col' : 'px-2 py-1.5 whitespace-nowrap'}>
                                            <div className={isPrint ? 'size-stack' : 'flex flex-col'}>
                                                <span className={isPrint ? 'size-designation' : 'text-slate-900 font-medium text-xs'}>{thread.designation}</span>
                                                <span className={isPrint ? 'size-nominal' : 'text-[10px] font-medium text-slate-400 uppercase leading-none'}>{thread.nominalFraction || thread.size}</span>
                                            </div>
                                        </td>
                                        <td className={isPrint ? 'pitch-col' : 'px-2 py-1.5 font-mono text-slate-400 font-medium text-xs text-center'}>
                                            {isImperial ? thread.tpi : f(thread.basic.p)}
                                        </td>
                                        <td className={isPrint ? 'gender-col' : 'px-2 py-1.5 text-center'}>
                                            <span className={isPrint ? '' : `text-[8px] font-semibold uppercase px-1.5 py-0.5 rounded ${gender === 'External' ? 'text-slate-400' : 'text-slate-600'}`}>
                                                {gender}
                                            </span>
                                        </td>
                                        <td className={isPrint ? 'data-col' : 'px-2 py-1.5 text-right font-mono text-slate-900 font-medium text-xs'}>
                                            {f(data.major)}
                                        </td>
                                        <td className={isPrint ? 'drill-col' : 'px-2 py-1.5 pl-4'}>
                                            {gender === 'Internal' && data.tapDrillName ? (
                                                <span className={isPrint ? '' : 'text-slate-900 font-semibold text-xs whitespace-nowrap'}>
                                                    <span className={isPrint ? 'drill-name' : ''}>{data.tapDrillName}</span>{' '}
                                                    <span className={isPrint ? 'drill-decimal' : 'font-normal text-slate-400'}>{data.tapDrillToolSize ? `(${f(data.tapDrillToolSize)})` : ''}</span>
                                                </span>
                                            ) : (
                                                <span className={isPrint ? '' : 'text-slate-200 px-4 text-xs'}>—</span>
                                            )}
                                        </td>
                                        <td className={isPrint ? 'advisory-col' : 'px-2 py-1.5 pl-4'}>
                                            {advisoryText && (
                                                <span className={isPrint ? (isDanger ? 'status-danger' : 'status-caution') : `text-[10px] uppercase tracking-tight ${isDanger ? 'font-semibold text-rose-600' : 'font-normal text-slate-400'}`}>
                                                    {advisoryText}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            });
                        })}
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    );
};

export default ThreadChartTable;

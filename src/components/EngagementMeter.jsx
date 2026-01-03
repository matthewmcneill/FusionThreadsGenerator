import React from 'react';

/**
 * @component EngagementMeter
 * @description Sleek, inline graphical visualization of thread engagement.
 * shows actual engagement vs material target on a color-coded scale.
 */
const EngagementMeter = ({ engagement, range, status = '' }) => {
    if (!range) return null;

    // Normalize percentages for CSS (0-100 range)
    const actualPos = Math.min(100, Math.max(0, engagement));
    const targetPos = range.target;

    // Define color segments for the backdrop bar
    const gradient = `linear-gradient(to right, 
        #ef4444 0%, #ef4444 25%, 
        #f59e0b 25%, #f59e0b ${range.min}%, 
        #10b981 ${range.min}%, #10b981 ${range.max}%, 
        #f59e0b ${range.max}%, #f59e0b 90%, 
        #ef4444 90%, #ef4444 100%)`;

    // Map status to lozenge configuration
    const getStatusConfig = (status) => {
        const s = status.toLowerCase();
        if (s.includes('optimal')) {
            return {
                text: 'OPTIMAL',
                classes: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
            };
        }

        // Amber / Warning Tiers
        if (s === 'warning-loose') {
            return {
                text: 'LOOSE',
                classes: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
            };
        }
        if (s === 'warning-tight') {
            return {
                text: 'TIGHT',
                classes: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
            };
        }

        // Red / Danger Tiers
        if (s.includes('danger-loose') || s.includes('danger-very-loose')) {
            return {
                text: 'STRIP RISK',
                classes: 'text-rose-500 bg-rose-500/10 border-rose-500/20'
            };
        }
        if (s.includes('danger-tight')) {
            return {
                text: 'BREAK RISK',
                classes: 'text-rose-500 bg-rose-500/10 border-rose-500/20'
            };
        }

        // Critical Tiers (usually hidden, but kept for absolute safety)
        if (s.includes('catastrophic')) {
            return {
                text: 'CRITICAL',
                classes: 'text-rose-500 bg-rose-500/10 border-rose-500/20'
            };
        }
        return null;
    };

    const statusConfig = getStatusConfig(status);

    return (
        <div className="w-full py-1">
            {/* The Track */}
            <div className="relative h-[4px] w-full bg-slate-950/80 rounded-full mb-2 overflow-visible border border-slate-700/30">
                {/* Color Zones Background */}
                <div
                    className="absolute inset-0 opacity-80 rounded-full shadow-inner"
                    style={{ background: gradient }}
                />

                {/* Target Marker (Hollow Circle) */}
                <div
                    className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border border-white bg-slate-950/40 z-10 -ml-1.25 shadow-[0_0_4px_rgba(255,255,255,0.3)]"
                    style={{ left: `${targetPos}%` }}
                    title="Target Engagement"
                />

                {/* Actual Marker (Solid White Dot) */}
                <div
                    className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white z-20 -ml-1.25 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                    style={{ left: `${actualPos}%` }}
                    title="Actual Engagement"
                />
            </div>

            {/* Combined Status Line */}
            <div className="flex justify-between items-end text-[9px] font-black tracking-tighter uppercase leading-none px-0.5">
                <div className="flex items-baseline gap-1.5">
                    <span className="text-slate-500 font-bold">{Math.round(engagement)}% Eng.</span>
                </div>

                {statusConfig && (
                    <span className={`text-[8px] font-black tracking-widest px-1.5 rounded-sm border ${statusConfig.classes}`}>
                        {statusConfig.text}
                    </span>
                )}
            </div>
        </div>
    );
};

export default EngagementMeter;

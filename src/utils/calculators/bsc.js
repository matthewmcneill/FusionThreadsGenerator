/**
 * @module bsc
 * @description Provides calculations and physical data for British Standard Cycle (BSC) thread standards (BS 811:1950).
 * 
 * Main functions:
 * - calculateBSC (exported): Calculates geometry and tolerances for BSC threads.
 * - STANDARD_BSC_SIZES (exported): List of standard BSC size/TPI combinations (mostly 26 TPI).
 * - BSA_HEAVY_SIZES (exported): List of BSA deviation sizes (20 TPI).
 * - BSCStandard (exported): Configuration object for the BSC standard.
 */

import { getNearestDrill, validateTapDrill } from '../drills';

/**
 * British Standard Cycle / CEI Standard configuration.
 */
export const BSCStandard = {
    id: 'BSC',
    name: 'British Standard Cycle (BSC/CEI)',
    unit: 'in',
    angle: 60,
    sortOrder: 4,
    threadForm: 8,
    series: ['Standard', 'BSA'],
    classes: ['Close', 'Medium', 'Free'],
    defaultDrillSets: ['Number', 'Letter', 'Imperial'],
    docUrl: 'https://github.com/matthewmcneill/FusionThreadsGenerator/blob/main/docs/BSC_SPEC.md',
    seriesAnchor: '#3-thread-designations-series',
    classAnchor: '#4-manufacturing-tolerances-bs-8111950'
};

/**
 * @internal
 * Converts fraction strings (e.g. "1 1/8" or "1/16") to decimal values.
 */
const parseFraction = (f) => {
    if (typeof f === 'number') return f;
    if (!f.includes('/')) return parseFloat(f);
    const parts = f.trim().split(/\s+/);
    if (parts.length === 2) {
        const [whole, frat] = parts;
        const [num, den] = frat.split('/').map(Number);
        return parseFloat(whole) + (num / den);
    }
    const [num, den] = f.split('/').map(Number);
    return num / den;
};

/**
 * @internal
 * Helper to generate consistent BSC preset objects.
 */
const createBSCPreset = (sizeStr, tpi, series) => ({
    designation: `${sizeStr} ${series === 'BSA' ? 'BSA' : 'BSC'}`,
    series: series,
    size: parseFraction(sizeStr),
    nominalFraction: sizeStr,
    tpi,
    ctd: `${sizeStr} - ${tpi} ${series === 'BSA' ? 'BSA' : 'BSC'}`
});

/**
 * Standard BSC Series (Ref: BS 811:1950 & CEI 1902).
 */
export const STANDARD_BSC_SIZES = [
    ['1/8', 40], ['5/32', 32], ['3/16', 32], ['1/4', 26], ['5/16', 26],
    ['3/8', 26], ['7/16', 26], ['1/2', 26], ['9/16', 26], ['1', 26],
    ['1.370', 24]
].map(([s, t]) => createBSCPreset(s, t, 'Standard'));

/**
 * BSA Devation / Heavy Series (20 TPI).
 */
export const BSA_HEAVY_SIZES = [
    ['7/16', 20], ['1/2', 20], ['9/16', 20], ['5/8', 20], ['3/4', 20]
].map(([s, t]) => createBSCPreset(s, t, 'BSA'));

/**
 * @internal
 * Derives the BSC double-depth factor (K) from first principles.
 * K = 2 * (h/p). For BSC, h = (sqrt(3)/2 - 1/3) * p.
 */
const getBSCDoubleDepthFactor = () => {
    const H_p = Math.sqrt(3) / 2;
    const h_p = H_p - (1 / 3);
    return 2 * h_p;
};

/**
 * Returns the target Percentage of Thread Engagement (PTE) based on material.
 */
const getTargetPTE = (material) => {
    switch (material) {
        case 'hard': return 60;
        case 'soft': return 80;
        default: return 70; // General Ferrous
    }
};

/**
 * Calculates BSC thread geometry and tolerances based on BS 811:1950.
 * @param {number} diameter - Nominal diameter in inches.
 * @param {number} tpi - Threads per inch.
 * @param {Array<string>} [drillSets] - Drill sets to use for tap recommendations.
 * @param {number|null} [lengthOfEngagement] - Length of engagement.
 * @param {string} [material='ferrous'] - Substrate material group.
 * @returns {Object} Calculated thread data.
 */
export const calculateBSC = (diameter, tpi, drillSets, lengthOfEngagement = null, material = 'ferrous') => {
    const p = 1 / tpi;
    const D = diameter;
    const L = lengthOfEngagement || D;

    // First Principles Geometry
    const H_p = Math.sqrt(3) / 2;
    const h_p = H_p - (1 / 3);
    const r_p = 1 / 6;

    const H = H_p * p;
    const h = h_p * p;
    const r = r_p * p;

    const basicMajor = D;
    const basicPitch = D - h;
    const basicMinor = D - (2 * h);

    const fmt = (n) => Number(n.toFixed(6));

    /**
     * @internal
     * Inner helper to calculate tolerances for BSC fits.
     * BSC tolerances are simplified to scale with sqrt(p).
     */
    const getTolerances = (extMultiplier, intMultiplier) => {
        const result = {};

        // BS 811:1950 effective diameter tolerance (simplified scaling factor)
        // For cycle threads, the tolerance T is often approx 0.005 * sqrt(p) 
        // as a baseline for the fine 26/20 TPI series.
        const T = 0.006 * Math.sqrt(p) + 0.001 * Math.sqrt(D);

        if (extMultiplier !== null) {
            const tEffExt = T * extMultiplier;
            const tMajor = tEffExt + 0.01 * Math.sqrt(p);
            const tMinorBolt = tEffExt + 0.02 * Math.sqrt(p);

            result.external = {
                major: fmt(basicMajor),
                pitch: fmt(basicPitch),
                minor: fmt(basicMinor),
                majorMin: fmt(basicMajor - tMajor),
                pitchMin: fmt(basicPitch - tEffExt),
                minorMin: fmt(basicMinor - tMinorBolt)
            };
        }

        if (intMultiplier !== null) {
            const tEffInt = T * intMultiplier;
            // Nut Minor Tolerance: 0.2*P + 0.004 (from BS 811 for cycle threads)
            const nutMinorTol = 0.2 * p + 0.004;
            const minorMax = basicMinor + nutMinorTol;

            // Tapping Drill Selection
            const pte = getTargetPTE(material);
            const K = getBSCDoubleDepthFactor();
            const targetDecimal = basicMajor - (K * p * pte / 100);
            const shopDrill = getNearestDrill(targetDecimal, 'in', drillSets);

            result.internal = {
                major: fmt(basicMajor),
                pitch: fmt(basicPitch),
                minor: fmt(basicMinor),
                minorMax: fmt(minorMax),
                pitchMax: fmt(basicPitch + tEffInt),
                ...(shopDrill ? {
                    tapDrillTarget: fmt(targetDecimal),
                    tapDrillToolSize: fmt(shopDrill.size),
                    tapDrillName: shopDrill.name,
                    tapDrillValidation: validateTapDrill(
                        shopDrill.size,
                        basicMajor,
                        basicMinor,
                        minorMax,
                        material
                    )
                } : {})
            };
        }

        return result;
    };

    return {
        basic: {
            major: fmt(basicMajor),
            pitch: fmt(basicPitch),
            minor: fmt(basicMinor),
            h: fmt(h),
            r: fmt(r),
            p: fmt(p)
        },
        classes: {
            'Close': getTolerances(0.75, 1.0),
            'Medium': getTolerances(1.0, 1.25),
            'Free': getTolerances(1.5, 1.5)
        }
    };
};

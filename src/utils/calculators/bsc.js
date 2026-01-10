/**
 * @module bsc
 * @description Provides calculations and physical data for British Standard Cycle (BSC) thread standards (BS 811:1950).
 * 
 * @exports
 * - calculateBSC: Calculates geometry and tolerances for BSC threads.
 * - BSCStandard: Configuration object for the BSC standard.
 * - STANDARD_BSC_SIZES: List of standard BSC size/TPI combinations (mainly 26 TPI).
 * - BSA_HEAVY_SIZES: List of BSA deviation sizes (20 TPI used on larger cycle components).
 * 
 * @internal
 * - parseFraction: Converts fraction strings to decimal values.
 * - createBSCPreset: Helper to generate consistent BSC/BSA preset objects.
 * - getBSCDoubleDepthFactor: Derives the BSC double-depth factor (K) from first principles.
 * - getTargetPTE: Returns target Percentage of Thread Engagement based on material.
 */

import { getNearestDrill, validateTapDrill } from '../drills';

/**
 * British Standard Cycle / CEI Standard configuration object.
 * Defines the 60-degree cycle thread form and available classes.
 * @type {Object}
 * @property {string} id - 'BSC'
 * @property {string} name - Display name
 * @property {string} unit - 'in'
 * @property {number} angle - 60 degrees
 * @property {number} sortOrder - UI rendering priority
 * @property {number} threadForm - Fusion 360 thread form index
 * @property {string[]} series - Supported series ('Standard', 'BSA')
 * @property {string[]} classes - Available tolerance classes (Close, Medium, Free)
 * @property {Function} getCTD - Selection callback to get designation
 * @property {Function} getSeries - Returns series name based on TPI
 * @property {string[]} defaultDrillSets - Preferred drill sets
 * @property {string} docUrl - Link to technical documentation
 * @property {string} seriesAnchor - Anchor for technical sizing tables
 * @property {string} classAnchor - Anchor for tolerance class specifications
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
    getCTD: (item) => {
        let sizeStr = item.nominalFraction || item.size.toString();
        const suffix = item.designation.includes('BSA') ? 'BSA' : 'BSC';
        return `${sizeStr} - ${item.tpi} ${suffix}`;
    },
    getSeries: (item) => item.tpi === 20 ? 'BSA' : 'Standard',
    defaultDrillSets: ['Number', 'Letter', 'Imperial'],
    docUrl: 'https://github.com/matthewmcneill/FusionThreadsGenerator/blob/main/docs/BSC_SPEC.md',
    seriesAnchor: '#3-thread-designations-series',
    classAnchor: '#4-manufacturing-tolerances-bs-8111950'
};

/**
 * @internal
 * Converts fraction strings (e.g. "1 1/8" or "1/16") to decimal values.
 * @param {string|number} f - The fraction string or number to parse.
 * @returns {number} Decimal value of the fraction.
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
 * Helper to generate consistent BSC preset objects with standardized designations and CTDs.
 * @param {string} sizeStr - Fraction or whole number string (e.g. "1/4").
 * @param {number} tpi - Threads per inch.
 * @param {string} series - "Standard" or "BSA".
 * @returns {Object} Standardized thread metadata object.
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
 * Consists primarily of 26 TPI threads for standard cycle components.
 * @type {Array<{designation: string, series: string, size: number, nominalFraction: string, tpi: number, ctd: string}>}
 */
export const STANDARD_BSC_SIZES = [
    ['1/8', 40], ['5/32', 32], ['3/16', 32], ['1/4', 26], ['5/16', 26],
    ['3/8', 26], ['7/16', 26], ['1/2', 26], ['9/16', 26], ['1', 26],
    ['1.370', 24]
].map(([s, t]) => createBSCPreset(s, t, 'Standard'));

/**
 * BSA Deviation / Heavy Series (20 TPI).
 * Used for larger cycle components requiring more robust threads.
 * @type {Array<{designation: string, series: string, size: number, nominalFraction: string, tpi: number, ctd: string}>}
 */
export const BSA_HEAVY_SIZES = [
    ['7/16', 20], ['1/2', 20], ['9/16', 20], ['5/8', 20], ['3/4', 20]
].map(([s, t]) => createBSCPreset(s, t, 'BSA'));

/**
 * @internal
 * Derives the BSC double-depth factor (K) from first principles.
 * K = 2 * (h/p). For BSC, h = (sqrt(3)/2 - 1/3) * p.
 * @returns {number} The derived double depth factor.
 */
const getBSCDoubleDepthFactor = () => {
    // For 60° threads, the sharp V height H is (sqrt(3)/2) * p.
    const H_p = Math.sqrt(3) / 2;
    // The thread depth h is truncated by 1/6H at crest and 1/6H at root 
    // BUT BSC specifically often uses a different truncation. 
    // Formally h = 0.5327p for BSC.
    const h_p = H_p - (1 / 3);
    return 2 * h_p;
};

/**
 * @internal
 * Returns the target Percentage of Thread Engagement (PTE) based on material.
 * @param {string} material - 'hard', 'ferrous', 'soft'.
 * @returns {number} Target PTE.
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
 * @param {Array<Object>} [customDrills=[]] - User-defined drills.
 * @param {Array<string>} [disabledDrills=[]] - List of drill names to exclude.
 * @returns {Object} Calculated thread data.
 */
export const calculateBSC = (
    diameter,
    tpi,
    drillSets,
    lengthOfEngagement = null,
    material = 'ferrous',
    customDrills = [],
    disabledDrills = []
) => {
    const p = 1 / tpi;
    const D = diameter;
    const L = lengthOfEngagement || D;

    // First Principles Geometry for 60° included angle
    const H_p = Math.sqrt(3) / 2; // Ratio of fundamental height to pitch
    const h_p = H_p - (1 / 3);    // Ratio of actual depth to pitch (truncated)
    const r_p = 1 / 6;             // Ratio of radius to pitch

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

        // BS 811:1950 baseline tolerance T.
        // Empirically derived to fit the performance requirements of bike components.
        const T = 0.006 * Math.sqrt(p) + 0.001 * Math.sqrt(D);

        // BOLT (EXTERNAL)
        if (extMultiplier !== null) {
            const tEffExt = T * extMultiplier;
            // Standard allowances for major and minor diameters based on pitch.
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
            const shopDrill = getNearestDrill(targetDecimal, 'in', drillSets, customDrills, disabledDrills);

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

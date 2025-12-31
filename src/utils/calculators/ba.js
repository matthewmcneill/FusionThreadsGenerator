/**
 * @module ba
 * @description Provides calculations and data for British Association (BA) thread standards.
 * 
 * Main functions:
 * - calculateBA (exported): Calculates full thread geometry and tolerances for a given BA size number.
 * - BA_SIZES (exported): List of standard BA designations.
 * - BAStandard (exported): Configuration object for the BA standard.
 */

import { getNearestDrill, validateTapDrill } from '../drills.js';

/**
 * Metadata configuration for the BA Thread Standard.
 */
export const BAStandard = {
    name: 'BA Threads',
    unit: 'mm',
    angle: 47.5,
    sortOrder: 3,
    threadForm: 8,
    series: ['BA'],
    classes: ['Close', 'Normal'],
    defaultDrillSets: ['Metric'],
    docUrl: 'https://github.com/matthewmcneill/FusionThreadsGenerator/blob/main/docs/BA_SPEC.md',
    seriesAnchor: '#2-basic-dimensions-bs-931951',
    classAnchor: '#41-tolerance-classes-bs-93'
};

/**
 * Standard BA thread designations and size indices (0-16).
 * @type {Array<{designation: string, size: string}>}
 */
export const BA_SIZES = Array.from({ length: 17 }, (_, i) => ({
    designation: `${i} BA`,
    series: 'BA',
    size: i.toString()
}));

/**
 * @internal
 * @description Lookup table for standard BA thread dimensions (metric mm).
 * p: Pitch
 * h: Thread depth
 * D: Major diameter
 * eff: Effective (pitch) diameter
 * min: Minor diameter
 * r: Root/crest radius
 */
const BA_TABLE = {
    '0': { p: 1.0000, h: 0.600, D: 6.00, eff: 5.400, min: 4.80, r: 0.1808 },
    '1': { p: 0.9000, h: 0.540, D: 5.30, eff: 4.760, min: 4.22, r: 0.1627 },
    '2': { p: 0.8100, h: 0.485, D: 4.70, eff: 4.215, min: 3.73, r: 0.1465 },
    '3': { p: 0.7300, h: 0.440, D: 4.10, eff: 3.660, min: 3.22, r: 0.1320 },
    '4': { p: 0.6600, h: 0.395, D: 3.60, eff: 3.205, min: 2.81, r: 0.1193 },
    '5': { p: 0.5900, h: 0.355, D: 3.20, eff: 2.845, min: 2.49, r: 0.1067 },
    '6': { p: 0.5300, h: 0.320, D: 2.80, eff: 2.480, min: 2.16, r: 0.0958 },
    '7': { p: 0.4800, h: 0.290, D: 2.50, eff: 2.210, min: 1.92, r: 0.0868 },
    '8': { p: 0.4300, h: 0.260, D: 2.20, eff: 1.940, min: 1.68, r: 0.0778 },
    '9': { p: 0.3900, h: 0.235, D: 1.90, eff: 1.665, min: 1.43, r: 0.0705 },
    '10': { p: 0.3500, h: 0.210, D: 1.70, eff: 1.490, min: 1.28, r: 0.0633 },
    '11': { p: 0.3100, h: 0.185, D: 1.50, eff: 1.315, min: 1.13, r: 0.0561 },
    '12': { p: 0.2800, h: 0.170, D: 1.30, eff: 1.130, min: 0.96, r: 0.0506 },
    '13': { p: 0.2500, h: 0.150, D: 1.20, eff: 1.050, min: 0.90, r: 0.0452 },
    '14': { p: 0.2300, h: 0.140, D: 1.00, eff: 0.860, min: 0.72, r: 0.0416 },
    '15': { p: 0.2100, h: 0.125, D: 0.90, eff: 0.775, min: 0.65, r: 0.0380 },
    '16': { p: 0.1900, h: 0.115, D: 0.79, eff: 0.675, min: 0.56, r: 0.0344 },
};

/**
 * @internal
 * Derives the BA double-depth factor (K) from fundamental geometry.
 * BS 93 defines h = 0.6p, so K = 2 * 0.6 = 1.2.
 * @returns {number} The derived double depth factor.
 */
const getBADoubleDepthFactor = () => {
    return 1.2;
};

/**
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
 * Calculates BA thread geometry and tolerances based on BS 93:1951 and Engineering Analysis.
 * @param {string|number} sizeNumber - The BA number (0-16).
 * @param {Array<string>} [drillSets] - Drill sets to use for tap recommendations.
 * @param {string} [material='ferrous'] - Substrate material group.
 * @returns {Object|null} The calculated thread data or null if size not found.
 */
export const calculateBA = (sizeNumber, drillSets, material = 'ferrous') => {
    // 1. Retrieve basic data from lookup table
    const size = BA_TABLE[sizeNumber.toString()];
    if (!size) return null;

    const p = size.p;
    const sizeNum = parseInt(sizeNumber);
    const fmt = (n) => Number(n.toFixed(6));

    const getTolerances = (isCloseClass, includeInternal) => {
        const result = {};
        const A = (!isCloseClass && sizeNum <= 10) ? 0.025 : 0; // Allowance for Normal bolts 0-10 BA

        // 2. Bolt (External) Tolerances
        let majorTol = isCloseClass ? (0.15 * p) : (sizeNum <= 10 ? 0.20 * p : 0.25 * p);
        let effTol = isCloseClass ? (0.08 * p + 0.02) : (0.10 * p + 0.025);
        let minorBoltTol = isCloseClass ? (0.16 * p + 0.04) : (0.20 * p + 0.05);

        result.external = {
            major: fmt(size.D - A),
            pitch: fmt(size.eff - A),
            minor: fmt(size.min - A),
            majorMin: fmt(size.D - A - majorTol),
            pitchMin: fmt(size.eff - A - effTol),
            minorMin: fmt(size.min - A - minorBoltTol)
        };

        // 3. Nut (Internal) Tolerances - BS 93 provides one class for nuts
        if (includeInternal) {
            const nutEffTol = 0.12 * p + 0.03;
            const nutMinorTol = 0.375 * p;

            // Algorithmic Determination of Tapping Drill Size
            const pte = getTargetPTE(material);
            const K = getBADoubleDepthFactor();

            // Cut Tap Formula: D_drill = D_major - (K * p * PTE / 100)
            const targetDecimal = size.D - (K * p * pte / 100);

            const shopDrill = getNearestDrill(targetDecimal, 'mm', drillSets);

            result.internal = {
                major: fmt(size.D),
                pitch: fmt(size.eff),
                minor: fmt(size.min),
                minorMax: fmt(size.min + nutMinorTol),
                pitchMax: fmt(size.eff + nutEffTol),
                ...(shopDrill ? {
                    tapDrillTarget: fmt(targetDecimal),
                    tapDrillToolSize: fmt(shopDrill.size),
                    tapDrillName: shopDrill.name,
                    tapDrillValidation: validateTapDrill(
                        shopDrill.size,
                        size.D / 25.4,
                        size.min / 25.4,
                        (size.min + nutMinorTol) / 25.4,
                        material
                    )
                } : {})
            };
        }

        return result;
    };

    // 4. Build the final results object with gender-specific classes
    return {
        basic: {
            major: fmt(size.D),
            pitch: fmt(size.eff),
            minor: fmt(size.min),
            h: fmt(size.h),
            r: fmt(size.r),
            p: fmt(p)
        },
        classes: {
            // Close: Bolt Close class only (0-10 BA)
            ...(sizeNum <= 10 ? { 'Close': getTolerances(true, false) } : {}),
            // Normal: Bolt Normal class + standard Nut (All Classes)
            'Normal': getTolerances(false, true)
        }
    };
};


/**
 * @module me
 * @description Provides calculations and data for Model Engineer (ME) thread standards.
 * 
 * Main functions:
 * - calculateME (exported): Calculates geometry and tolerances for ME threads.
 * - ME_SIZES (exported): List of standard ME size/TPI combinations.
 * - MEStandard (exported): Configuration object for the ME standard.
 */

import { getNearestDrill, validateTapDrill } from '../drills.js';

/**
 * Model Engineer (ME) Standard configuration.
 */
export const MEStandard = {
    name: 'Model Engineer (ME)',
    unit: 'in',
    angle: 55,
    sortOrder: 4,
    threadForm: 8,
    series: ['Fine (40 TPI)', 'Medium (32 TPI)', 'BSB (26 TPI)'],
    classes: ['Medium'],
    defaultDrillSets: ['Number', 'Letter', 'Imperial'],
    docUrl: 'https://github.com/matthewmcneill/FusionThreadsGenerator/blob/main/docs/ME_SPEC.md'
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
 * Helper to generate consistent ME preset objects.
 */
const createMEPreset = (sizeStr, tpi) => {
    const isBSB = tpi === 26;
    let series = 'Medium (32 TPI)';
    if (tpi === 40) series = 'Fine (40 TPI)';
    if (tpi === 26) series = 'BSB (26 TPI)';

    return {
        designation: isBSB ? `ME ${sizeStr} x 26 BSB` : `ME ${sizeStr} x ${tpi}`,
        series,
        size: parseFraction(sizeStr),
        nominalFraction: sizeStr,
        tpi,
        ctd: `${sizeStr} - ${tpi} ${isBSB ? 'BSB' : 'ME'}`
    };
};

/**
 * Standard Model Engineer (ME) sizes.
 * Reference: SMEE Standards and user-provided specifications.
 * @type {Array<Object>}
 */
export const ME_SIZES = [
    ['1/8', 40], ['5/32', 40], ['3/16', 40], ['7/32', 40],
    ['1/4', 26], ['1/4', 32], ['1/4', 40], ['9/32', 32], ['9/32', 40],
    ['5/16', 26], ['5/16', 32], ['5/16', 40], ['3/8', 26], ['3/8', 32], ['3/8', 40],
    ['7/16', 26], ['7/16', 32], ['7/16', 40], ['1/2', 26], ['1/2', 32], ['1/2', 40],
    ['5/8', 26]
].map(([s, t]) => createMEPreset(s, t));

/**
 * @internal
 * Derives the Whitworth double-depth factor (K) from fundamental geometry.
 * Used for ME threads which share the 55° Whitworth form.
 */
const getWhitworthDoubleDepthFactor = () => {
    const theta = (55 / 2) * (Math.PI / 180);
    const heightFactor = 1 / (2 * Math.tan(theta));
    const depthFactor = (2 / 3) * heightFactor;
    return 2 * depthFactor;
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
 * Calculates ME thread geometry and tolerances.
 * Reuses Whitworth form (55°) logic and Engineering Analysis.
 * @param {number} diameter - Nominal diameter in inches.
 * @param {number} tpi - Threads per inch.
 * @param {Array<string>} [drillSets] - Drill sets to use for tap recommendations.
 * @param {string} [material='ferrous'] - Substrate material group.
 * @returns {Object} Calculated thread data.
 */
export const calculateME = (diameter, tpi, drillSets, material = 'ferrous') => {
    const p = 1 / tpi;
    const D = diameter;

    const theta = (55 / 2) * (Math.PI / 180);
    const H = p / (2 * Math.tan(theta));
    const d = (2 / 3) * H;
    const r = (H / 6) / ((1 / Math.sin(theta)) - 1);

    const basicMajor = D;
    const basicPitch = D - d;
    const basicMinor = D - (2 * d);

    // For ME threads, we use a simplified "Medium" tolerance based on Whitworth formulas
    // as there is no formal international standard for ME tolerances.
    // We use L = D as a default for the tolerance factor T.
    const L = D;
    const T = 0.002 * Math.cbrt(D) + 0.003 * Math.sqrt(L) + 0.005 * Math.sqrt(p);
    const fmt = (n) => Number(n.toFixed(6));

    const getTolerances = (multiplier) => {
        const result = {};
        const tEff = T * multiplier;
        const tMajor = tEff + 0.01 * Math.sqrt(p);
        const tMinorBolt = tEff + 0.02 * Math.sqrt(p);
        const nutMinorTol = 0.2 * p + (tpi >= 26 ? 0.004 : 0.007);

        result.external = {
            major: fmt(basicMajor),
            pitch: fmt(basicPitch),
            minor: fmt(basicMinor),
            majorMin: fmt(basicMajor - tMajor),
            pitchMin: fmt(basicPitch - tEff),
            minorMin: fmt(basicMinor - tMinorBolt)
        };

        const minorMin = basicMinor;
        const minorMax = basicMinor + nutMinorTol;

        // Algorithmic Determination of Tapping Drill Size
        const pte = getTargetPTE(material);
        const K = getWhitworthDoubleDepthFactor();

        // Cut Tap Formula: D_drill = D_major - (K * p * PTE / 100)
        const targetDecimal = basicMajor - (K * p * pte / 100);

        const shopDrill = getNearestDrill(targetDecimal, 'in', drillSets);

        result.internal = {
            major: fmt(basicMajor),
            pitch: fmt(basicPitch),
            minor: fmt(basicMinor),
            minorMax: fmt(minorMax),
            pitchMax: fmt(basicPitch + tEff),
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

        return result;
    };

    return {
        basic: {
            major: fmt(basicMajor),
            pitch: fmt(basicPitch),
            minor: fmt(basicMinor),
            d: fmt(d),
            r: fmt(r),
            p: fmt(p)
        },
        classes: {
            'Medium': getTolerances(1)
        }
    };
};


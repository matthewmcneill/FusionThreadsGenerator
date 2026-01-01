/**
 * @module bsb
 * @description Provides calculations and data for British Standard Brass (BSB) threads.
 * 
 * BSB is a constant-pitch series (26 TPI) utilizing the 55° Whitworth form.
 * Fundamental constants are derived from first principles.
 */

import { getNearestDrill, validateTapDrill } from '../drills.js';

/**
 * British Standard Brass (BSB) Standard configuration.
 */
export const BSBStandard = {
    id: 'BSB',
    name: 'British Standard Brass (BSB)',
    unit: 'in',
    angle: 55,
    sortOrder: 5,
    threadForm: 8,
    series: ['BSB'],
    classes: ['Medium'],
    getCTD: (item) => {
        let sizeStr = item.nominalFraction || item.size.toString();
        return `${sizeStr} - 26 BSB`;
    },
    getSeries: () => 'BSB',
    defaultDrillSets: ['Number', 'Letter', 'Imperial'],
    docUrl: 'https://github.com/matthewmcneill/FusionThreadsGenerator/blob/main/docs/BSB_SPEC.md',
    seriesAnchor: '#4-derived-reference-values-26-tpi',
    classAnchor: '#5-specification-of-tolerances-bs-84-standard'
};

/**
 * @internal
 * Converts fraction strings to decimal values.
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
 * Helper to generate consistent BSB preset objects.
 */
const createBSBPreset = (sizeStr) => {
    return {
        designation: `BSB ${sizeStr} x 26`,
        series: 'BSB',
        size: parseFraction(sizeStr),
        nominalFraction: sizeStr,
        tpi: 26,
        ctd: `${sizeStr} - 26 BSB`
    };
};

/**
 * Standard British Standard Brass (BSB) sizes.
 * Reference: BS 84 and Machinery's Handbook.
 */
export const BSB_SIZES = [
    '1/8', '1/4', '3/8', '1/2', '5/8', '3/4', '7/8', '1', '1 1/8', '1 1/4', '1 1/2'
].map(createBSBPreset);

/**
 * Derives fundamental Whitworth heights and depths from the 55° included angle.
 * Used for transparent calculation replication.
 * 
 * @param {number} p - Thread pitch.
 * @returns {Object} Primitive geometric constants.
 */
const deriveWhitworthGeometry = (p) => {
    const theta = (55 / 2) * (Math.PI / 180); // Half-angle in radians

    // H = Fundamental height of sharp V
    const H = p / (2 * Math.tan(theta));

    // h = Actual depth of thread (2/3 H due to 1/6 truncation at top and bottom)
    const h = (2 / 3) * H;

    // r = Radius of curvature at crest and root
    // Derived from: r = (H/6) / (csc(theta) - 1)
    const r = (H / 6) / ((1 / Math.sin(theta)) - 1);

    return { H, h, r };
};

/**
 * Calculates BSB thread geometry and tolerances.
 * 
 * @param {number} diameter - Nominal diameter in inches.
 * @param {number} tpi - Threads per inch (normally 26).
 * @param {Array<string>} [drillSets] - Drill sets to use for tap recommendations.
 * @param {string} [material='ferrous'] - Substrate material group.
 * @returns {Object} Calculated thread data.
 */
export const calculateBSB = (diameter, tpi, drillSets, material = 'ferrous') => {
    const p = 1 / tpi;
    const D = diameter;

    // Derive geometry from first principles
    const { H, h, r } = deriveWhitworthGeometry(p);

    const basicMajor = D;
    const basicPitch = D - h;
    const basicMinor = D - (2 * h);

    // BS 84 Tolerance Formula for Medium Class:
    // T_E = 0.002*D^(1/3) + 0.003*L^(1/2) + 0.005*p^(1/2)
    // We assume L = D for standard fittings.
    const T = 0.002 * Math.cbrt(D) + 0.003 * Math.sqrt(D) + 0.005 * Math.sqrt(p);
    const fmt = (n) => Number(n.toFixed(6));

    const getTolerances = (multiplier) => {
        const result = {};
        const tEff = T * multiplier;
        const tMajor = tEff + 0.01 * Math.sqrt(p);
        const tMinorBolt = tEff + 0.02 * Math.sqrt(p);
        const nutMinorTol = 0.2 * p + 0.004; // For 26 TPI and finer

        result.external = {
            major: fmt(basicMajor),
            pitch: fmt(basicPitch),
            minor: fmt(basicMinor),
            majorMin: fmt(basicMajor - tMajor),
            pitchMin: fmt(basicPitch - tEff),
            minorMin: fmt(basicMinor - tMinorBolt)
        };

        const minorMax = basicMinor + nutMinorTol;

        // Tapping Drill calculation (70-80% engagement targets)
        const pte = material === 'hard' ? 60 : (material === 'soft' ? 80 : 70);
        const doubleDepth = 2 * h; // The full theoretical thread height
        // Target = Major - (DoubleDepth * PTE / 100)
        const targetDecimal = basicMajor - (doubleDepth * (pte / 100));

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
            d: fmt(h),
            r: fmt(r),
            p: fmt(p)
        },
        classes: {
            'Medium': getTolerances(1)
        }
    };
};

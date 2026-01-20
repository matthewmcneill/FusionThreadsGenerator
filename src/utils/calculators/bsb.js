/**
 * @module bsb
 * @description Provides calculations and physical data for British Standard Brass (BSB) threads.
 * BSB is a constant-pitch series (26 TPI) utilizing the 55° Whitworth form.
 * 
 * @exports
 * - calculateBSB: Calculates BSB thread geometry and tolerances.
 * - BSBStandard: British Standard Brass (BSB) Standard configuration object.
 * - BSB_SIZES: List of standard British Standard Brass (BSB) sizes (1/8" to 1 1/2").
 * 
 * @internal
 * - parseFraction: Converts fraction strings to decimal values.
 * - createBSBPreset: Helper to generate consistent BSB preset objects.
 * - deriveWhitworthGeometry: Derives fundamental heights and depths from the 55° Whitworth angle.
 */

import { getNearestDrill, validateTapDrill } from '../drills.js';
import { calculateTurningData } from '../externalThreadGeometry.js';

/**
 * British Standard Brass (BSB) Standard configuration.
 * Defines the constant 26 TPI pitch and Whitworth 55-degree form.
 * @type {Object}
 * @property {string} id - 'BSB'
 * @property {string} name - Display name
 * @property {string} unit - 'in'
 * @property {number} angle - 55 degrees
 * @property {number} sortOrder - UI rendering priority
 * @property {number} threadForm - Fusion 360 thread form index
 * @property {string[]} series - Supported series ('BSB')
 * @property {string[]} classes - Available tolerance classes (Medium)
 * @property {Function} getCTD - Selection callback to get designation
 * @property {Function} getSeries - Returns default series name
 * @property {string[]} defaultDrillSets - Preferred drill sets
 * @property {string} docUrl - Link to technical documentation
 * @property {string} seriesAnchor - Anchor for technical sizing tables
 * @property {string} classAnchor - Anchor for tolerance class specifications
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
    defaultMaterial: 'soft',
    defaultDrillSets: ['Number', 'Letter', 'Imperial'],
    docUrl: 'https://github.com/matthewmcneill/FusionThreadsGenerator/blob/main/docs/BSB_SPEC.md',
    seriesAnchor: '#4-derived-reference-values-26-tpi',
    classAnchor: '#5-specification-of-tolerances-bs-84-standard'
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
 * Helper to generate consistent BSB preset objects with standardized designations and CTDs.
 * @param {string} sizeStr - Fraction or whole number string (e.g. "1/4").
 * @returns {Object} Standardized thread metadata object.
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
 * Standard British Standard Brass (BSB) sizes (1/8" to 1 1/2").
 * All sizes in this series share a constant pitch of 26 TPI.
 * Reference: BS 84 and Machinery's Handbook.
 * @type {Array<{designation: string, series: string, size: number, nominalFraction: string, tpi: number, ctd: string}>}
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
    // theta = 27.5 degrees (half of the 55 degree included angle)
    const theta = (55 / 2) * (Math.PI / 180);

    // H = Fundamental height of sharp V-thread.
    // Derived from trigonometry: tan(theta) = (p/2) / H => H = p / (2*tan(theta))
    const H = p / (2 * Math.tan(theta));

    // h = Actual depth of the Whitworth thread.
    // Theoretically h = 0.640327p. Historically h = 2/3 of H because 
    // the sharp points are truncated by 1/6H at both crest and root.
    const h = (2 / 3) * H;

    // r = Radius of curvature at crest and root to round off the profile.
    // Formula: r = (H/6) / (csc(theta) - 1)
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
 * @param {Array<Object>} [customDrills=[]] - User-defined drills.
 * @param {Array<string>} [disabledDrills=[]] - List of drill names to exclude.
 * @returns {Object} Calculated thread data.
 */
export const calculateBSB = (
    diameter,
    tpi,
    drillSets,
    material = 'ferrous',
    customDrills = [],
    disabledDrills = []
) => {
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

    /**
     * Internal helper to calculate gender-specific tolerances.
     * BS 84 defines multipliers for different tolerance classes (Medium = 1.0).
     * @param {number} multiplier - Tolerance class multiplier.
     */
    const getTolerances = (multiplier) => {
        const result = {};
        const tEff = T * multiplier; // Effective (pitch) diameter tolerance

        // Major diameter tolerance: Pitch tolerance + allowance based on pitch
        const tMajor = tEff + 0.01 * Math.sqrt(p);
        // Minor diameter tolerance (External): Pitch tolerance + slightly more allowance
        const tMinorBolt = tEff + 0.02 * Math.sqrt(p);
        // Nut Minor diameter tolerance: Based on TPI bracket (BS 84)
        const nutMinorTol = 0.2 * p + 0.004; // Standard for 26 TPI and finer

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
        // Cut Tap Formula: D_drill = D_major - (K * p * PTE / 100)
        // For Whitworth, K = 1.280654 (which is 2 * h / p)
        const K = doubleDepth / p;
        const targetDecimal = basicMajor - (K * p * pte / 100);

        const shopDrill = getNearestDrill(targetDecimal, 'in', drillSets, customDrills, disabledDrills);

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
            p: fmt(p),
            turning: calculateTurningData(BSBStandard.angle, p, h, basicMajor)
        },
        classes: {
            'Medium': getTolerances(1)
        }
    };
};

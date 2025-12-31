/**
 * @module whitworth
 * @description Provides calculations and physical data for Whitworth thread standards (BSW/BSF).
 * 
 * Main functions:
 * - calculateWhitworth (exported): Calculates geometry and tolerances for BSW/BSF threads.
 * - BSW_SIZES (exported): List of standard BSW size/TPI combinations.
 * - BSF_SIZES (exported): List of standard BSF size/TPI combinations.
 * - BSWStandard, BSFStandard (exported): Configuration objects for Whitworth standards.
 */

/**
 * Unified Whitworth Standard configuration.
 */
export const WhitworthStandard = {
    name: 'Whitworth',
    unit: 'in',
    angle: 55,
    sortOrder: 1,
    threadForm: 8,
    series: ['BSW', 'BSF'],
    classes: ['Close', 'Medium', 'Free'],
    docUrl: 'https://github.com/matthewmcneill/FusionThreadsGenerator/blob/main/docs/WHITWORTH_SPEC.md'
};

/**
 * @internal
 * Converts fraction strings (e.g. "1 1/8" or "1/16") to decimal values.
 * @param {string|number} f - The fraction string or number to parse.
 * @returns {number} Decimal value of the fraction.
 */
const parseFraction = (f) => {
    // 1. If already a number, return as-is
    if (typeof f === 'number') return f;

    // 2. Handle cases without a fraction bar
    if (!f.includes('/')) return parseFloat(f);

    // 3. Handle mixed fractions (e.g. "1 1/8")
    const parts = f.trim().split(/\s+/);
    if (parts.length === 2) {
        const [whole, frat] = parts;
        const [num, den] = frat.split('/').map(Number);
        return parseFloat(whole) + (num / den);
    }

    // 4. Handle simple fractions (e.g. "1/16")
    const [num, den] = f.split('/').map(Number);
    return num / den;
};

/**
 * @internal
 * Helper to generate consistent Whitworth preset objects with standardized designations and CTDs.
 * @param {string} sizeStr - Fraction or whole number string (e.g. "1/4").
 * @param {number} tpi - Threads per inch.
 * @param {string} suffix - "BSW" or "BSF".
 * @returns {Object} Standardized thread metadata object.
 */
const createWhitworthPreset = (sizeStr, tpi, suffix) => ({
    designation: `${sizeStr} ${suffix}`,
    series: suffix,
    size: parseFraction(sizeStr),
    tpi,
    ctd: `${sizeStr} - ${tpi} ${suffix}`
});

/**
 * Standard British Standard Whitworth (BSW) - Coarse Series sizes (Ref: BS 84:2007 Table 2).
 * @type {Array<Object>}
 */
export const BSW_SIZES = [
    ['1/16', 60], ['3/32', 48], ['1/8', 40], ['5/32', 32], ['3/16', 24],
    ['7/32', 24], ['1/4', 20], ['5/16', 18], ['3/8', 16], ['7/16', 14],
    ['1/2', 12], ['9/16', 12], ['5/8', 11], ['11/16', 11], ['3/4', 10],
    ['7/8', 9], ['1', 8], ['1 1/8', 7], ['1 1/4', 7], ['1 3/8', 6],
    ['1 1/2', 6], ['1 5/8', 5], ['1 3/4', 5], ['1 7/8', 4.5], ['2', 4.5],
    ['2 1/4', 4], ['2 1/2', 4], ['2 3/4', 3.5], ['3', 3.5], ['3 1/4', 3.25],
    ['3 1/2', 3.25], ['3 3/4', 3], ['4', 3], ['4 1/4', 3], ['4 1/2', 3],
    ['4 3/4', 2.75], ['5', 2.75], ['5 1/2', 2.625], ['6', 2.5]
].map(([s, t]) => createWhitworthPreset(s, t, 'BSW'));


/**
 * Standard British Standard Fine (BSF) - Fine Series sizes (Ref: BS 84:2007 Table 3).
 * @type {Array<Object>}
 */
export const BSF_SIZES = [
    ['1/16', 60], ['3/32', 48], ['1/8', 40], ['5/32', 32], ['3/16', 32],
    ['7/32', 28], ['1/4', 26], ['9/32', 26], ['5/16', 22], ['3/8', 20],
    ['7/16', 18], ['1/2', 16], ['9/16', 16], ['5/8', 14], ['11/16', 14],
    ['3/4', 12], ['13/16', 12], ['7/8', 11], ['1', 10], ['1 1/8', 9],
    ['1 1/4', 9], ['1 3/8', 8], ['1 1/2', 8], ['1 5/8', 8], ['1 3/4', 7],
    ['1 7/8', 7], ['2', 7], ['2 1/4', 6], ['2 1/2', 6], ['2 3/4', 6],
    ['3', 5], ['3 1/4', 5], ['3 1/2', 4.5], ['3 3/4', 4.5], ['4', 4.5],
    ['4 1/4', 4]
].map(([s, t]) => createWhitworthPreset(s, t, 'BSF'));


/**
 * Calculates Whitworth thread geometry and tolerances based on BS 84:2007 and Machinery's Handbook formulae.
 * @param {number} diameter - Nominal diameter in inches.
 * @param {number} tpi - Threads per inch.
 * @param {number|null} [lengthOfEngagement] - Length of engagement (defaults to diameter if null).
 * @returns {Object} Calculated thread data including basic dimensions and classes (Close, Medium, Free).
 */
export const calculateWhitworth = (diameter, tpi, lengthOfEngagement = null) => {
    // 1. Calculate basic geometry parameters
    const p = 1 / tpi; // Pitch
    const D = diameter;
    const L = lengthOfEngagement || D;

    const theta = (55 / 2) * (Math.PI / 180); // Half-angle in radians
    const H = p / (2 * Math.tan(theta));      // Total depth of V-thread
    const d = (2 / 3) * H;                    // Actual thread depth (Whitworth standard)
    const r = (H / 6) / ((1 / Math.sin(theta)) - 1); // Radius at root and crest

    // 2. Derive basic diameters
    const basicMajor = D;
    const basicPitch = D - d;
    const basicMinor = D - (2 * d);

    // 3. Calculate common tolerance factor T based on BS 84 formula
    const T = 0.002 * Math.cbrt(D) + 0.003 * Math.sqrt(L) + 0.005 * Math.sqrt(p);
    const fmt = (n) => Number(n.toFixed(6));

    // 4. Calculate nut minor diameter tolerance (special logic based on TPI)
    let minorTolTerm;
    if (tpi >= 26) minorTolTerm = 0.004;
    else if (tpi >= 22) minorTolTerm = 0.005;
    else minorTolTerm = 0.007;
    const nutMinorTol = 0.2 * p + minorTolTerm;

    /**
     * @internal
     * Helper to calculate dimensions for specific Whitworth tolerance classes.
     * @param {number} multiplier - Tolerance multiplier (e.g., 2/3 for Close).
     * @param {number} majorOffset - Major diameter offset factor.
     * @param {number} minorOffsetBolt - Minor diameter offset factor for bolts.
     * @param {number|null} nutMultiplier - Specialized multiplier for nuts if different from bolt.
     * @returns {Object} Tolerance boundary dimensions for external and internal threads.
     */
    const getTolerances = (multiplier, majorOffset = 0.01, minorOffsetBolt = 0.02, nutMultiplier = null) => {
        const tEff = T * multiplier;
        const tMajor = tEff + majorOffset * Math.sqrt(p);
        const tMinorBolt = tEff + minorOffsetBolt * Math.sqrt(p);
        const nutTEff = T * (nutMultiplier || multiplier);

        return {
            external: {
                major: fmt(basicMajor),
                pitch: fmt(basicPitch),
                minor: fmt(basicMinor),
                majorMin: fmt(basicMajor - tMajor),
                pitchMin: fmt(basicPitch - tEff),
                minorMin: fmt(basicMinor - tMinorBolt)
            },
            internal: {
                major: fmt(basicMajor),
                pitch: fmt(basicPitch),
                minor: fmt(basicMinor),
                minorMax: fmt(basicMinor + nutMinorTol),
                pitchMax: fmt(basicPitch + nutTEff),
                tapDrill: fmt(basicMinor)
            }
        };
    };

    // 5. Build final result mapping for all standard classes
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
            'Close': getTolerances(2 / 3, 0.01, 0.013),
            'Medium': getTolerances(1, 0.01, 0.02),
            'Free': getTolerances(3 / 2, 0.01, 0.02)
        }
    };
};



/**
 * @module utils/externalThreadGeometry
 * @description Provides core processing logic for manual lathe external threading (turning).
 * This module encapsulates derived engineering formulas for blank preparation 
 * and compound slide settings.
 */

/**
 * Calculates optimized technical parameters for manual lathe single-point threading.
 * Implements the "Clearance-Floor Algorithm" for manual machining.
 * 
 * Calculations include:
 * 1. Compound Slide Angle: (Included Angle / 2) - 0.5°, snapped to 0.5° dial increments.
 * 2. Compound Travel: Trigonometric depth required along the compound axis.
 * 3. Turn Diameter: Optimized major diameter for initial blank preparation (D - 0.1P).
 * 
 * @param {number} angle - The included thread angle in degrees (e.g., 55 for BSW, 47.5 for BA).
 * @param {number} pitch - The thread pitch (in units matching the diameter).
 * @param {number} radialDepth - The theoretical radial depth of the thread (h).
 * @param {number} majorDia - The basic major diameter of the thread.
 * @returns {null|{ turnDia: number, radialDepth: number, compoundAngle: number, compoundDepth: number }} 
 *          Object containing threading constants, or null if parameters are missing.
 */
export const calculateTurningData = (angle, pitch, radialDepth, majorDia) => {
    if (!angle || !pitch || !radialDepth || !majorDia) return null;

    // 1. Compound Angle Determination:
    // Subtracts 0.5 degrees to ensure the tool's trailing flank does not rub.
    // Result is snapped to 0.5 degree steps to match physical lathe scales.
    const compoundAngle = Math.floor(((angle / 2) - 0.5) * 2) / 2;

    // 2. Compound Axis Travel Calculation:
    // T = h / cos(theta), where h is radial depth and theta is compound angle.
    const rad = compoundAngle * (Math.PI / 180);
    const compoundDepth = radialDepth / Math.cos(rad);

    // 3. Recommended Blank Turn Diameter:
    // Slightly undersizing the blank improves surface finish by avoiding 'crest rollover'.
    const turnDia = majorDia - (0.1 * pitch);

    return {
        turnDia: Number(turnDia.toFixed(6)),
        radialDepth: Number(radialDepth.toFixed(6)),
        compoundAngle,
        compoundDepth: Number(compoundDepth.toFixed(6))
    };
};

/**
 * @module utils/chartLogic
 * @description Provides core processing logic for generating workshop-ready thread charts.
 * This module encapsulates logic for grouping data, generating safety advisories, 
 * and calculating manual lathe threading parameters using derived engineering formulas.
 */

/**
 * Groups a collection of thread objects by their series name (e.g., 'BSW', 'BSF').
 * This is used to create organized sections in the UI and print output.
 * 
 * @param {Array<Object>} threads - The list of thread objects to group.
 * @param {string} [threads[].series] - The series name of the thread.
 * @returns {Record<string, Array<Object>>} An object mapping series names to arrays of threads.
 */
export const groupThreadsBySeries = (threads) => {
    return threads.reduce((acc, t) => {
        const series = t.series || 'Other';
        if (!acc[series]) acc[series] = [];
        acc[series].push(t);
        return acc;
    }, {});
};

/**
 * Generates a workshop safety advisory and danger status based on tap drill validation.
 * Analyzes the Percentage of Thread Engagement (PTE) and categorizes the fit 
 * as Caution or Danger based on tolerances.
 * 
 * @param {Object} data - The dataset for a specific thread class (internal or external).
 * @param {string} data.tapDrillName - The identifier/name of the selected drill tool.
 * @param {Object} data.tapDrillValidation - Validation results for the drill selection.
 * @param {number} data.tapDrillValidation.engagement - Calculated Percentage of Thread Engagement (PTE).
 * @param {string} data.tapDrillValidation.status - Semantic status (e.g., 'warning-loose', 'danger-tight').
 * @param {('External'|'Internal')} gender - The gender of the thread being processed.
 * @returns {{ advisoryText: string, isDanger: boolean }} An object containing the display text and a danger flag.
 */
export const getWorkshopAdvisory = (data, gender) => {
    let advisoryText = '';
    let isDanger = false;

    if (gender === 'Internal' && data.tapDrillName) {
        const engagement = Math.round(data.tapDrillValidation?.engagement || 0);
        const status = (data.tapDrillValidation?.status || '').toLowerCase();
        isDanger = status.includes('danger');

        if (status === 'warning-loose') {
            advisoryText = `Caution: Loose Fit (${engagement}% PTE)`;
        } else if (status === 'warning-tight') {
            advisoryText = `Caution: tight fit (${engagement}% PTE)`;
        } else if (status.includes('danger-loose') || status.includes('danger-very-loose')) {
            advisoryText = `Danger: loose, risk of stripping (${engagement}% PTE)`;
        } else if (status.includes('danger-tight')) {
            advisoryText = `Danger: tight, risk of tap breaking (${engagement}% PTE)`;
        }
    }

    return { advisoryText, isDanger };
};

/**
 * Calculates optimized technical parameters for manual lathe single-point threading.
 * Implements the "Clearance-Floor Algorithm" discussed in THREAD_CUTTING_GUIDE.md.
 * 
 * Calculations include:
 * 1. Compound Slide Angle: (Included Angle / 2) - 0.5°, snapped to 0.5° dial increments.
 * 2. Compound Travel: Trigonometric depth required along the compound axis.
 * 3. Turn Diameter: Optimized major diameter for initial blank preparation ($D - 0.1P$).
 * 
 * @param {number} angle - The included thread angle in degrees (e.g., 55 for BSW, 47.5 for BA).
 * @param {number} pitch - The thread pitch (in units matching the diameter).
 * @param {number} radialDepth - The theoretical radial depth of the thread (h).
 * @param {number} majorDia - The basic major diameter of the thread.
 * @returns {null|{ turnDia: number, radialDepth: number, compoundAngle: number, compoundDepth: number }} 
 *          Object containing threading constants, or null if parameters are missing.
 */
export const getThreadingData = (angle, pitch, radialDepth, majorDia) => {
    if (!angle || !pitch || !radialDepth || !majorDia) return null;

    // 1. Compound Angle Determination:
    // Subtracts 0.5 degrees to ensure the tool's trailing flank does not rub.
    // Result is snapped to 0.5 degree steps to match physical lathe scales.
    const compoundAngle = Math.floor(((angle / 2) - 0.5) * 2) / 2;

    // 2. Compound Axis Travel Calculation:
    // $T = h / \cos(\theta)$, where h is radial depth and \theta is compound angle.
    const rad = compoundAngle * (Math.PI / 180);
    const compoundDepth = radialDepth / Math.cos(rad);

    // 3. Recommended Blank Turn Diameter:
    // Slightly undersizing the blank improves surface finish by avoiding 'crest rollover'.
    const turnDia = majorDia - (0.1 * pitch);

    return {
        turnDia,
        radialDepth,
        compoundAngle,
        compoundDepth
    };
};

/**
 * Formats a numeric value to a standard 4-decimal place precision string for workshop charts.
 * 
 * @param {number|any} val - The numeric value to format.
 * @returns {string} The formatted string, or '—' if the value is not a valid number.
 */
export const f = (val) => (typeof val === 'number' ? val.toFixed(4) : '—');

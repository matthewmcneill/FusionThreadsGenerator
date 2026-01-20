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
 * Formats a numeric value to a standard 4-decimal place precision string for workshop charts.
 * 
 * @param {number|any} val - The numeric value to format.
 * @returns {string} The formatted string, or '—' if the value is not a valid number.
 */
export const f = (val) => (typeof val === 'number' ? val.toFixed(4) : '—');

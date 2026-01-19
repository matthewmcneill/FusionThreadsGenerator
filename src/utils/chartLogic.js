/**
 * @module utils/chartLogic
 * @description Shared logic for processing thread data for shop charts and previews.
 */

/**
 * Groups threads by their series name.
 * @param {Array} threads - The list of threads.
 * @returns {Object} Threads grouped by series.
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
 * Generates the workshop advisory text and danger status for a thread.
 * @param {Object} data - The class data (external/internal).
 * @param {string} gender - 'External' or 'Internal'.
 * @returns {Object} { advisoryText: string, isDanger: boolean }
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
 * Formats a numeric value to 4 decimal places, or returns '-' if not a number.
 * @param {number|any} val - The value to format.
 * @returns {string} The formatted string.
 */
export const f = (val) => (typeof val === 'number' ? val.toFixed(4) : '-');

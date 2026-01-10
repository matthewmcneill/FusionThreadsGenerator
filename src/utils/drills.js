/**
 * @module utils/drills
 * @description Provides lookup, selection, and validation for standard drill sets (Metric, Fractional, Letter, Number).
 * 
 * @exports
 * - METRIC_DRILLS: List of standard metric drill bits (sorted by size).
 * - FRACTIONAL_DRILLS: List of standard fractional imperial drill bits.
 * - LETTER_DRILLS: List of standard lettered imperial drill bits (A-Z).
 * - NUMBER_DRILLS: List of standard numbered imperial drill bits (#1-80).
 * - getNearestDrill: Finds the closest physical tool bit for a target diameter.
 * - validateTapDrill: Validates drill selection against thread geometry and material targets.
 * 
 * @internal
 * - simplifyFraction: Helper to reduce fractions to their simplest form.
 * - addFractionalRange: Logic to populate the fractional drill array.
 */

/**
 * Standard Numbered Drills (#80 to #1).
 * Sizes defined in decimal inches.
 * @type {Array<{name: string, size: number}>}
 */
export const NUMBER_DRILLS = [
    { name: "#80", size: 0.0135 }, { name: "#79", size: 0.0145 }, { name: "#78", size: 0.0160 },
    { name: "#77", size: 0.0180 }, { name: "#76", size: 0.0200 }, { name: "#75", size: 0.0210 },
    { name: "#74", size: 0.0225 }, { name: "#73", size: 0.0240 }, { name: "#72", size: 0.0250 },
    { name: "#71", size: 0.0260 }, { name: "#70", size: 0.0280 }, { name: "#69", size: 0.0292 },
    { name: "#68", size: 0.0310 }, { name: "#67", size: 0.0320 }, { name: "#66", size: 0.0330 },
    { name: "#65", size: 0.0350 }, { name: "#64", size: 0.0360 }, { name: "#63", size: 0.0370 },
    { name: "#62", size: 0.0380 }, { name: "#61", size: 0.0390 }, { name: "#60", size: 0.0400 },
    { name: "#59", size: 0.0410 }, { name: "#58", size: 0.0420 }, { name: "#57", size: 0.0430 },
    { name: "#56", size: 0.0465 }, { name: "#55", size: 0.0520 }, { name: "#54", size: 0.0550 },
    { name: "#53", size: 0.0595 }, { name: "#52", size: 0.0635 }, { name: "#51", size: 0.0670 },
    { name: "#50", size: 0.0700 }, { name: "#49", size: 0.0730 }, { name: "#48", size: 0.0760 },
    { name: "#47", size: 0.0785 }, { name: "#46", size: 0.0810 }, { name: "#45", size: 0.0820 },
    { name: "#44", size: 0.0860 }, { name: "#43", size: 0.0890 }, { name: "#42", size: 0.0935 },
    { name: "#41", size: 0.0960 }, { name: "#40", size: 0.0980 }, { name: "#39", size: 0.0995 },
    { name: "#38", size: 0.1015 }, { name: "#37", size: 0.1040 }, { name: "#36", size: 0.1065 },
    { name: "#35", size: 0.1100 }, { name: "#34", size: 0.1110 }, { name: "#33", size: 0.1130 },
    { name: "#32", size: 0.1160 }, { name: "#31", size: 0.1200 }, { name: "#30", size: 0.1285 },
    { name: "#29", size: 0.1360 }, { name: "#28", size: 0.1405 }, { name: "#27", size: 0.1440 },
    { name: "#26", size: 0.1470 }, { name: "#25", size: 0.1495 }, { name: "#24", size: 0.1520 },
    { name: "#23", size: 0.1540 }, { name: "#22", size: 0.1570 }, { name: "#21", size: 0.1590 },
    { name: "#20", size: 0.1610 }, { name: "#19", size: 0.1660 }, { name: "#18", size: 0.1695 },
    { name: "#17", size: 0.1730 }, { name: "#16", size: 0.1770 }, { name: "#15", size: 0.1800 },
    { name: "#14", size: 0.1820 }, { name: "#13", size: 0.1850 }, { name: "#12", size: 0.1890 },
    { name: "#11", size: 0.1910 }, { name: "#10", size: 0.1935 }, { name: "#9", size: 0.1960 },
    { name: "#8", size: 0.1990 }, { name: "#7", size: 0.2010 }, { name: "#6", size: 0.2040 },
    { name: "#5", size: 0.2055 }, { name: "#4", size: 0.2090 }, { name: "#3", size: 0.2130 },
    { name: "#2", size: 0.2210 }, { name: "#1", size: 0.2280 }
];

/**
 * Standard Lettered Drills (A to Z).
 * Sizes defined in decimal inches.
 * @type {Array<{name: string, size: number}>}
 */
export const LETTER_DRILLS = [
    { name: "A", size: 0.234 }, { name: "B", size: 0.238 }, { name: "C", size: 0.242 },
    { name: "D", size: 0.246 }, { name: "E", size: 0.250 }, { name: "F", size: 0.257 },
    { name: "G", size: 0.261 }, { name: "H", size: 0.266 }, { name: "I", size: 0.272 },
    { name: "J", size: 0.277 }, { name: "K", size: 0.281 }, { name: "L", size: 0.290 },
    { name: "M", size: 0.295 }, { name: "N", size: 0.302 }, { name: "O", size: 0.316 },
    { name: "P", size: 0.323 }, { name: "Q", size: 0.332 }, { name: "R", size: 0.339 },
    { name: "S", size: 0.348 }, { name: "T", size: 0.358 }, { name: "U", size: 0.368 },
    { name: "V", size: 0.377 }, { name: "W", size: 0.386 }, { name: "X", size: 0.397 },
    { name: "Y", size: 0.404 }, { name: "Z", size: 0.413 }
];

/**
 * Standard Metric Drills.
 * Includes sizes from 0.10mm to 20.00mm.
 * @type {Array<{name: string, size: number, sizeMm: number}>}
 */
export const METRIC_DRILLS = [];
// 0.10mm to 3.00mm: 0.05mm increments for high precision in small threads
for (let i = 10; i <= 300; i += 5) {
    const d = i / 100;
    METRIC_DRILLS.push({ name: `${d.toFixed(2)}mm`, size: d / 25.4, sizeMm: d });
}
// 3.10mm to 13.00mm: 0.10mm increments (standard machine shop range)
for (let i = 310; i <= 1300; i += 10) {
    const d = i / 100;
    METRIC_DRILLS.push({ name: `${d.toFixed(1)}mm`, size: d / 25.4, sizeMm: d });
}
// 13.50mm to 20.00mm: 0.50mm increments (large holes)
for (let i = 1350; i <= 2000; i += 50) {
    const d = i / 100;
    METRIC_DRILLS.push({ name: `${d.toFixed(1)}mm`, size: d / 25.4, sizeMm: d });
}

// 4. Fractional Drills
// ... (simplifyFraction and addFractionalRange logic remains the same)
// ...
/**
 * Standard Fractional Drills.
 * Populated at runtime using addFractionalRange.
 * @type {Array<{name: string, size: number, type: string}>}
 */
export const FRACTIONAL_DRILLS = [];
/**
 * @internal
 * Simplifies a fraction by finding the greatest common divisor.
 * @param {number} num - Numerator.
 * @param {number} den - Denominator.
 * @returns {string} Simplified fraction string (e.g., "1/2").
 */
const simplifyFraction = (num, den) => {
    const gcd = (a, b) => b ? gcd(b, a % b) : a;
    const factor = gcd(num, den);
    return `${num / factor}/${den / factor}`;
};

/**
 * @internal
 * Populates the FRACTIONAL_DRILLS array with a range of standard sizes.
 * @param {number} start64ths - Starting size in 64ths of an inch.
 * @param {number} end64ths - Ending size in 64ths of an inch.
 * @param {number} step64ths - Increment step in 64ths.
 */
const addFractionalRange = (start64ths, end64ths, step64ths) => {
    for (let i = start64ths; i <= end64ths; i += step64ths) {
        const size = i / 64;
        let name;
        // Logic to construct pretty fraction strings (e.g. 1 1/8")
        if (i % 64 === 0) {
            // Whole numbers
            name = `${i / 64}\"`;
        } else if (i > 64) {
            // Mixed numbers (e.g. 1 1/16)
            const whole = Math.floor(i / 64);
            const rem = i % 64;
            name = `${whole} ${simplifyFraction(rem, 64)}\"`;
        } else {
            // Simple fractions (e.g. 1/32)
            name = `${simplifyFraction(i, 64)}\"`;
        }
        FRACTIONAL_DRILLS.push({ name, size, type: 'fractional' });
    }
};

addFractionalRange(1, 64 * 1.75, 1);
addFractionalRange(64 * 1.75 + 2, 64 * 2.25, 2);
addFractionalRange(64 * 2.25 + 4, 64 * 3.0, 4);
addFractionalRange(64 * 3.0 + 8, 64 * 6.0, 8);

/**
 * Finds the nearest drill from specified standard sets, respecting inventory filters.
 * @param {number} targetDiameter - Target diameter value.
 * @param {string} units - 'in' or 'mm'.
 * @param {Array<string>} [allowedSets=['Metric', 'Number', 'Letter', 'Imperial']] - List of sets to include.
 * @param {Array<Object>} [customDrills=[]] - User-defined drills { name, size, unit }.
 * @param {Array<string>} [disabledDrills=[]] - List of drill names to exclude.
 * @returns {Object|null} Closest drill bit or null.
 */
export const getNearestDrill = (
    targetDiameter,
    units = 'in',
    allowedSets = ['Metric', 'Number', 'Letter', 'Imperial'],
    customDrills = [],
    disabledDrills = []
) => {
    const targetInches = units === 'mm' ? targetDiameter / 25.4 : targetDiameter;
    const sets = allowedSets.map(s => s.toLowerCase());

    const candidates = [];

    // 1. Add standard drills if their set is allowed
    if (sets.includes('imperial') || sets.includes('fractional')) candidates.push(...FRACTIONAL_DRILLS);
    if (sets.includes('letter')) candidates.push(...LETTER_DRILLS);
    if (sets.includes('number')) candidates.push(...NUMBER_DRILLS);
    if (sets.includes('metric')) candidates.push(...METRIC_DRILLS);

    // 2. Add custom drills (converting mm to inches if necessary)
    if (customDrills && customDrills.length > 0) {
        candidates.push(...customDrills.map(d => ({
            ...d,
            size: d.unit === 'mm' ? d.sizeMm / 25.4 : d.size,
            isCustom: true
        })));
    }

    // 3. Filter out disabled drills
    const filteredCandidates = (disabledDrills && disabledDrills.length > 0)
        ? candidates.filter(d => !disabledDrills.includes(d.name))
        : candidates;

    if (filteredCandidates.length === 0) return null;

    // Use reduce to find the candidate with the absolute minimum difference from target.
    return filteredCandidates.reduce((prev, curr) => {
        const diffCurr = Math.abs(curr.size - targetInches);
        const diffPrev = Math.abs(prev.size - targetInches);

        // If differences are identical (precision limit), stick with the previous match.
        if (Math.abs(diffCurr - diffPrev) < 1e-10) {
            return prev;
        }

        return (diffCurr < diffPrev) ? curr : prev;
    });
};

/**
 * Validates a drill selection against thread form limits and material-specific targets.
 * @param {number} drillSize - Selected drill size (in inches).
 * @param {number} major - Basic major diameter (in inches).
 * @param {number} minor - Basic minor diameter (100% engagement, in inches).
 * @param {number} nutMinorMax - Specification limit for minor diameter (in inches).
 * @param {string} [material='ferrous'] - Substrate material group.
 * @returns {Object} Validation result { engagement, status, label, color }.
 */
export const validateTapDrill = (drillSize, major, minor, nutMinorMax, material = 'ferrous') => {
    const totalHeight = (major - minor) / 2;
    if (totalHeight <= 0) return { engagement: 0, status: 'error', label: 'Invalid Thread' };

    // Engagement % = (Major - Drill) / (2 * totalHeight) * 100
    const engagement = Math.max(0, ((major - drillSize) / (2 * totalHeight)) * 100);

    // Material-Specific Optimal Ranges
    const ranges = {
        hard: { min: 55, max: 65, target: 60 },
        ferrous: { min: 65, max: 75, target: 70 },
        soft: { min: 75, max: 85, target: 80 }
    };
    const range = ranges[material] || ranges.ferrous;

    let status = 'optimal';
    let label = 'Optimal Fit';
    let color = '#10b981'; // Green

    if (drillSize >= major) {
        status = 'catastrophic-large';
        label = 'Critical: No Thread Remaining';
        color = '#ef4444'; // Red
    } else if (drillSize <= minor) {
        status = 'catastrophic-small';
        label = 'Critical: Tap Breakage Certain';
        color = '#ef4444'; // Red
    } else if (engagement < 25) {
        status = 'catastrophic-weak';
        label = 'Critical: Structurally Unsound';
        color = '#ef4444'; // Red
    } else if (engagement < 35) {
        status = 'danger-very-loose';
        label = 'Danger: Low Engagement';
        color = '#ef4444'; // Red
    } else if (engagement < 50) {
        status = 'danger-loose';
        label = 'Stripping Risk';
        color = '#ef4444'; // Red
    } else if (engagement < range.min) {
        status = 'warning-loose';
        label = 'Loose Fit';
        color = '#f59e0b'; // Amber
    } else if (engagement > 90) {
        status = 'danger-tight';
        label = 'Tap Breakage Risk';
        color = '#ef4444'; // Red
    } else if (engagement > range.max) {
        status = 'warning-tight';
        label = 'Tight Fit';
        color = '#f59e0b'; // Amber
    }

    return {
        engagement,
        status,
        label,
        color,
        range,
        target: range.target
    };
};

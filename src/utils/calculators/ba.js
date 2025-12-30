
// BA Sizes 0-16 Lookup Table (Metric mm)
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

export const calculateBA = (sizeNumber) => {
    const size = BA_TABLE[sizeNumber.toString()];
    if (!size) return null;

    const p = size.p;
    const h = size.h;
    const D = size.D;

    // Normal Class Tolerances (Metric mm)
    // Bolts 0-10 BA: Major=0.20p, Eff=0.10p+0.025, Minor=0.20p+0.05
    // Bolts 11-16 BA: Major=0.25p, Eff=0.10p+0.025, Minor=0.20p+0.05
    const sizeNum = parseInt(sizeNumber);
    const majorTol = (sizeNum <= 10) ? (0.20 * p) : (0.25 * p);
    const effTol = 0.10 * p + 0.025;
    const minorBoltTol = 0.20 * p + 0.05;

    // Nuts All: Eff=0.12p+0.03, Minor=0.375p
    const nutEffTol = 0.12 * p + 0.03;
    const nutMinorTol = 0.375 * p;

    // Formatting to 6 decimal places
    const fmt = (n) => Number(n.toFixed(6));

    return {
        basic: {
            major: fmt(D),
            pitch: fmt(size.eff),
            minor: fmt(size.min),
            h: fmt(h),
            r: fmt(size.r),
            p: fmt(p)
        },
        external: {
            major: fmt(D),
            pitch: fmt(size.eff),
            minor: fmt(size.min),
            majorMin: fmt(D - majorTol),
            pitchMin: fmt(size.eff - effTol),
            minorMin: fmt(size.min - minorBoltTol)
        },
        internal: {
            major: fmt(D),
            pitch: fmt(size.eff),
            minor: fmt(size.min),
            minorMax: fmt(size.min + nutMinorTol),
            pitchMax: fmt(size.eff + nutEffTol),
            tapDrill: fmt(size.min) // Approximate
        }
    };
};

export const BAStandard = {
    name: 'BA Threads',
    unit: 'mm',
    angle: 47.5,
    sortOrder: 2,
    threadForm: 8 // Using 8 for BA as per research (radius support)
};

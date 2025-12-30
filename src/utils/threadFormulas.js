
export const calculateWhitworth = (diameter, tpi, lengthOfEngagement = null) => {
    // Inputs: diameter (inches), tpi (threads per inch)
    // lengthOfEngagement (inches) - defaults to diameter if not provided

    const p = 1 / tpi; // Pitch in inches
    const D = diameter; // Major Diameter
    const L = lengthOfEngagement || D; // Default length of engagement

    // Basic Form Constants (from Handbook)
    // Whitworth angle = 55 degrees
    const theta = (55 / 2) * (Math.PI / 180);
    const H = p / (2 * Math.tan(theta));

    // d = 2/3 * H
    // r = (H/6) / (csc(theta) - 1) -> height of capping circular segment is H/6
    const d = (2 / 3) * H;
    const r = (H / 6) / ((1 / Math.sin(theta)) - 1);

    // Basic Dimensions
    // Major = D
    // Pitch (Effective) = D - d
    // Minor = D - 2d
    const basicMajor = D;
    const basicPitch = D - d;
    const basicMinor = D - (2 * d);

    // Tolerance Formula (Medium Class)
    // T = 0.002 * cbrt(D) + 0.003 * sqrt(L) + 0.005 * sqrt(p)
    // Note: D, L, p in inches.
    const T = 0.002 * Math.cbrt(D) + 0.003 * Math.sqrt(L) + 0.005 * Math.sqrt(p);

    // External (Bolt) - Medium Class
    // Major Max: D
    // Major Min: D - (T + 0.01 * sqrt(p))
    // Pitch Max: Basic Pitch
    // Pitch Min: Basic Pitch - T
    // Minor Max: Basic Minor
    // Minor Min: Basic Minor - (T + 0.02 * sqrt(p))

    // Note: Fusion usually prefers the Maximum Material Condition (MMC) for the model geometry,
    // which for external threads is the upper limit (Basic sizes).
    const extMajor = basicMajor;
    const extPitch = basicPitch;
    const extMinor = basicMinor;

    // Minor Max: Basic Minor + Tolerance
    // Table footnotes for Nut Minor Dia Tolerance:
    // b: 26 TPI and finer -> 0.2p + 0.004
    // c: 24 and 22 TPI -> 0.2p + 0.005
    // d: 20 TPI and coarser -> 0.2p + 0.007
    let minorTolTerm;
    if (tpi >= 26) {
        minorTolTerm = 0.004;
    } else if (tpi >= 22) {
        minorTolTerm = 0.005;
    } else {
        minorTolTerm = 0.007;
    }
    const nutMinorTol = 0.2 * p + minorTolTerm;

    // Fusion uses these values for the hole. MMC is the lower limit (Basic sizes).
    const intMajor = basicMajor;
    const intPitch = basicPitch;
    const intMinor = basicMinor; // Tap Drill approx

    // Formatting to 6 decimal places (standard precision for machining)
    const fmt = (n) => Number(n.toFixed(6));

    return {
        T: fmt(T),
        basic: {
            major: fmt(basicMajor),
            pitch: fmt(basicPitch),
            minor: fmt(basicMinor),
            d: fmt(d),
            r: fmt(r)
        },
        external: {
            major: fmt(extMajor),
            pitch: fmt(extPitch),
            minor: fmt(extMinor),
            majorMin: fmt(extMajor - (T + 0.01 * Math.sqrt(p))),
            pitchMin: fmt(extPitch - T),
            minorMin: fmt(extMinor - (T + 0.02 * Math.sqrt(p)))
        },
        internal: {
            major: fmt(intMajor),
            pitch: fmt(intPitch),
            minor: fmt(intMinor),
            minorMax: fmt(intMinor + nutMinorTol),
            pitchMax: fmt(intPitch + T),
            tapDrill: fmt(intMinor)
        }
    };
};

export const calculateBA = (sizeNumber) => {
    // British Association (BA) threads are defined by number (0 to 25ish)
    // Formula: p = 0.9^sizeNumber (mm) -> convert to inches? Fusion supports mm.
    // We'll stick to mm if the user selects BA, but Fusion XMLs for BA usually use Metric units?
    // Whitworth is Inch. BA is Metric (Wait, BA pitch is mm, but 47.5 deg).
    // Formula: Pitch (mm) = 0.9^N. Major Dia (mm) = 6 * p^1.2.

    // Angle: 47.5 deg
    // d = 0.6 * p
    // r = 2 * p / 11

    // TODO: Implement if requested, but focused on Whitworth for now as per image.
    return null;
};

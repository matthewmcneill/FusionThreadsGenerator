# British Standard Cycle (BSC) / CEI Thread Specification

This document provides a technical reference for British Standard Cycle (BSC) threads, formerly known as Cycle Engineers' Institute (CEI). These threads are defined by **BS 811:1950**.

## 1. Thread Form Geometry

The BSC thread form is characterized by a 60° included angle and rounded crests and roots.

- **Angle ($\alpha$)**: $60^\circ$
- **Pitch ($P$)**: $1 / TPI$
- **Fundamental Height ($H$)**:
  - $H = \frac{P}{2 \tan(30^\circ)} = P \times \frac{\sqrt{3}}{2} \approx 0.866025P$
- **Crest and Root Radius ($r$)**:
  - $r = P / 6 \approx 0.166667P$
- **Basic Depth of Thread ($h$)**:
  - $h = H - \frac{P}{3} \approx 0.5327P$

## 2. Fundamental Formulas

To ensure derivation from first principles and avoid hard-coding constants, use the following formulas:

| Parameter | Formula | Decimal Approx |
| :--- | :--- | :--- |
| **Major Diameter** | $D$ | - |
| **Effective (Pitch) Diameter** | $D_2 = D - h$ | $D - 0.5327P$ |
| **Minor (Core) Diameter** | $D_1 = D - 2h$ | $D - 1.0654P$ |
| **Root/Crest Radius** | $r = P / 6$ | $0.166667P$ |

## 3. Thread Designations (Series)

To support the modular architecture of the generator, the BSC standard is split into two primary **Designations**. This allows for precise lookup based on machine heritage (Bicycle vs. Motorcycle).

### 3.1 Standard Series (BS 811)
The hallmark of the standard BSC specification is the dominance of **26 TPI** across almost all fastener diameters.

| Nominal Size (in) | TPI | Pitch (in) | Usage Note |
| :--- | :--- | :--- | :--- |
| 1/8 | 40 | 0.0250 | Instruments/Brakes |
| 5/32 | 32 | 0.0312 | Mudguards |
| 3/16 | 32 | 0.0312 | General small fasteners |
| 1/4 | 26 | 0.0385 | Front Axles (sometimes) |
| 5/16 | 26 | 0.0385 | Stems / Front Axles |
| 3/8 | 26 | 0.0385 | Rear Axles |
| 7/16 | 26 | 0.0385 | Standard Cycle Fasteners |
| 1/2 | 26 | 0.0385 | Standard Cycle Fasteners |
| 9/16 | 26 | 0.0385 | Pedal Spindles |
| 1 | 26 | 0.0385 | Headsets (Steerer tubes) |
| 1.370 | 24 | 0.0417 | Bottom Brackets (Special) |

### 3.2 BSA Motorcycle Series (Heavy)
The "BSA Deviation" is treated as a separate series. For diameters of **7/16" and larger**, this designation uses a coarser **20 TPI** pitch.

| Nominal Size (in) | TPI | Pitch (in) | Usage Note |
| :--- | :--- | :--- | :--- |
| 7/16 | 20 | 0.0500 | Heavy Cycle / Motorcycle |
| 1/2 | 20 | 0.0500 | Heavy Cycle / Motorcycle |
| 9/16 | 20 | 0.0500 | Heavy Cycle / Motorcycle |
| 5/8 | 20 | 0.0500 | Heavy Cycle / Motorcycle |
| 3/4 | 20 | 0.0500 | Heavy Cycle / Motorcycle |

## 4. Manufacturing Tolerances (BS 811:1950)

Tolerances in BS 811 scale with the square root of the pitch ($\sqrt{P}$).

### 4.1 Classes of Fit
- **Close Class**: For precision fits.
- **Medium Class**: General engineering fit (Standard).
- **Free Class**: Loose fit for environments with dirt/grit.

### 4.2 Tolerance Formulas
Based on standard British metrology for cycle threads:

**Internal Threads (Nuts):**
- **Minor Diameter Tolerance**: $0.2 \times P + 0.004"$ (for TPI $\ge$ 26).

**External Threads (Bolts):**
- Tolerances are applied as a radial shift inward to ensure clearance.
- **Effective Diameter Tolerance ($T_{eff}$)**: Scales with $\sqrt{P}$. For Medium Class, $T_{eff} \approx 0.002 \sqrt[3]{D} + 0.003 \sqrt{L} + 0.005 \sqrt{P}$ is often used as a baseline across British standards (like BS 84), but BS 811 specifically focuses on the $\sqrt{P}$ relationship for the cycle industry's fine threads.

## 5. References
1. **BS 811:1950**: British Standard for Cycle Threads.
2. **Cycle Engineers’ Institute (CEI)**: Original 1902 Specification.

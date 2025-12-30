# Whitworth Thread Specification

This document provides a technical reference for British Standard Whitworth (BSW) and British Standard Fine (BSF) thread forms, based on **BS 84:2007** ("Parallel screw threads of Whitworth form - Requirements").  And from the Machinery's Handbook (various editions).

## 1. Thread Form Geometry

The Whitworth thread form is characterized by a 55° included angle and rounded crests and roots.

- **Angle**: $55^\circ$
- **Pitch ($p$)**: $1 / n$ (where $n$ is threads per inch)
- **Depth of Thread ($d$)**:
  - $d = \frac{1}{3}p \times \cot(27^\circ 30') = 0.640327p$
- **Radius at crest and root ($r$)**:
  - $r = \frac{H/6}{\csc(27^\circ 30') - 1} = 0.137329p$ (where $H$ is the fundamental triangle height)

## 2. Fundamental Formulas

| Parameter | Formula |
| :--- | :--- |
| **Basic Major Diameter** | $D$ |
| **Basic Pitch (Effective) Diameter** | $D - d$ |
| **Basic Minor Diameter** | $D - 2d$ |

## 3. Tolerance Formulas (BS 84:2007)

The symbol $T$ represents the tolerance in inches:
$$T = 0.002 \sqrt[3]{D} + 0.003 \sqrt{L} + 0.005 \sqrt{p}$$
Where:
- $D$ = Major diameter (inches)
- $L$ = Length of engagement (inches)
- $p$ = Pitch (inches)

### Table 1: Tolerance Formulas for BSW and BSF Threads
*Note: + for nuts, - for bolts*

| Class or Fit | Major Dia. | Effective Dia. | Minor Dia. |
| :--- | :--- | :--- | :--- |
| **Bolts (Close)** | $\frac{2}{3}T + 0.01 \sqrt{p}$ | $\frac{2}{3}T$ | $\frac{2}{3}T + 0.013 \sqrt{p}$ |
| **Bolts (Medium)** | $T + 0.01 \sqrt{p}$ | $T$ | $T + 0.02 \sqrt{p}$ |
| **Bolts (Free)** | $\frac{3}{2}T + 0.01 \sqrt{p}$ | $\frac{3}{2}T$ | $\frac{3}{2}T + 0.02 \sqrt{p}$ |
| **Nuts (Close)** | ... | $\frac{2}{3}T$ | $0.2p + 0.004^b$ |
| **Nuts (Medium)** | ... | $T$ | $0.2p + 0.005^c$ |
| **Nuts (Normal)** | ... | $\frac{3}{2}T$ | $0.2p + 0.007^d$ |

**Footnotes for Nut Minor Dia Tolerance:**
- $^b$ For 26 threads per inch and finer.
- $^c$ For 24 and 22 threads per inch.
- $^d$ For 20 threads per inch and coarser.

## 4. Usage Recommendations

- **Stainless Steel**: For stainless steel bolts of nominal size $3/4$ inch and below, it is recommended to use **Medium** or **Free** class limits rather than Close class limits.
- **Large Sizes**: For nominal sizes above $3/4$ inch, maximum and minimum limits should be $0.001$ inch smaller than the values obtained from the table.

## 5. Standard Size Reference Tables

These tables list the standard Threads Per Inch (TPI) for BSW and BSF series as defined in BS 84:2007.

### Table 2: British Standard Whitworth (BSW) - Coarse Series

| Nominal Size (in) | TPI | Note |
| :--- | :--- | :--- |
| 1/16 | 60 | Supplementary |
| 3/32 | 48 | Supplementary |
| 1/8 | 40 | Standard |
| 5/32 | 32 | Standard |
| 3/16 | 24 | Standard |
| 7/32 | 24 | Standard |
| 1/4 | 20 | Standard |
| 5/16 | 18 | Standard |
| 3/8 | 16 | Standard |
| 7/16 | 14 | Standard |
| 1/2 | 12 | Standard |
| 9/16 | 12 | Standard |
| 5/8 | 11 | Standard |
| 11/16 | 11 | Intermediate |
| 3/4 | 10 | Standard |
| 7/8 | 9 | Standard |
| 1 | 8 | Standard |
| 1 1/8 | 7 | Standard |
| 1 1/4 | 7 | Standard |
| 1 3/8 | 6 | Standard |
| 1 1/2 | 6 | Standard |
| 1 5/8 | 5 | Standard |
| 1 3/4 | 5 | Standard |
| 1 7/8 | 4.5 | Standard |
| 2 | 4.5 | Standard |
| 2 1/4 | 4 | Standard |
| 2 1/2 | 4 | Standard |
| 2 3/4 | 3.5 | Standard |
| 3 | 3.5 | Standard |
| 3 1/4 | 3.25 | Standard |
| 3 1/2 | 3.25 | Standard |
| 3 3/4 | 3 | Standard |
| 4 | 3 | Standard |
| 4 1/4 | 3 | Standard |
| 4 1/2 | 3 | Standard |
| 4 3/4 | 2.75 | Standard |
| 5 | 2.75 | Standard |
| 5 1/2 | 2.625 | Standard |
| 6 | 2.5 | Standard |

### Table 3: British Standard Fine (BSF) - Fine Series

| Nominal Size (in) | TPI | Note |
| :--- | :--- | :--- |
| 1/16 | 60 | Supplementary |
| 3/32 | 48 | Supplementary |
| 1/8 | 40 | Supplementary |
| 5/32 | 32 | Supplementary |
| 3/16 | 32 | Standard |
| 7/32 | 28 | Standard |
| 1/4 | 26 | Standard |
| 9/32 | 26 | Intermediate |
| 5/16 | 22 | Standard |
| 3/8 | 20 | Standard |
| 7/16 | 18 | Standard |
| 1/2 | 16 | Standard |
| 9/16 | 16 | Standard |
| 5/8 | 14 | Standard |
| 11/16 | 14 | Intermediate |
| 3/4 | 12 | Standard |
| 13/16 | 12 | Intermediate |
| 7/8 | 11 | Standard |
| 1 | 10 | Standard |
| 1 1/8 | 9 | Standard |
| 1 1/4 | 9 | Standard |
| 1 3/8 | 8 | Standard |
| 1 1/2 | 8 | Standard |
| 1 5/8 | 8 | Standard |
| 1 3/4 | 7 | Standard |
| 1 7/8 | 7 | Standard |
| 2 | 7 | Standard |
| 2 1/4 | 6 | Standard |
| 2 1/2 | 6 | Standard |
| 2 3/4 | 6 | Standard |
| 3 | 5 | Standard |
| 3 1/4 | 5 | Standard |
| 3 1/2 | 4.5 | Standard |
| 3 3/4 | 4.5 | Standard |
| 4 | 4.5 | Standard |
| 4 1/4 | 4 | Standard |

## 5. References

1. **BS 84:2007**: Parallel screw threads of Whitworth form - Requirements. British Standards Institution.
2. **Machinery's Handbook** (Various Editions): Technical data for Whitworth thread forms and historical standard sizes.

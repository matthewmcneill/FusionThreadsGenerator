# Whitworth Thread Specification

This document provides a technical reference for the British Standard Whitworth (BSW) and British Standard Fine (BSF) thread forms, based on Machinery's Handbook (1953).

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

## 3. Tolerance Formulas

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

These tables list the standard Threads Per Inch (TPI) for common Whitworth sizes, which can be used as presets for the generator.

### Table 2: British Standard Whitworth (BSW) - Coarse

| Nominal Size (in) | TPI | Pitch ($p$) | Depth ($d$) |
| :--- | :--- | :--- | :--- |
| 1/8 | 40 | 0.0250 | 0.0160 |
| 3/16 | 24 | 0.0417 | 0.0267 |
| 1/4 | 20 | 0.0500 | 0.0320 |
| 5/16 | 18 | 0.0556 | 0.0356 |
| 3/8 | 16 | 0.0625 | 0.0400 |
| 7/16 | 14 | 0.0714 | 0.0457 |
| 1/2 | 12 | 0.0833 | 0.0534 |
| 5/8 | 11 | 0.0909 | 0.0582 |
| 3/4 | 10 | 0.1000 | 0.0640 |
| 7/8 | 9 | 0.1111 | 0.0711 |
| 1 | 8 | 0.1250 | 0.0800 |

### Table 3: British Standard Fine (BSF)

| Nominal Size (in) | TPI | Pitch ($p$) | Depth ($d$) |
| :--- | :--- | :--- | :--- |
| 3/16 | 32 | 0.0313 | 0.0200 |
| 1/4 | 26 | 0.0385 | 0.0246 |
| 5/16 | 22 | 0.0455 | 0.0291 |
| 3/8 | 20 | 0.0500 | 0.0320 |
| 7/16 | 18 | 0.0556 | 0.0356 |
| 1/2 | 16 | 0.0625 | 0.0400 |
| 5/8 | 14 | 0.0714 | 0.0457 |
| 3/4 | 12 | 0.0833 | 0.0534 |
| 1 | 10 | 0.1000 | 0.0640 |

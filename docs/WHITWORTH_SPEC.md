# Whitworth Thread Specification

This document provides a technical reference for British Standard Whitworth (BSW) and British Standard Fine (BSF) thread forms, based on Machinery's Handbook and **BS 84:2007** ("Parallel screw threads of Whitworth form - Requirements").

## 1. Thread Form Geometry

The Whitworth thread form is characterized by a 55° included angle and rounded crests and roots.

- **Angle**: $55^\circ$
- **Pitch ($p$)**: $1 / n$ (where $n$ is threads per inch)
- **Fundamental Height ($H$)**: 
  - $H = \frac{p}{2 \times \tan(27.5^\circ)} \approx 0.960491p$
- **Depth of Thread ($d$)**:
  - $d = \frac{2}{3}H \approx 0.640327p$
- **Radius at crest and root ($r$)**:
  - $r = \frac{H/6}{\csc(27.5^\circ) - 1} = 0.137329p$

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

## 5. Tap Drill Selection

While the theoretical minor diameter is the absolute minimum hole size, workshop practice usually recommends a slightly larger drill bit to provide roughly **75% to 80% thread engagement**. This prevents tap breakage and reduces the torque required to cut the thread.

### Tap Drill Selection
For Whitworth threads, the generator recommends tapping drills based on an **Engineering Analysis** of thread engagement and material properties.

#### 1. Algorithmic Determination
The target drill size ($D_{drill}$) is calculated based on the desired **Percentage of Thread Engagement (PTE)**:

**Cut Taps:**
$$D_{drill} = Major\ Diameter - (1.280654 \times p \times \frac{PTE}{100})$$

**Roll (Form) Taps:**
$$D_{drill} = Major\ Diameter - (0.5 \times p \times \frac{PTE}{100})$$

#### 2. Material-Specific Targets
The generator optimizes the $PTE$ based on the substrate material:
- **Hard Alloys** (Hard Steel, Ti, Stainless): **60% PTE** (Minimizes tap breakage).
- **General Ferrous** (Mild Steel, Cast Iron): **70% PTE** (Optimal balance).
- **Soft Non-Ferrous** (Aluminum, Brass, Plastic): **80% PTE** (Maximizes thread strength).

### 5.2 Machinist Drill Set Mapping
The target decimal is automatically mapped to the closest available drill from three standard Imperial sets to ensure high precision (typically within 0.001" to 0.005"):
1.  **Fractional Drills**: 1/64" increments.
2.  **Number Drills**: #80 through #1.
3.  **Letter Drills**: A through Z.

The table displays both the recommended **Shop Drill Name** (e.g., `13/64"`, `#7`, or `F`) and the target decimal diameter.

### 5.3 Recommended Shop Drills (Reference)

| Size | BSW Drill (Shop) | BSF Drill (Shop) |
| :--- | :--- | :--- |
| **1/16** | #53 (0.0595) | #53 (0.0595) |
| **1/8** | #30 (0.1285) | #30 (0.1285) |
| **3/16** | #9 (0.1960) | #15 (0.1800) |
| **1/4** | #4 (0.2090) | #4 (0.2090) |
| **5/16** | 17/64 (0.2656) | L (0.2900) |
| **3/8** | 5/16 (0.3125) | 21/64 (0.3281) |
| **7/16** | U (0.3680) | 25/64 (0.3906) |
| **1/2** | 27/64 (0.4219) | 29/64 (0.4531) |

### 6.1 Standard Tolerance Classes (BS 84)
The generator provides the standard tolerance grades defined in BS 84:2007. Note that the naming conventions differ between internal (nut) and external (bolt) threads:

#### External Threads (Bolts)
- **Close**: High-precision fit ($2/3 T$ multiplier).
- **Medium**: General engineering fit ($1.0 T$ multiplier).
- **Free**: Loose fit ($1.5 T$ multiplier) for easy assembly.

#### Internal Threads (Nuts)
- **Medium**: High-precision fit ($1.25 T$ multiplier).
- **Normal**: General engineering fit ($1.5 T$ multiplier).

### 6.2 Recommended Bolt-Nut Pairings
For reliable performance, the following pairings are recommended by machining standards:

| Application | Bolt Class | Nut Class |
| :--- | :--- | :--- |
| **High Precision** | Close | Medium |
| **General Purpose** | Medium | Normal |
| **Loose Fit** | Free | Normal |

### 6.3 Tolerance Limits vs. Nominal Sizes
The application displays the **Actual Tolerance Limits (Min - Max)** for all diameter (Major, Pitch, Minor) in the preview table.
- **External Threads (Bolts)**: Nominal values represent the maximum limits; the lower limit is calculated using the multipliers above.
- **Internal Threads (Nuts)**: Nominal values represent the minimum limits; the upper limit is calculated using the appropriate tolerance factors.

### 6.2 Small BSF Sizes
In official standards, the BSF series typically begins at **3/16"**. For sizes smaller than 3/16", BSW is the standard. However, this tool includes supplementary entries for 1/16", 3/32", 1/8", and 5/32" in the BSF selector for convenience; these entries use the BSW-equivalent TPI and calculations for historical compatibility.

## 7. References

1. **BS 84:2007**: Parallel screw threads of Whitworth form - Requirements. British Standards Institution.
2. **Machinery's Handbook** (Various Editions): Technical data for Whitworth thread forms and historical standard sizes.

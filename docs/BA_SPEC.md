# British Association (BA) Thread Specification

This document provides a technical reference for the British Association (BA) Standard Thread form, based on Machinery's Handbook and BS 93:1951.

## 1. Thread Form Geometry

The BA thread is a symmetrical V-thread with rounded crests and roots. It is primarily used for small screws (smaller than 1/4 inch).

- **Angle**: $47.5^\circ$ ($47^\circ 30'$)
- **Depth of V-thread ($H$)**: $1.13634 \times p$
- **Depth of BA thread ($h$)**: $0.60000 \times p$
- **Radius at root and crest ($r$)**: $0.18083 \times p$
- **Root and crest truncation ($s$)**: $0.26817 \times p$

## 2. Basic Dimensions (BS 93:1951)

All dimensions are in millimeters (mm).

| Designation | Pitch ($p$) | Depth ($h$) | Major Dia. | Effective Dia. | Minor Dia. | Radius ($r$) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **0 BA** | 1.0000 | 0.600 | 6.00 | 5.400 | 4.80 | 0.1808 |
| **1 BA** | 0.9000 | 0.540 | 5.30 | 4.760 | 4.22 | 0.1627 |
| **2 BA** | 0.8100 | 0.485 | 4.70 | 4.215 | 3.73 | 0.1465 |
| **3 BA** | 0.7300 | 0.440 | 4.10 | 3.660 | 3.22 | 0.1320 |
| **4 BA** | 0.6600 | 0.395 | 3.60 | 3.205 | 2.81 | 0.1193 |
| **5 BA** | 0.5900 | 0.355 | 3.20 | 2.845 | 2.49 | 0.1067 |
| **6 BA** | 0.5300 | 0.320 | 2.80 | 2.480 | 2.16 | 0.0958 |
| **7 BA** | 0.4800 | 0.290 | 2.50 | 2.210 | 1.92 | 0.0868 |
| **8 BA** | 0.4300 | 0.260 | 2.20 | 1.940 | 1.68 | 0.0778 |
| **9 BA** | 0.3900 | 0.235 | 1.90 | 1.665 | 1.43 | 0.0705 |
| **10 BA** | 0.3500 | 0.210 | 1.70 | 1.490 | 1.28 | 0.0633 |
| **11 BA** | 0.3100 | 0.185 | 1.50 | 1.315 | 1.13 | 0.0561 |
| **12 BA** | 0.2800 | 0.170 | 1.30 | 1.130 | 0.96 | 0.0506 |
| **13 BA** | 0.2500 | 0.150 | 1.20 | 1.050 | 0.90 | 0.0452 |
| **14 BA** | 0.2300 | 0.140 | 1.00 | 0.860 | 0.72 | 0.0416 |
| **15 BA** | 0.2100 | 0.125 | 0.90 | 0.775 | 0.65 | 0.0380 |
| **16 BA** | 0.1900 | 0.115 | 0.79 | 0.675 | 0.56 | 0.0344 |

## 3. Tolerance Formulas

Tolerances are in millimeters (mm). The symbol $p$ signifies pitch in millimeters.

| Class or Fit | Major Dia. | Effective Dia. | Minor Dia. |
| :--- | :--- | :--- | :--- |
| **Bolts (Close 0-10 BA)** | $0.15p$ | $0.08p + 0.02$ | $0.16p + 0.04$ |
| **Bolts (Normal 0-10 BA)** | $0.20p$ | $0.10p + 0.025$ | $0.20p + 0.05$ |
| **Bolts (Normal 11-16 BA)** | $0.25p$ | $0.10p + 0.025$ | $0.20p + 0.05$ |
| **Nuts (All Classes)** | ... | $0.12p + 0.03$ | $0.375p$ |

## 4. Implementation Notes

### 4.1 Tolerance Classes (BS 93)
The generator implements the standard BA fit grades:
- **Close (Bolts)**: Precision fit with no allowance ($0.15p$ Maj Tol). Available for 0-10 BA.
- **Normal (Bolts)**: General engineering fit with 0.025mm allowance for 0-10 BA.
- **Normal (Nuts)**: Corresponds to the "All Classes" nut definition in BS 93.

### 4.2 Allowances
As per BS 93:1951:
- **Normal Class Bolts (Sizes 0 to 10 BA)**: A constant allowance of **0.025 mm** is subtracted from the basic diameters (Major, Effective, Minor) to ensure a clearance fit even at maximum material conditions.
- **Close Class and 11-16 BA**: No allowance is provided; the maximum bolt size equals the basic size.

#### Tap Drill Selection
For BA threads, the generator recommends tapping drills based on an **Engineering Analysis** of thread engagement and material properties.

##### 1. Algorithmic Determination
The target drill size ($D_{drill}$) is calculated based on the desired **Percentage of Thread Engagement (PTE)**:

**Cut Taps:**
$$D_{drill} = Major\ Diameter - (1.2 \times p \times \frac{PTE}{100})$$

**Roll (Form) Taps:**
$$D_{drill} = Major\ Diameter - (0.5 \times p \times \frac{PTE}{100})$$

##### 2. Material-Specific Targets
The generator optimizes the $PTE$ based on the substrate material:
- **Hard Alloys**: **60% PTE**.
- **General Ferrous**: **70% PTE**.
- **Soft Non-Ferrous**: **80% PTE**.

For detailed formulas and the composition of our modeled drill sets (Metric and Number), see the **[Tapping Drill Specification](DRILL_SPEC.md)**.

#### Recommended Shop Drills (Reference)
| Size | Pitch (mm) | Target Decimal | Recommended Shop Drill |
| :--- | :--- | :--- | :--- |
| **0 BA** | 1.00 | 5.175 | 5.2 mm (Letter 6) |
| **2 BA** | 0.81 | 4.032 | 4.0 mm |
| **4 BA** | 0.66 | 3.055 | 3.1 mm (#31) |
| **6 BA** | 0.53 | 2.363 | 2.35 mm (#42) |
| **8 BA** | 0.43 | 1.845 | 1.85 mm (#49) |
| **10 BA** | 0.35 | 1.411 | 1.4 mm (#54) |
| **12 BA** | 0.28 | 1.069 | 1.05 mm (#58) |

# British Standard Pipe Parallel (BSPP) Thread Specification

This document provides a comprehensive analysis of the British Standard Pipe Parallel (BSPP) thread, formally designated as **G** within the **ISO 228** framework. It details the geometric definitions, mathematical derivations, and metrological requirements of the system.

## 1. Introduction

The BSPP thread is a parallel (cylindrical) thread used primarily as a mechanical fastener in hydraulic and pneumatic systems. Unlike tapered threads, it does not achieve a pressure-tight seal on the threads themselves; instead, sealing is performed by an external mechanism such as an O-ring or a bonded seal (Dowty washer).

### 1.1 The Whitworth Origin
The G series thread is derived from the original Whitworth form developed by Sir Joseph Whitworth in 1841. It shares the characteristic **55-degree** flank angle and fully rounded crests and roots, which reduce stress concentrations and improve fatigue life.

### 1.2 The "Iron Pipe Size" (IPS) Legacy
A nominal size designation (e.g., G 1/2) does not represent the physical major diameter. This is a historical artifact where the designation originally referred to the internal diameter of the pipe. As metallurgy improved, wall thicknesses decreased, but external diameters were frozen to maintain compatibility with existing fittings.

---

## 2. Primitive Geometry and Derivations

The geometry of the BSPP thread is derived from a "Fundamental Triangle" based on the pitch ($P$) and the 55° included angle.

### 2.1 The Fundamental Triangle
The fundamental height ($H$) of the sharp V-triangle is calculated as follows:
- Included Angle ($\alpha$): $55^\circ$
- Flank Angle ($\beta$): $27.5^\circ$

$$H = \frac{P}{2 \cdot \tan(27.5^\circ)}$$
$$\tan(27.5^\circ) \approx 0.520576$$
$$H \approx 0.960491 \cdot P$$

### 2.2 Working Height ($h$)
The Whitworth form truncates the Fundamental Triangle by $1/6H$ at the crest and $1/6H$ at the root.
- Total truncation: $H/3$
- Working height $h$: $H - H/3 = 2/3 \cdot H$

$$h = 2/3 \cdot (0.960491 \cdot P)$$
$$h \approx 0.640327 \cdot P$$

### 2.3 Radius of Curvature ($r$)
The radius at the crest and root must be tangent to the 27.5° flanks.
$$r = 0.137329 \cdot P$$

---

## 3. Fundamental Formulas for Diameter Calculation

These formulas define the "Basic" condition (Zero Line) before tolerances are applied.

| Parameter | Formula | Constant Multiplier |
| :--- | :--- | :--- |
| **Basic Major Diameter ($D, d$)** | $Nominal\ Value$ | — |
| **Basic Pitch Diameter ($D_2, d_2$)** | $d - h$ | $d - (0.640327 \cdot P)$ |
| **Basic Minor Diameter ($D_1, d_1$)** | $d - 2h$ | $d - (1.280654 \cdot P)$ |

---

## 4. Threads Per Inch (TPI) and Pitch Groups

BSPP threads use imperial pitches (TPI). To calculate metric dimensions:
$$P_{mm} = \frac{25.4}{\text{TPI}}$$

### Table 1: Pitch Groups in ISO 228
| Group | TPI | Typical Sizes | Pitch ($P$) [mm] | Height ($h$) [mm] |
| :--- | :--- | :--- | :--- | :--- |
| **Fine** | 28 | G 1/16, G 1/8 | 0.907 | 0.581 |
| **Small** | 19 | G 1/4, G 3/8 | 1.337 | 0.856 |
| **Medium** | 14 | G 1/2 - G 7/8 | 1.814 | 1.162 |
| **Large** | 11 | G 1 - G 6 | 2.309 | 1.479 |

---

## 5. ISO 228-1 Tolerance System

The system uses a "Zero Line" logic to ensure interchangeability.

### 5.1 Fundamentals
- **Internal Threads (Nut)**: Tolerance zone is **positive** ($+TD$); the basic size is the minimum limit.
- **External Threads (Bolt)**: Tolerance zone is **negative** ($-Td$); the basic size is the maximum limit.

### 5.2 External Classes (A vs B)
- **Class A**: Tighter tolerance for precision applications.
- **Class B**: Commercial tolerance, effectively double Class A ($Td_B \approx 2 \cdot Td_A$).

---

## 6. Metrology: Three-Wire Method

For 55-degree Whitworth threads, the standard 60-degree constants do not apply. The measurement over wires ($M$) is calculated as:

$$M = D_2 + 3.1657 \cdot W - 0.9605 \cdot P$$

Where:
- $M$: Measurement over wires.
- $D_2$: Basic Pitch Diameter.
- $W$: Wire Diameter.
- $P$: Pitch.

---

## Appendix A: Standard G-Series Reference Data

| Size | TPI | Major Dia (D) [mm] | Pitch Dia (D2) [mm] | Minor Dia (D1) [mm] |
| :--- | :--- | :--- | :--- | :--- |
| G 1/16 | 28 | 7.723 | 7.142 | 6.561 |
| G 1/8 | 28 | 9.728 | 9.147 | 8.566 |
| G 1/4 | 19 | 13.157 | 12.301 | 11.445 |
| G 3/8 | 19 | 16.662 | 15.806 | 14.950 |
| G 1/2 | 14 | 20.955 | 19.793 | 18.631 |
| G 3/4 | 14 | 26.441 | 25.279 | 24.117 |
| G 1 | 11 | 33.249 | 31.770 | 30.291 |
| G 1 1/4 | 11 | 41.910 | 40.431 | 38.952 |
| G 1 1/2 | 11 | 47.803 | 46.324 | 44.845 |
| G 2 | 11 | 59.614 | 58.135 | 56.656 |

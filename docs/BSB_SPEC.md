# British Standard Brass (BSB) Thread Specification

This document provides a technical reference for the **British Standard Brass (BSB)** thread series, also known as the **26 TPI Brass Thread**. It details the geometry, mathematical derivation, and metrological distinctions of the standard based on the 55° Whitworth form and **BS 84:1956**.

---

## 1. Introduction: The Constant Pitch Standard

The British Standard Brass (BSB) series is a specialized constant-pitch thread system. Unlike standard fasteners (BSW/BSF) where the pitch coarsens as the diameter increases, BSB maintains a fixed pitch of **26 threads per inch (TPI)** across all nominal diameters.

### 1.1 Engineering Necessity
This standard was developed primarily for drawn brass tubing used in gas lighting, pneumatic controls, and optical instrumentation. Because brass tubing typically has a consistent, thin wall regardless of diameter, a standard coarse thread would cut too deep into larger tubes, compromising their structural integrity. By locking the pitch at 26 TPI, the thread depth remains constant (approx. 0.0246"), ensuring safe wall thickness for all fittings.

---

## 2. Primitive Geometry: The Whitworth Thread Form

The BSB thread utilizes the **Whitworth Thread Form**, defined by three primitive constraints:
1.  **Flank Angle**: $55^\circ$ included angle.
2.  **Fundamental Triangle**: The theoretical sharp V-profile.
3.  **Radius of Curvature**: Rounded crests and roots.

### 2.1 The Fundamental Triangle ($H$)
The calculation begins with the Fundamental Triangle, an isosceles triangle where the apex angle is $55^\circ$ and the base is the pitch ($P$).

To derive the Fundamental Height ($H$), we bisect the $55^\circ$ triangle:
$$\tan(27.5^\circ) = \frac{P/2}{H}$$
$$H = \frac{P}{2 \cdot \tan(27.5^\circ)} \approx 0.960491 \cdot P$$

### 2.2 Truncation and Actual Depth ($h$)
The Whitworth standard truncates the top and bottom $1/6$ of the fundamental triangle to avoid sharp points and stress raisers.
$$\text{Total Reduction} = \frac{1}{6}H + \frac{1}{6}H = \frac{1}{3}H$$
The **Actual Depth ($h$)** is the remaining $2/3$ of the height:
$$h = H - \frac{1}{3}H = \frac{2}{3}H$$
$$h = \frac{2}{3} \cdot (0.960491 \cdot P) \approx 0.640327 \cdot P$$

### 2.3 Radius of Curvature ($r$)
The crests and roots are rounded with a circular arc tangential to the $55^\circ$ flanks at the point of truncation.
$$r = \frac{H}{6} \cdot \frac{\sin(27.5^\circ)}{1 - \sin(27.5^\circ)} \approx 0.137329 \cdot P$$

---

## 3. Deriving BSB Thread Definitions (26 TPI)

For all BSB threads, the pitch ($P$) is derived from the constant 26 TPI:
$$P = \frac{1}{26} \approx 0.0384615 \text{ inches} (0.9769 \text{ mm})$$

### 3.1 Constant Dimensions
Because the pitch is constant, the depth and radius are also constant for every BSB size:
- **Depth ($h$)**: $0.640327 \times 0.03846 = 0.024628 \text{ in}$
- **Radius ($r$)**: $0.137329 \times 0.03846 = 0.005282 \text{ in}$

### 3.2 Diameter Relationships
1.  **Major Diameter ($D$)**: The nominal reference size.
2.  **Effective (Pitch) Diameter ($D_2$)**: $D - h$
3.  **Minor (Core) Diameter ($D_1$)**: $D - 2h = D - 0.049256 \text{ in}$

---

## 4. Derived Reference Values (26 TPI)

| Nominal Size | Major Dia ($D$) | Pitch ($P$) | Depth ($h$) | Effective Dia ($D_2$) | Minor Dia ($D_1$) | Tapping Drill (Approx) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1/8"** | 0.1250 | 0.0385 | 0.0246 | 0.1004 | 0.0757 | #47 (0.0785") |
| **1/4"** | 0.2500 | 0.0385 | 0.0246 | 0.2254 | 0.2007 | #6 (0.2040") |
| **3/8"** | 0.3750 | 0.0385 | 0.0246 | 0.3504 | 0.3257 | Q (0.3320") |
| **1/2"** | 0.5000 | 0.0385 | 0.0246 | 0.4754 | 0.4507 | 29/64" (0.4531") |
| **5/8"** | 0.6250 | 0.0385 | 0.0246 | 0.6004 | 0.5757 | 37/64" (0.5781") |
| **3/4"** | 0.7500 | 0.0385 | 0.0246 | 0.7254 | 0.7007 | 45/64" (0.7031") |
| **7/8"** | 0.8750 | 0.0385 | 0.0246 | 0.8504 | 0.8257 | 53/64" (0.8281") |
| **1"** | 1.0000 | 0.0385 | 0.0246 | 0.9754 | 0.9507 | 61/64" (0.9531") |

---

## 5. Specification of Tolerances: BS 84 Standard

BSB threads are classified under the "Selected Thread Series" of **BS 84**. Tolerances are calculated using a three-part formula accounting for diameter, length of engagement, and pitch.

### 5.1 Tolerance Formula (Medium Class)
The tolerance on the Effective Diameter ($T_E$) in inches is:
$$T_E = 0.002\sqrt{D} + 0.003\sqrt{L_e} + 0.005\sqrt{P}$$
Where:
- $D$ = Major Diameter
- $L_e$ = Length of Engagement (typically assumed $L_e = D$)
- $P$ = Pitch ($1/26$)

**Note on Constant Pitch**: While the pitch term remains constant ($0.00098"$), the diameter term causes the tolerance to grow as the fitting size increases.

---

## 6. Comparative Metrology

It is critical to distinguish BSB from other 26 TPI standards to avoid structural failure.

| Standard | Thread Angle | Form | Typical Application |
| :--- | :--- | :--- | :--- |
| **BSB** | $55^\circ$ | Whitworth (Rounded) | Brass fluid fittings, thin-walled tubing |
| **BSC (Cycle)** | $60^\circ$ | Cycle Engineer (Rounded) | Bicycles, Motorcycles |
| **UNS (Unified)** | $60^\circ$ | Unified (Flat/Optional Radius) | American machine components |

> [!CAUTION]
> A BSC ($60^\circ$) nut may screw onto a BSB ($55^\circ$) bolt due to the matching 26 TPI pitch, but it will result in "point contact" only, leading to rapid stripping or failure under pressure.

---

## 7. References
1. **BS 84:1956/2007**: Parallel Screw Threads of Whitworth Form.
2. **Machinery's Handbook**: Technical Reference for British Thread Systems.
3. *A Comprehensive Treatise on the British Standard Brass (BSB) Thread Specification: Geometry, Derivation, and Metrology*.

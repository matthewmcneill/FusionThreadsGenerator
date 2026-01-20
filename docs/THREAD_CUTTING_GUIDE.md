# Manual Lathe Threading: Technical Guide

## 1. Introduction: The Deterministic Nature of Screw Cutting

The generation of screw threads on a manual engine lathe—specifically single-point screw cutting—is a process where the machine tool’s carriage is synchronized with the spindle rotation via a lead screw and change gears. This creates a helix with theoretically infinite variability in pitch and diameter. However, this geometric freedom places the burden of process control on the machinist. Beyond setting the correct kinematic ratio, the operator must dictate the physics of chip formation by selecting an appropriate infeed methodology.

The choice of infeed strategy dictates the geometry of the shear plane, the magnitude and direction of cutting forces, the thermal gradient at the tool tip, and the resultant surface integrity of the thread.

## 2. The British Standard Whitworth (BSW): Geometric Context

The BSW profile, established in 1841, presents unique machining challenges compared to modern 60° Unified (UN) or Metric (ISO) threads.

### 2.1 The 55-Degree Included Angle
The most distinguishing feature is the 55° included angle. While seemingly close to 60°, this difference fundamentally alters the trigonometry:
- **Comparison**: A 60° thread forms an equilateral triangle; a 55° thread forms an isosceles triangle that is deeper relative to its width.
- **Machining Implication**: Standard 29.5° compound settings used for 60° threads are non-viable for BSW. Using 29.5° on a 55° thread causes the tool to dig into the trailing flank, leading to interference and potential tool failure.

### 2.2 Radiused Root and Crest
Unlike the flat truncations of ISO threads, BSW requires circular arcs at the roots and crests.
- **Radius ($r$)**: Approximately $0.137329 \times P$ (Pitch).
- **Tooling**: A standard "sharp V" tool cannot be used; it must be ground with a specific nose radius. This radius creates a "stagnation point" where metal is plowed rather than sheared, increasing radial forces.

### 2.3 Depth-to-Pitch Relationship
BSW threads are deeper relative to their pitch:
- **ISO Metric Depth**: $\approx 0.6134 \times P$.
- **BSW Depth ($h$)**: $0.640327 \times P$.

## 3. Theoretical Mechanics of Thread Cutting

Threading is essentially a forming operation performed by a cutting tool buried on three sides (two flanks and the nose).

### 3.1 Chip Formation and Crowding
In **plunge cutting**, metal is sheared from both flanks simultaneously. These two material streams collide at the center of the tool radius, causing "chip crowding" or "V-chip compression." This collision converts kinetic energy into intense heat and potential energy within the compressed metal, often leading to torn threads.

### 3.2 The Stagnation Zone
At the radiused tip, the cutting speed approaches zero. This "stagnation zone" involves plowing rather than shearing. In plunge cutting, this area is under maximum pressure, causing rapid heat buildup and localized work hardening. **Compound cutting** avoids this by ensuring chip flow is primarily uni-directional from the leading flank.

### 3.3 Force Vectors
- **Tangential Force ($F_c$)**: Acts downward on the tool.
- **Axial Force ($F_f$)**: Resists carriage feed.
- **Radial Force ($F_r$)**: Pushes the tool away from the work.
Plunge cutting maximizes $F_r$, increasing the risk of deflection and chatter.

## 4. Infeed Strategy A: Orthogonal Plunge (Cross-Slide Method)

### Mechanics
The operator advances the tool strictly along the X-axis (perpendicular to the spindle). The tool cuts on both the leading and trailing flanks simultaneously.

- **Advantages**:
  - **Simplicity**: No complex setup or trigonometric calculations.
  - **Symmetrical Wear**: Engages both sides of the tool equally.
  - **Root Accuracy**: Ensures the radiused root is formed symmetrically.
- **Disadvantages**:
  - **High Forces**: Maximum engagement leads to high cutting resistance.
  - **Poor Finish (Tear-Out)**: "Chip crowding" often causes material to tear rather than shear.
  - **Heat**: Tip is buried with poor dissipation paths.
- **BSW Suitability**: Only recommended for fine pitches (> 32 TPI). The deep 55° profile makes chip crowding severe on coarse threads.

## 5. Infeed Strategy B: Angular Compound (Flank Cutting)

The compound rest is swiveled to an angle slightly less than the half-angle, directing the tool along a vector parallel to one flank.

### 5.1 BSW Trigonometry
For BSW, the half-angle is $27.5^\circ$.
- **Setting**: The compound should be set to **26.5° or 27.0°** to provide 0.5°–1.0° of clearance for the trailing edge.
- **The Protractor Trap**: 
  - **Standard (Zero-Normal)**: Set dial to **27°**.
  - **Zero-Axial (90° Scale)**: Set dial to $90 - 27 = \mathbf{63^\circ}$.

### 5.2 Advantages
- **Reduced Forces**: Engaged cutting length is halved.
- **Superior Finish**: Chips curl freely away from the leading edge, eliminating crowding.
- **Tool Life**: Reduced heat preserves the nose radius.

## 6. The "European Method": 90-Degree Step-Over

A hybrid solution used when changing the compound angle is difficult. The compound is kept at 90° (parallel to the spindle).

### 6.1 Methodology
1. **Radial Infeed**: Apply primary depth with the Cross-Slide.
2. **Step-Over**: Before each pass, advance the Compound Slide slightly towards the chuck (negative Z).
3. **Rule of Thumb**: Advance compound by 50% of the cross-slide infeed.
   - Example: 0.010" cross-slide + 0.005" compound step-over results in an effective infeed angle of $\tan^{-1}(0.5) \approx \mathbf{26.6^\circ}$ (Ideal for BSW).

## 7. Recommended Compound Angles (Summary)

To account for precision limits, this tool uses a **Clearance-Floor Algorithm** to snap to 0.5° increments. This is implemented in [externalThreadGeometry.js](../src/utils/externalThreadGeometry.js).

**The Algorithm**:
$$\theta_{compound} = \frac{\lfloor(\frac{\theta_{included}}{2} - 0.5) \times 2\rfloor}{2}$$

| Thread Form | Included Angle | Theoretical Half-Angle | Recommended Dial Setting |
| :--- | :--- | :--- | :--- |
| **60° (Metric)** | $60^\circ$ | $30^\circ$ | **29.5°** |
| **55° (Whitworth)** | $55^\circ$ | $27.5^\circ$ | **27.0°** |
| **47.5° (BA)** | $47.5^\circ$ | $23.75^\circ$ | **23.0°** |

## 8. Infeed Calculations

When using the angular infeed method, the dial on the compound slide does not represent the direct radial depth (the reduction in radius). Instead, it represents the distance moved along the hypotenuse. The application automates these calculations during thread data generation.

### Formulas
- **Radial Depth ($d$)**: The total depth from crest to root, measured perpendicular to the axis.
- **Compound Infeed ($i$)**: The dial reading on the compound slide.
- **Calculation**:
  $$i = \frac{d}{\cos(\theta)}$$
  *Where $\theta$ is the Compound Angle chosen.*

### Detailed Case Study: 1/2-12 BSW
- **TPI**: 12 ($P = 0.08333"$)
- **Depth ($h$)**: $0.6403 \times 0.08333 = \mathbf{0.0534"}$
- **Minor Diameter**: $0.500 - (2 \times 0.0534) = \mathbf{0.3932"}$ (Matches BSW spec 0.3933")
- **Compound Travel ($T$) at 27°**: $0.0534 / \cos(27^\circ) = \mathbf{0.0600"}$

## 9. Blank Diameter Preparation

Before cutting an external thread, the workpiece should be turned to a "Nominal Turn Diameter." 

**Why not use the Major Diameter?**
Turning the stock to the exact theoretical major diameter often results in "burring" or "cresting" as the tool displaces metal upward. It is standard practice to turn the blank slightly undersize.

**Rule of Thumb**:
$$\text{Blank Diameter} \approx \text{Major Diameter} - (0.1 \times \text{Pitch})$$

## 10. Advanced Strategies

### 9.1 The "Spring Pass" (Hybrid Finish)
Due to machine deflection ($F_r$), a purely calculated compound depth often leaves the thread oversized.
1. Feed with the compound until ~90% of depth is reached.
2. Apply the final 0.001"–0.002" using the **Cross-Slide (Plunge)**.
3. This "Hybrid Finish" removes any "steps" on the trailing flank and ensures a perfectly symmetrical root.

## 10. Troubleshooting

| Symptom | Probable Cause | Resolution |
| :--- | :--- | :--- |
| **Tear-Out on Flanks** | Chip crowding or lack of rake | Switch to Compound Infeed (27°); grind positive rake. |
| **Leaning Thread** | Incorrect tool alignment or angle | Use 55° center gauge; check compound setting (not 29.5°). |
| **Broken Tool Tips** | Excessive infeed or "sandwiching" | Reduce infeed increments (e.g., 0.001" finish); use compound. |
| **Chatter** | Wide contact area / lack of rigidity | Reduce RPM; use sulfurized cutting oil; switch to flank infeed. |

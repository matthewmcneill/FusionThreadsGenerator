# Tapping Drill Specification

This document details the logic, formulas, and toolsets used by the Fusion 360 Thread Generator to provide "Smart Drill" recommendations.

## 1. Overview

The generator uses a two-phase **"Scout & Score"** system to recommend drill bits:

1.  **Scout (Find Tool)**: The algorithm "looks" for the best tool by targeting the **Median** of the official thread specification (the midpoint between Nut Minor Min and Max).
2.  **Score (Evaluate Fit)**: Once a tool is selected, it is "scored" based on its actual **Engagement Percentage** to provide meaningful UI feedback (Optimal, Warning, Danger).

---

## 2. Calculation Philosophy

Unlike simple calculators that rely on a single engagement percentage (like 75%), this generator prioritizes **Technical Compliance**.

### 2.1 Scouting Target (Spec-Median)
The target diameter used to search the drill pool is always the midpoint of the official engineering tolerance:
$$Target = \frac{Nut\ Minor\ Min + Nut\ Minor\ Max}{2}$$
This ensures that the "Nearest" search always points the algorithm toward the safest part of the specification.

### 2.2 Scoring Metric (Engagement %)
The actual tool performance is scored using the thread engagement formula:
$$Eng \% = \frac{Major Diameter - Drill Size}{Major Diameter - Basic Minor Diameter} \times 100$$
Where the **Basic Minor Diameter** is the theoretical 100% engagement point (the root of the bolt thread).

---

## 3. Drill Set Modeling

The generator accurately models four standard machinist drill sets. Unlike simple calculators that allow any decimal value, this generator only recommends tools you can actually buy.

### 3.1 Metric Drills (Standard Engineers' Set)
Modeled after a professional "Engineers' Store" set with high-precision increments in the tapping range:
- **0.10mm – 3.00mm**: 0.05mm increments (Critical for BA/Miniature).
- **3.10mm – 13.00mm**: 0.10mm increments.
- **13.50mm – 20.00mm**: 0.50mm increments.

### 3.2 Imperial Fractional (Standard Shop Set)
Modeled after standard Morse taper and jobber sets with variable increments for larger diameters:
- **1/64" – 1-3/4"**: 1/64" increments.
- **1-3/4" – 2-1/4"**: 1/32" increments.
- **2-1/4" – 3"**: 1/16" increments.
- **3" – 6"**: 1/8" increments.

### 3.3 Number Drills (#80 to #1)
The wire-gauge series (0.0135" to 0.2280") essential for BA and small imperial threads.

### 3.4 Letter Drills (A to Z)
The standard letter series (0.234" to 0.413") bridging the gap between fractional sizes.

---

## 4. Safety Guard Rails

To prevent part damage and tool breakage, the generator validates the selected drill size against the thread's physical limits.

### 4.1 Validation Levels

| Status | Condition | UI Indication | XML Behavior |
| :--- | :--- | :--- | :--- |
| **Optimal Fit** | Within Spec (Nut Minor Min/Max) | **Green** | Exported |
| **Tight Fit** | 82% – 90% Engagement | **Amber** | Exported |
| **Loose Fit** | Outside Spec but > 50% Engagement | **Amber** | Exported |
| **Tap Breakage Risk** | > 90% Engagement | **Red** | Exported (with warning) |
| **Stripping Risk** | < 50% Engagement | **Red** | Exported (with warning) |
| **Tap Breakage Certain**| **Drill $\le$ Basic Minor** (>100% Eng.) | **Red Bold** | **OMITTED** |
| **No Thread Remaining** | **Drill $\ge$ Basic Major** (<0% Eng.) | **Red Bold** | **OMITTED** |

---

## 5. "Smart Selection" Algorithm

The `getNearestDrill` utility (defined in `src/utils/drills.js`) handles the matching logic:

### 5.1 Selection Logic
1.  **Unit Conversion**: All target diameters are normalized to inches for comparison.
2.  **Pool Filtering**: Only drill sets selected by the user in the UI are considered.
3.  **Absolute Difference**: The algorithm calculates the absolute distance to the **Spec-Median Target**.
4.  **Priority Tie-Breaking**: If two drills (e.g., Metric and Fractional) are effectively equal, the system prioritizes "Native" sets in the order: **Fractional > Letter > Number > Metric**.

### 5.2 Precision
To ensure absolute accuracy across tools, the generator implements:
- **Jitter Handling**: Uses a small epsilon ($1 \times 10^{-10}$) to handle floating-point noise.
- **Drift Prevention**: Metric sizes are generated using integer iterators to avoid decimal accumulation errors.

---

## 6. Implementation Notes

- **Real-time Updates**: Changing your "Drill Bit Sets" in the UI triggers a recalculation of all recommended drills in the Data Preview.
- **Optional Recommendations**: If no drill sets are selected in the UI, the generator will **not** show any tool recommendations and will **omit** the `<TapDrill>` attribute from the XML.
- **XML Value**: The generated XML always exports the **physical tool diameter**, ensuring Fusion 360 models match available workshop tooling.
- **Priority Logic**: Imperial threads default to checking Number, Letter, and Fractional sets first to maintain a traditional workflow.

---

# Appendix: Drill Set Tables

This appendix lists all drill sizes modeled in the system's tool library.

## A.1 Number Drills (#80 to #1)

| Name | Size (in) | Name | Size (in) | Name | Size (in) | Name | Size (in) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| #80 | 0.0135 | #79 | 0.0145 | #78 | 0.0160 | #77 | 0.0180 |
| #76 | 0.0200 | #75 | 0.0210 | #74 | 0.0225 | #73 | 0.0240 |
| #72 | 0.0250 | #71 | 0.0260 | #70 | 0.0280 | #69 | 0.0292 |
| #68 | 0.0310 | #67 | 0.0320 | #66 | 0.0330 | #65 | 0.0350 |
| #64 | 0.0360 | #63 | 0.0370 | #62 | 0.0380 | #61 | 0.0390 |
| #60 | 0.0400 | #59 | 0.0410 | #58 | 0.0420 | #57 | 0.0430 |
| #56 | 0.0465 | #55 | 0.0520 | #54 | 0.0550 | #53 | 0.0595 |
| #52 | 0.0635 | #51 | 0.0670 | #50 | 0.0700 | #49 | 0.0730 |
| #48 | 0.0760 | #47 | 0.0785 | #46 | 0.0810 | #45 | 0.0820 |
| #44 | 0.0860 | #43 | 0.0890 | #42 | 0.0935 | #41 | 0.0960 |
| #40 | 0.0980 | #39 | 0.0995 | #38 | 0.1015 | #37 | 0.1040 |
| #36 | 0.1065 | #35 | 0.1100 | #34 | 0.1110 | #33 | 0.1130 |
| #32 | 0.1160 | #31 | 0.1200 | #30 | 0.1285 | #29 | 0.1360 |
| #28 | 0.1405 | #27 | 0.1440 | #26 | 0.1470 | #25 | 0.1495 |
| #24 | 0.1520 | #23 | 0.1540 | #22 | 0.1570 | #21 | 0.1590 |
| #20 | 0.1610 | #19 | 0.1660 | #18 | 0.1695 | #17 | 0.1730 |
| #16 | 0.1770 | #15 | 0.1800 | #14 | 0.1820 | #13 | 0.1850 |
| #12 | 0.1890 | #11 | 0.1910 | #10 | 0.1935 | #9 | 0.1960 |
| #8 | 0.1990 | #7 | 0.2010 | #6 | 0.2040 | #5 | 0.2055 |
| #4 | 0.2090 | #3 | 0.2130 | #2 | 0.2210 | #1 | 0.2280 |

## A.2 Letter Drills (A to Z)

| Name | Size (in) | Name | Size (in) | Name | Size (in) | Name | Size (in) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| A | 0.234 | B | 0.238 | C | 0.242 | D | 0.246 |
| E | 0.250 | F | 0.257 | G | 0.261 | H | 0.266 |
| I | 0.272 | J | 0.277 | K | 0.281 | L | 0.290 |
| M | 0.295 | N | 0.302 | O | 0.316 | P | 0.323 |
| Q | 0.332 | R | 0.339 | S | 0.348 | T | 0.358 |
| U | 0.368 | V | 0.377 | W | 0.386 | X | 0.397 |
| Y | 0.404 | Z | 0.413 | | | | |

## A.3 Metric Drills (Key Sizes)

*Note: The generator includes a complete hobbyist/engineering set from 0.10mm to 20.00mm.*

| Range | Incerment | Example Sizes |
| :--- | :--- | :--- |
| **0.10 - 3.00mm** | 0.05mm | 0.10, 0.15 ... 2.95, 3.00mm |
| **3.10 - 13.00mm** | 0.10mm | 3.1, 3.2 ... 12.9, 13.0mm |
| **13.50 - 20.00mm** | 0.50mm | 13.5, 14.0 ... 19.5, 20.0mm |

## A.4 Fractional Drills (Summary)

*Note: The generator models a professional shop set (1/64" to 6").*

| Range | Increment |
| :--- | :--- |
| **1/64" to 1-3/4"** | 1/64" |
| **1-3/4" to 2-1/4"** | 1/32" |
| **2-1/4" to 3"** | 1/16" |
| **3" to 6"** | 1/8" |

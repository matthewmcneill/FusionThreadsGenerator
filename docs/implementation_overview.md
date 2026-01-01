# FusionThreadsGenerator Implementation Overview

## Project Architecture
FusionThreadsGenerator is a React-based web application designed to generate Fusion 360-compatible XML thread definitions for British Association (BA), Whitworth (BSW/BSF), and Model Engineer (ME) thread standards.

The application follows a modular, metadata-driven architecture to align with Fusion 360's internal terminology.

### 1. UI Layer (`src/App.jsx` and `src/components/`)
- **App.jsx**: Orchestrates a **3-Stage Workflow** (Select → Refine → Export). It dynamically renders series and class toggles based on standard metadata.
- **ThreadForm.jsx**: Handles user input for custom thread sizes, adapted based on whether the active standard uses TPI (Imperial) or Pitch (Metric).
- **ThreadList.jsx**: Renders a table of defined threads, including technical parameters and the generated CTD (Custom Thread Designation).

### 2. Logic Layer (`src/utils/calculators/`)
Each module defines a `Standard` configuration object containing `series` (Designations) and `classes` (Tolerances).
- **whitworth.js**: Implements 55° Whitworth threads. Series: `BSW`, `BSF`. Classes: `Close`, `Medium`, `Free`.
- **ba.js**: Implements 47.5° BA threads. Series: `BA`. Classes: `Close`, `Normal`.
- **me.js**: Implements 55° constant-pitch threads. Series: `Fine (40 TPI)`, `Medium (32 TPI)`, `BSB (26 TPI)`. Class: `Medium`.
- **index.js**: Unified export point for thread calculators.

### 3. XML Generation Layer (`src/utils/xmlGenerator.js`)
- Transforms internal thread objects into the Fusion 360 XML schema.
- Specifically maps **Pitch/TPI**, **Gender-specific dimensions**, and **ThreadToleranceClass** to ensure seamless CAD integration.

## Component Interactions (Stage-Based Workflow)
1. **Stage 1 (Select Thread Type)**: User chooses a standard. `App.jsx` initializes default presets and active series/classes from metadata.
2. **Stage 2 (Refine Designation & Class)**: User toggles series inclusion and adds/removes sizes. The UI dynamically shows toggles only when multiple options exist.
3. **Stage 3 (Launch Export)**: User launches the download. `xmlGenerator.js` processes the active dataset into the final file buffer.

## Key Technical Concepts
- **CTD Generation**: The app automatically formats "Custom Thread Designations" (e.g., `1/4 - 20 BSW`) to match Fusion 360's internal lookup logic.
- **Dynamic Terminology**: The UI uses "Designation (Series)" and "Class (Tolerance)" to remain consistent with Fusion 360's interface.
- **Metadata-Driven Filtering**: Standards define their own series and classes, and the UI adapts automatically without hardcoded standard-specific logic.

## Extending the Generator: Adding New Thread Standards

This application is designed to be extensible. Adding a new thread standard (e.g., Unified National, Metric Fine) involves three primary steps: creating a calculator module, exporting it, and integrating it into the core UI.

### 1. The Thread Module Architecture

Each standard must reside in its own file under `src/utils/calculators/` and export three core elements:

#### A. Metadata Configuration (`Standard` object)
This object defines how the standard is identified and what options are available in the UI.
```javascript
export const MyStandard = {
    name: 'My Standard',    // Display name
    unit: 'in',             // 'in' or 'mm'
    angle: 60,              // Thread angle
    sortOrder: 5,           // Order in dropdown
    threadForm: 6,          // Fusion 360 Form ID (e.g., 6 for UN, 8 for Whitworth)
    series: ['Series A', 'Series B'], // List of designations
    classes: ['Class 1', 'Class 2'],   // Available tolerance classes
    defaultDrillSets: ['Metric'],     // Initial drill set selection
    docUrl: '...',          // Base documentation URL
    seriesAnchor: '#...',   // Anchor for Series info link
    classAnchor: '#...'     // Anchor for Class info link
};
```

#### B. Default Size Presets
An array of objects representing the standard sizes to be loaded by default.
```javascript
export const MY_SIZES = [
    { designation: '1/4 My', size: '0.25', tpi: 20, series: 'Series A' },
    ...
];
```

#### C. The Calculator Function
A function that takes a size and returns the full geometry and tolerance data. It must return an object containing a `basic` geometry block and a `classes` block mapped to the standard's available classes.

### 2. Data Mapping & Schema

To ensure compatibility with the XML generator, your calculation function must return data in this specific shape:

```javascript
{
  basic: { p, h, D, eff, min }, // p=pitch, D=Maj, eff=Pitch Dia, min=Minor
  classes: {
    'Medium': { // Must match a name in your Standard.classes array
      external: { major: 0.25, pitch: 0.21, minor: 0.18 },
      internal: { 
        major: 0.25, pitch: 0.22, minor: 0.19,
        tapDrillToolSize: '5.2mm', // Recommended drill name
        tapDrillDecimal: 5.2,      // Actual drill diameter
        // ... include result of validateTapDrill function
      }
    }
  }
}
```

### 3. Tapping Drill Integration & Logic Flow

Selection of the optimal tapping drill is a two-stage process coordinated between the thread calculator and the `src/utils/drills.js` utility.

#### A. Targeted Selection (`getNearestDrill`)
The calculator first determines a **theoretical target diameter** based on the Tapping Drill Specification (typically aiming for 70% engagement for general use). It then calls:
```javascript
const drill = getNearestDrill(targetDecimal, units, allowedSets);
```
- **Inputs**: Calculated target (decimal), unit system (`in`/`mm`), and the user-selected drill sets (Metric, Number, etc.).
- **Process**: The module searches across all active sets and returns the drill with the minimum absolute distance to the target.

#### B. Engineering Validation (`validateTapDrill`)
Once a physical tool is selected, it must be validated against the specific thread geometry to ensure safety. The calculator calls:
```javascript
const validation = validateTapDrill(drillSize, major, minor, nutMinorMax, material);
```
- **Safety Guard Rails**: This function calculates the actual **Percentage of Thread Engagement (PTE)** and checks it against critical thresholds:
    - **Catastrophic-Small**: Drill is smaller than theoretical minor diameter (100% engagement) -> Tap will break.
    - **Catastrophic-Large**: Drill is larger than major diameter -> No threads will be formed.
    - **Catastrophic-Weak**: Engagement is below 25% -> Structurally unsound.
    - **Material Optimization**: Assesses if the fit is "Optimal", "Tight", or "Loose" based on the selected material (Hard, Ferrous, Soft).

### 4. Step-by-Step Integration Guide

1.  **Create Calculator**: Create `src/utils/calculators/my_standard.js` following the architecture above. Use `whitworth.js` or `ba.js` as a template for tolerance and engagement formulas.
2.  **Export Module**: Add `export * from './my_standard';` to `src/utils/calculators/index.js`.
3.  **App.jsx Integration**:
    *   **Dropdown**: Add an `<option>` for your standard in the `handleStandardChange` dropdown (Stage 1).
    *   **Standard Mapping**: Update the logic in `handleStandardChange` to map your dropdown value to your exported `Standard` object.
    *   **Default Loading**: Update `loadStandardDefaults` to return your `MY_SIZES` array when your standard is active.
    *   **Calculator Routing**: Update the `if/else` blocks in `calculateThreadItem` and the main `useEffect` to call your new calculation function.
    *   **CTD Formatting**: If your standard requires a specific "Custom Thread Designation" string format for Fusion 360, add a case to the `ctd` generation logic in `calculateThreadItem`.
4.  **Verification**: Run the app locally, select your new standard, verify the preview table values, and check the generated XML file in a text editor to ensure it follows the `<ThreadType>` schema.

---
*Last Updated: 2026-01-01*

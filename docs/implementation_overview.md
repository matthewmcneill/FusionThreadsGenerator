# FusionThreadsGenerator Implementation Overview

## Project Architecture
FusionThreadsGenerator is a React-based web application designed to generate Fusion 360-compatible XML thread definitions for British Association (BA) and Whitworth (BSW/BSF) thread standards.

The application follows a modular architecture:

### 1. UI Layer (`src/App.jsx` and `src/components/`)
- **App.jsx**: Orchestrates the application state using a **3-Stage Workflow** (Select → Refine → Export). It manages standards, thread lists, and the launch of the XML download.
- **ThreadForm.jsx**: Handles user input for custom thread sizes, adapted based on the active standard.
- **ThreadList.jsx**: Renders a table of currently defined threads, including technical parameters and the generated CTD (Custom Thread Designation).

### 2. Logic Layer (`src/utils/calculators/`)
- **whitworth.js**: Implements geometry and tolerance formulas for 55° Whitworth threads (Ref: BS 84:2007). Includes a fraction parser for imperial sizes.
- **ba.js**: Implements 47.5° BA geometry using a lookup table for standard sizes 0-16 and calculating fit-specific tolerances.
- **index.js**: Unified export point for thread calculators.

### 3. XML Generation Layer (`src/utils/xmlGenerator.js`)
- Transforms internal thread objects into the Fusion 360 XML schema.
- Specifically maps **Pitch/TPI**, **Gender-specific dimensions**, and **ThreadToleranceClass** to ensure seamless CAD integration.

## Component Interactions (Stage-Based Workflow)
1. **Stage 1 (Select)**: User chooses a standard. `App.jsx` loads default presets and engineering spec links.
2. **Stage 2 (Refine)**: User toggles fit classes and adds/removes sizes. `calculateThreadItem` in `App.jsx` ensures every size has a valid **CTD** for export.
3. **Stage 3 (Export)**: User launches the download. `xmlGenerator.js` processes the active dataset into the final file buffer.

## Key Technical Concepts
- **CTD Generation**: The app automatically formats "Custom Thread Designations" (e.g., `1/4 - 20 BSW`) to match Fusion 360's internal lookup logic, reducing errors in CAD mapping.
- **Fraction Parsing**: Imperial sizes are entered as fractions and converted to decimals for geometric calculations.
- **Unit Sovereignty**: The app maintains strict separation between Metric (BA) and Imperial (Whitworth) unit systems throughout the calculation and export pipeline.

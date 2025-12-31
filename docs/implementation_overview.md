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

---
*Last Updated: 2025-12-31*

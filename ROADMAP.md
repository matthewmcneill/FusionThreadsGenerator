# Fusion Threads Generator Roadmap

This document outlines the planned future features and improvements for the Fusion Threads Generator.

## Recently Implemented
- **3-Stage Workflow**: Streamlined path from selection to export.
- **Workshop Configuration Tool**: Persistent state management for inventories and custom tools.
- **Tool Library Export (JSON)**: Fusion 360 compatible JSON export with synchronized cutting data.
- **New Standards**: British Standard Brass (BSB) and British Standard Cycle (BSC/CEI).
- **Unified Thread Charts**: Synchronized browser preview and high-fidelity print output.
- **Metal & Material Persistence**: Persistent material selection and default settings per thread standard.
- **Well-Formed Data Export**: Columnar export format for seamless spreadsheet integration.
- **External Thread Integration**: Comprehensive integration of external thread parameters (Blank Diameter, Compound Angle/Depth) into the core library.

## Future Implementation Ideas

### 1. State Management & Persistence
- [x] **Local State**: Save current session state in browser local storage.
- [x] **Export/Import**: Export/import workshop configuration as JSON.

### 2. "My Workshop" Personalization
- [x] **Tool Configuration**: Configure available drills and taps in a personal workshop area.
- [x] **Custom Drills**: Track custom drill sets and individual tool states.
- [x] **Custom Threads**: Define custom thread designations.

### 3. Fusion 360 CAM Integration
- [x] **Tool Library Export**: Export CAM tool libraries (.json) for Fusion 360.
- [ ] **HSM Edit Integration**: Direct HSMEdit integration for tool library verification.

### 4. Documentation & Reference
- [x] **Thread Charts**: Export nicely formatted, printable thread charts.
- [ ] **Visual Reference**: High-quality workshop wall layouts.

---

## Potential Future Thread Standards
We plan to expand our library of historical British and specialized threads. For detailed descriptions and a comparison table of these standards, please refer to the **[Thread Standards Overview in the README](README.md#thread-standards-overview)**.

Planned additions include:
- **British Standard Pipe (BSP)**: Parallel (BSPP) and Taper (BSPT).
- **Specialized Industry Threads**: Conduit (ET), Admiralty Fine (ADM), Gas Cylinder (BS 341), Fire Hose (BS 336).

---

## TODO: Improvements & Fixes

### UI/UX
- [ ] **Search Refinement**: Add fuzzy search to thread and drill selectors.
- [ ] **Dark Mode Sync**: Ensure all print outputs respect system dark/light mode preferences (currently optimized for light/print).

# Fusion Threads Generator Roadmap

This document outlines the planned future features and improvements for the Fusion Threads Generator.

## Future Implementation Ideas

### 1. State Management & Persistence
- **Local State**: Save current session state in browser local storage.
- **Export/Import**: Export/import custom thread definitions and input data as JSON.

### 2. "My Workshop" Personalization
- **Tool Configuration**: Configure available drills and taps in a personal workshop area.
- **Custom Views**: Toggle between complete standard lists and personalized lists.
- **Custom Profiles**: Generate thread profiles tailored to available tooling.

### 3. Fusion 360 CAM Integration
- **Tool Library Export**: Export CAM tool libraries (.tools) for Fusion 360.
- **Integrated Workflow**: Load both model definitions and tool data directly into Fusion 360 CAM.

### 4. Documentation & Reference
- **Thread Charts**: Export nicely formatted, printable PDF thread charts.
- **Visual Reference**: High-quality workshop wall layouts.

---

## Potential Future Thread Standards
We plan to expand our library of historical British and specialized threads. For detailed descriptions and a comparison table of these standards, please refer to the **[Thread Standards Overview in the README](README.md#thread-standards-overview)**.

Planned additions include:
- **British Standard Pipe (BSP)**: Parallel (BSPP) and Taper (BSPT).
- **British Standard Brass (BSB)**: 26 TPI constant pitch.
- **Specialized Industry Threads**: Conduit (ET), Admiralty Fine (ADM), Gas Cylinder (BS 341), Fire Hose (BS 336).

---

## TODO: Improvements & Fixes

### Data Export Cleanup
- [ ] **Nominal Size Column**: Add a simple numerical column for nominal size to the export format.
- [ ] **Field Splitting**: Split fields with ranges (e.g., Min/Max) into separate columns.
- [ ] **Copy Button Formatting**: Clean up tab-separated format for better spreadsheet compatibility.

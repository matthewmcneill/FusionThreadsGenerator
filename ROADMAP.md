# Fusion Threads Generator Roadmap

This document outlines the planned future features and improvements for the Fusion Threads Generator.

## Future Implementation Ideas

### 1. State Management & Persistence
- **Local State**: Ability to save the current session state in the browser's local storage.
- **Export/Import**: Functionality to export custom thread definitions and input data to a JSON/file format and import them back to restore a session.

### 2. "My Workshop" Personalization
- **Tool Configuration**: A dedicated area to configure the specific drills and taps available in the user's workshop.
- **Custom Views**:
    - **Complete Lists**: Toggle to view all standard threads.
    - **Personalized Lists**: Filter threads to only show those that can be produced with the user's current tool setup.
- **Custom Profiles**: Ability to generate thread profiles tailored specifically to available tooling.

### 3. Fusion 360 CAM Integration
- **Tool Library Export**: Beyond exporting XML definitions for modeling, add the ability to export CAM tool libraries (.tools) for Fusion 360.
- **Integrated Workflow**: Allow users to load both the model definitions and the corresponding tool data directly into Fusion 360 CAM.

### 4. Documentation & Reference
- **Thread Charts**: Export nicely formatted, printable thread charts (PDF format).
- **Visual Reference**: High-quality layouts designed for workshop walls to provide quick reference for drill sizes and thread specifications.

---

## TODO: Improvements & Fixes

### Data Export Cleanup
- [ ] **Nominal Size Column**: Add a simple numerical column for nominal size to the copy/export format to facilitate easier sorting and analysis.
- [ ] **Field Splitting**: Refactor fields containing ranges into separate columns (e.g., Min/Max) to make the exported data more parsable for spreadsheets.
- [ ] **Copy Button Formatting**: Generally clean up the tab-separated format for better compatibility with Excel/Google Sheets.

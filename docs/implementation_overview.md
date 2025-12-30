# FusionThreadsGenerator Implementation Overview

## Project Architecture
FusionThreadsGenerator is a React-based web application designed to generate Fusion 360-compatible XML thread definitions for British Association (BA) and Whitworth (BSW/BSF) thread standards.

The application follows a modular architecture:

### 1. UI Layer (`src/App.jsx` and `src/components/`)
- **App.jsx**: Orchestrates the application state, including selected standards, thread list, and download logic.
- **ThreadForm.jsx**: Handles user input for custom thread sizes, adapted based on the active standard.
- **ThreadList.jsx**: Renders a table of currently defined threads for review and management.

### 2. Logic Layer (`src/utils/calculators/`)
- **whitworth.js**: Implements the geometry formulas for 55° Whitworth threads and calculates tolerances for Close, Medium, and Free classes.
- **ba.js**: Implements the geometry for 47.5° BA threads using a lookup table for standard sizes (0-16 BA) and calculating tolerances for Normal and Close classes.
- **index.js**: Unified export point for thread calculators.

### 3. XML Generation Layer (`src/utils/xmlGenerator.js`)
- Transforms the internal thread data structures into the specific XML schema expected by Fusion 360, handling unit variations (mm for BA, inches for Whitworth) and mapping internal/external thread parameters.

## Component Interactions
1. User selects a **Thread Standard** in the UI.
2. `App.jsx` loads default sizes from the corresponding calculator and populates the `threads` state.
3. User can add **Custom Sizes** via `ThreadForm`, which uses the active calculator to derive geometric parameters from basic dimensions (diameter/TPI/BA No.).
4. `ThreadList` provides a real-time preview of the calculated dimensions (Major, Minor, Pitch).
5. On **Download**, `xmlGenerator.js` iterates through the active threads and classes to produce the final XML file.

## Adding New Thread Standards
To add a new thread standard (e.g., Metric):
1. Create a new calculator file in `src/utils/calculators/`.
2. Implement a `calculate[Standard]` function and a standard definition object (name, unit, angle, etc.).
3. Export from `index.js`.
4. Update `App.jsx` to include the new standard in the selection dropdown and handle its default sizes.

# Fusion 360 Thread Generator

This web application allows users to generate custom XML definitions for Fusion 360 thread standards, specifically focusing on British Association (BA), Whitworth (BSW/BSF), and British Standard Cycle (BSC/CEI) imperial threads.

## [![Access Live App](https://img.shields.io/badge/Access%20Live%20App-🚀-blue?style=for-the-badge&logo=github&logoColor=white)](https://matthewmcneill.github.io/FusionThreadsGenerator)

### Prebaked Thread Definitions (Download XML)
[![Download Whitworth](https://img.shields.io/badge/Whitworth-XML-green?style=for-the-badge&logo=xml&logoColor=white)](ThreadData/British_Standard_Whitworth_BSWBSF.xml) [![Download BA](https://img.shields.io/badge/BA-XML-green?style=for-the-badge&logo=xml&logoColor=white)](ThreadData/British_Association_BA.xml) [![Download ME](https://img.shields.io/badge/ME-XML-green?style=for-the-badge&logo=xml&logoColor=white)](ThreadData/British_Model_Engineer_ME.xml) [![Download BSC](https://img.shields.io/badge/Cycle%20(BSC)-XML-green?style=for-the-badge&logo=xml&logoColor=white)](ThreadData/British_Standard_Cycle_BSCCEI.xml)


---

## How to Use the App

1. **Select a Thread Standard**: Use the dropdown at the top to select the desired standard: **Whitworth**, **British Association (BA)**, **Model Engineer (ME)**, **British Standard Brass (BSB)**, or **Cycle (BSC/CEI)**.
2. **Refine Configuration**:
    - For **Whitworth**, use the checkboxes to toggle between **Standard (BSW)** and **Fine (BSF)** series.
    - Select the desired **Thread Classes** (e.g., Close, Medium, Free) to include in the export.
    - Choose your **Workpiece Material** to optimize target thread engagement.
    - Select the **Drill Bit Sets** available in your workshop.
3. **Review & Customize Sizes**: The app loads standard sizes by default. You can remove existing entries from the table or add custom sizes using the form at the bottom.
4. **Download XML**: Click the **Download XML** button to generate and save the `.xml` file.

---

## Installation in Fusion 360

To use the custom threads in Fusion 360, you must place the downloaded XML file into the correct `ThreadData` folder on your system.

### Windows Installation Path
Navigate to:
`%localappdata%\Autodesk\webdeploy\Production\<version ID>\Fusion\Server\Fusion\Configuration\ThreadData`

### macOS Installation Path
1. Navigate to: `/Users/[Username]/Library/Application Support/Autodesk/Webdeploy/production/[Version ID]`
2. Right-click on the **"Autodesk Fusion 360"** application icon and select **"Show Package Contents"**.
3. Continue the path: `Contents/Libraries/Applications/Fusion/Fusion/Server/Fusion/Configuration/ThreadData`

> [!TIP]
> **Easier Management**: Instead of manual copying, consider using the [ThreadKeeper](https://apps.autodesk.com/FUSION/en/Detail/Index?id=1725038115223093226) app from the Autodesk App Store. It provides a dedicated UI within Fusion 360 to manage custom thread definitions and preserves them across updates.
> 
> [!IMPORTANT]
> - **Hidden Files**: Ensure your operating system is set to show hidden files and folders.
> - **Updates**: When Fusion 360 updates to a new version, it creates a new `<version ID>` folder. You will need to copy your custom XML files from the old version folder to the new one.
> - **Reference**: For more details, see the official [Autodesk Support Article](https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/Custom-Threads-in-Fusion-360.html).

## Thread Standards Overview

The generator supports a range of historical British thread standards, focusing on the pre-metric era.

### 1. Whitworth-Form Threads (55° Angle)
Classic 55-degree flank angle with rounded crests and roots.
- **BSW (British Standard Whitworth)**: General engineering and heavy machinery. [Technical Spec](docs/WHITWORTH_SPEC.md)
- **BSF (British Standard Fine)**: Finer alternative to BSW, used where vibration is a concern. [Technical Spec](docs/WHITWORTH_SPEC.md)
- **BSP (British Standard Pipe)**:
    - **BSPP (Parallel)**: "G" threads.
    - **BSPT (Taper)**: "R" threads.
- **BSB (British Standard Brass)**: Specialized for brass tubing; constant pitch of **26 TPI**. [Technical Spec](docs/BSB_SPEC.md)
- **BS Con (British Standard Conduit)**: Also known as **ET** or **BS 31**.
- **ME (Model Engineer)**: Miniature threads for small boilers and steam models. [Technical Spec](docs/ME_SPEC.md)

### 2. British Association (BA) (47.5° Angle)
- **BA (British Association)**: Unique 47.5° angle. Standard for electrical equipment and instruments. [Technical Spec](docs/BA_SPEC.md)

### 3. Cycle Threads (60° Angle)
- **BSC / BSCy (British Standard Cycle)**: Successor to **CEI**. [Technical Spec](docs/BSC_SPEC.md)
- **The "26 TPI Rule"**: Most BSC threads from 1/4" up to 1" use a constant 26 TPI.
- **BSA Motorcycle**: Heavier 20 TPI variant for larger sizes.

### 4. Specialized Industry Threads
- **ADM (Admiralty Fine)**: Niche standard for the Royal Navy.
- **BS 341 (Gas Cylinder)**: Taper thread for cylinder valves.
- **BS 336 (Fire Hose)**: Robust "round" thread form.

### Summary Comparison Table

| Thread Type | Angle | Typical Use Case | Status |
| --- | --- | --- | --- |
| **BSW/BSF** | 55° | General engineering, motorcycles (pre-Unified). | ✅ Implemented |
| **BA** | 47.5° | Electrical fittings, instruments, modeling. | ✅ Implemented |
| **ME** | 55° | Small scale steam models and carburetors. | ✅ Implemented |
| **BSC / CEI** | 60° | Bicycles and motorcycles (BSA, Norton, Triumph). | ✅ Implemented |
| **BSP** | 55° | Plumbing and hydraulic systems. | 📋 Planned |
| **BSB** | 55° | Brass lamps, gas fittings, thin-walled tubing. | ✅ Implemented |

> [!TIP]
> **Drill Selection**: All supported threads use our advanced [Tapping Drill Specification](docs/DRILL_SPEC.md) for tool selection.
>
> **Future Plans**: For a detailed list of planned features and work, check the [ROADMAP.md](ROADMAP.md).

---

## Technical Documentation & Resources
- [IMPLEMENTATION_OVERVIEW.md](docs/IMPLEMENTATION_OVERVIEW.md) - Software architecture and developer guide.

---

## Developer Guide - Build & Deploy

This project is built using **React** and **Vite**.

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Build & Deploy to GitHub Pages
To build and deploy the application to your GitHub Pages site:
```bash
npm run deploy
```

**How it works:**
- `npm run deploy` automatically triggers the `predeploy` script, which runs `npm run build` to generate the production bundle in the `dist/` directory.
- It then uses the `gh-pages` package to push the contents of the `dist/` directory to the `gh-pages` branch of your repository, making the app live.

---

## License

This project is licensed under the [GNU General Public License v3.0](LICENSE).


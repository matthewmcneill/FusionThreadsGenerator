# Fusion 360 Thread Generator

This web application allows users to generate custom XML definitions for Fusion 360 thread standards, specifically focusing on British Association (BA) and Whitworth (BSW/BSF) imperial threads.

## [![Access Live App](https://img.shields.io/badge/Access%20Live%20App-🚀-blue?style=for-the-badge&logo=github&logoColor=white)](https://matthewmcneill.github.io/FusionThreadsGenerator) [![Download Whitworth](https://img.shields.io/badge/Download%20Whitworth-XML-green?style=for-the-badge&logo=xml&logoColor=white)](ThreadData/Whitworth.xml) [![Download BA](https://img.shields.io/badge/Download%20BA-XML-green?style=for-the-badge&logo=xml&logoColor=white)](ThreadData/BA_Threads.xml) [![Download ME](https://img.shields.io/badge/Download%20ME-XML-green?style=for-the-badge&logo=xml&logoColor=white)](ThreadData/Model_Engineer_ME.xml)

## Technical Documentation

- [Whitworth Thread Specification](docs/WHITWORTH_SPEC.md) - Technical details and formulas for Whitworth (BSW/BSF) thread forms.
- [BA Thread Specification](docs/BA_SPEC.md) - Technical details and formulas for British Association (BA) thread forms.
- [Model Engineer (ME) Thread Specification](docs/ME_SPEC.md) - Technical details and formulas for Model Engineer (ME) thread forms.
- [Implementation Overview](docs/implementation_overview.md) - Software architecture and developer guide.

---

## How to Use the App

1. **Select a Thread Standard**: Use the tabs at the top to select the desired standard: **Whitworth**, **British Association (BA)**, or **Model Engineer (ME)**.
2. **Filter by Series & Class**:
    - For **Whitworth**, use the checkboxes to toggle between **Standard (BSW)** and **Fine (BSF)** series.
    - Select the desired **Thread Classes** (e.g., Close, Medium, Free) to include in the export.
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

> [!IMPORTANT]
> - **Hidden Files**: Ensure your operating system is set to show hidden files and folders.
> - **Updates**: When Fusion 360 updates to a new version, it creates a new `<version ID>` folder. You will need to copy your custom XML files from the old version folder to the new one.
> - **Reference**: For more details, see the official [Autodesk Support Article](https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/Custom-Threads-in-Fusion-360.html).

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


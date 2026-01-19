import React from 'react';
import { renderToString } from 'react-dom/server';
import ThreadChartTable from '../components/ThreadChartTable';

/**
 * @module utils/printHelpers
 * @description Utilities for generating and triggering printable thread charts.
 */

/**
 * Generates the full HTML/CSS document for a printable workshop thread chart.
 * This function uses `ReactDOMServer.renderToString` to inject the `ThreadChartTable` 
 * into a specialized print layout.
 * 
 * Features:
 * - High density typography optimized for shop floor use.
 * - Dynamic standard name and material headers.
 * - Embedded CSS with @page rules for consistent printing.
 * 
 * @param {Object} options - Generation options.
 * @param {Array<Object>} options.threads - Collection of threads to include.
 * @param {Array<string>} options.selectedClasses - Active tolerance classes.
 * @param {string} options.unit - Measurement unit ('in' or 'mm').
 * @param {string} options.standardName - Title of the thread standard (e.g., 'BSW').
 * @param {string} options.material - Selected substrate material for context.
 * @param {boolean} [options.includeInternal=true] - Include the internal threading section.
 * @param {boolean} [options.includeExternal=false] - Include the external threading section.
 * @returns {string} Fully formed HTML document string.
 */
export const generatePrintableHtml = ({
    threads,
    selectedClasses,
    unit,
    standardName,
    material,
    includeInternal = true,
    includeExternal = false
}) => {
    const date = new Date().toLocaleDateString();

    const tableHtml = renderToString(
        <ThreadChartTable
            threads={threads}
            selectedClasses={selectedClasses}
            unit={unit}
            includeInternal={includeInternal}
            includeExternal={includeExternal}
            isPrint={true}
        />
    );

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${standardName} Chart</title>
    <style>
        @page { size: auto; margin: 12mm; }
        body {
            font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            color: #000;
            background: #fff;
            margin: 0;
            padding: 0;
            line-height: 1.2;
            font-size: 8pt;
        }
        header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            border-bottom: 2pt solid #000;
            padding-bottom: 2mm;
            margin-bottom: 4mm;
        }
        h1 { margin: 0; font-size: 14pt; font-weight: 900; letter-spacing: -0.5px; text-transform: uppercase; }
        .meta { text-align: right; font-size: 7.5pt; font-weight: 700; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
        
        table { width: 100%; border-collapse: collapse; }
        th {
            text-align: center;
            padding: 1.5mm 1mm;
            font-size: 7.5pt;
            text-transform: uppercase;
            font-weight: 700;
            border-bottom: 1pt solid #000;
            color: #000;
            border-left: 0.5pt solid #ddd;
        }
        .macro-header-th {
            border-bottom: 2pt solid #000 !important;
            font-weight: 900;
            letter-spacing: 0.5px;
            font-size: 8pt;
        }
        .size-col, .pitch-col { text-align: left; border-left: none; }
        
        /* Section Dividers */
        .section-start { border-left: 2pt solid #000 !important; }
        .section-end { border-right: 2pt solid #000 !important; }
        
        td {
            padding: 1.2mm 1mm;
            border-bottom: 0.5pt solid #eee;
            vertical-align: middle;
            border-left: 0.5pt solid #f5f5f5;
        }
        td:first-child { border-left: none; }
        
        .series-header-row { background: #000 !important; color: #fff !important; }
        .series-header-td { padding: 1mm 1.5mm; font-weight: 900; text-transform: uppercase; font-size: 7.5pt; letter-spacing: 2px; border: none; }

        .size-stack { display: flex; flex-direction: column; line-height: 1; text-align: left; }
        .size-designation { font-weight: 700; font-size: 9pt; }
        .size-nominal { font-size: 7pt; color: #444; text-transform: uppercase; font-weight: 500; }
        
        .pitch-col { text-align: center; font-family: ui-monospace, monospace; color: #444; font-weight: 700; border-left: none; }
        .data-col { text-align: center; font-family: ui-monospace, monospace; font-size: 8.5pt; font-weight: 500; }
        .drill-col { text-align: center; }
        .drill-name { font-weight: 700; font-size: 8.5pt; display: block; }
        .drill-decimal { color: #666; font-size: 7pt; font-weight: 400; display: block; }
        .advisory-col { text-align: center; font-size: 6.5pt; text-transform: uppercase; font-weight: 700; line-height: 1; }
        
        .status-danger { color: #000; border: 1pt solid #000; padding: 0.2mm 0.5mm; }
        
        footer { margin-top: 8mm; font-size: 7pt; color: #666; text-align: center; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }

        @media print {
            body { -webkit-print-color-adjust: exact; }
            .series-header-row { background-color: #000 !important; color: #fff !important; }
        }
    </style>
</head>
<body>
    <header>
        <div>
            <h1>Thread Specification Chart</h1>
            <div style="font-size: 8pt; font-weight: 700; color: #94a3b8; margin-top: 1mm;">${standardName} &bull; ${material.toUpperCase()}</div>
        </div>
        <div class="meta">
            ${date}<br>
            ${unit.toUpperCase()} UNITS
        </div>
    </header>

    ${tableHtml}

    </footer>
</body>
</html>
`;
};

/**
 * Opens a new browser window, writes the provided HTML, and triggers the print dialog.
 * Includes a safety fallback via `window.alert` if popups are blocked.
 * 
 * @param {string} html - The fully formed HTML content to print.
 * @returns {void}
 */
export const triggerPrint = (html) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert('Please allow popups to print the chart.');
        return;
    }

    printWindow.document.write(html);
    printWindow.document.close();

    // Using a timeout ensure the document is fully closed and parsed before triggering print
    // The onload event on about:blank can be inconsistent across browsers
    setTimeout(() => {
        printWindow.print();
    }, 250);
};


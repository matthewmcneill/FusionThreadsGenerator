import React from 'react';
import { renderToString } from 'react-dom/server';
import ThreadChartTable from '../components/ThreadChartTable';

/**
 * @module utils/printHelpers
 * @description Utilities for generating and triggering printable thread charts.
 */

/**
 * Generates the HTML content for a printable workshop thread chart.
 * Focused on high information density, clean typography, and professional clarity.
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
            text-align: left;
            padding: 2mm 1mm;
            font-size: 7.5pt;
            text-transform: uppercase;
            font-weight: 600;
            border-bottom: 2pt solid #000;
            color: #000;
        }
        td {
            padding: 1.5mm 1mm;
            border-bottom: 1pt solid #eee;
            vertical-align: middle;
        }
        
        .series-header-row { background: #000 !important; color: #fff !important; }
        .series-header-td { padding: 1mm 1.5mm; font-weight: 900; text-transform: uppercase; font-size: 7.5pt; letter-spacing: 2px; }

        .size-stack { display: flex; flex-direction: column; line-height: 1; }
        .size-designation { font-weight: 600; font-size: 9pt; }
        .size-nominal { font-size: 7.5pt; color: #666; text-transform: uppercase; font-weight: 500; }
        
        .pitch-col { text-align: center; font-family: ui-monospace, monospace; color: #666; font-weight: 500; }
        .gender-col { font-size: 7pt; text-transform: uppercase; font-weight: 700; text-align: center; color: #666; }
        .data-col { text-align: right; font-family: ui-monospace, monospace; font-size: 8.5pt; font-weight: 500; }
        .drill-col { padding-left: 4mm; }
        .drill-name { font-weight: 700; }
        .drill-decimal { color: #888; font-size: 7.5pt; font-weight: 400; }
        .advisory-col { padding-left: 4mm; font-size: 7.5pt; text-transform: uppercase; }
        
        .status-danger { color: #e11d48; font-weight: 700; }
        .status-caution { color: #64748b; }
        
        footer { margin-top: 8mm; font-size: 7pt; color: #94a3b8; text-align: center; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }

        @media print {
            body { -webkit-print-color-adjust: exact; }
            .series-header-row { background-color: #000 !important; color: #fff !important; }
            .status-danger { color: #e11d48 !important; }
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


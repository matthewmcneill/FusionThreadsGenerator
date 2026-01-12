/**
 * @module utils/printHelpers
 * @description Utilities for generating and triggering printable thread charts.
 */

const f = (val) => (typeof val === 'number' ? val.toFixed(4) : '-');

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
    const isImperial = unit === 'in';
    const date = new Date().toLocaleDateString();

    // Group threads by Series (Match ThreadChart.jsx logic)
    const groupedBySeries = threads.reduce((acc, t) => {
        const series = t.series || 'Other';
        if (!acc[series]) acc[series] = [];
        acc[series].push(t);
        return acc;
    }, {});

    let tableRows = '';

    Object.entries(groupedBySeries).forEach(([seriesName, seriesThreads]) => {
        // Series Header Row
        tableRows += `
            <tr class="series-header-row">
                <td colspan="6" class="series-header-td">${seriesName} Series</td>
            </tr>
        `;

        seriesThreads.forEach((thread) => {
            const activeClasses = selectedClasses.filter(c => thread.classes[c]);

            ['External', 'Internal'].forEach((gender) => {
                if (gender === 'Internal' && !includeInternal) return;
                if (gender === 'External' && !includeExternal) return;

                const genderClasses = activeClasses.filter(cls => thread.classes[cls][gender.toLowerCase()]);
                if (genderClasses.length === 0) return;

                // Match ThreadChart.jsx: take the first active class
                const cls = genderClasses[0];
                const c = thread.classes[cls];
                const data = gender === 'External' ? c.external : c.internal;

                // Sync Advisory Logic with ThreadChart.jsx
                let advisoryText = '';
                let isDanger = false;
                if (gender === 'Internal' && data.tapDrillName) {
                    const engagement = Math.round(data.tapDrillValidation?.engagement || 0);
                    const status = (data.tapDrillValidation?.status || '').toLowerCase();
                    isDanger = status.includes('danger');
                    if (status === 'warning-loose') advisoryText = `Caution: Loose Fit (${engagement}% PTE)`;
                    else if (status === 'warning-tight') advisoryText = `Caution: tight fit (${engagement}% PTE)`;
                    else if (status.includes('danger-loose') || status.includes('danger-very-loose')) advisoryText = `Danger: loose, risk of stripping (${engagement}% PTE)`;
                    else if (status.includes('danger-tight')) advisoryText = `Danger: tight, risk of tap breaking (${engagement}% PTE)`;
                }

                const drillOutput = gender === 'Internal' && data.tapDrillName
                    ? `<span class="drill-name">${data.tapDrillName}</span> ${data.tapDrillToolSize ? `<span class="drill-decimal">(${f(data.tapDrillToolSize)})</span>` : ''}`
                    : '-';

                tableRows += `
                    <tr>
                        <td class="size-col">
                            <div class="size-stack">
                                <span class="size-designation">${thread.designation}</span>
                                <span class="size-nominal">${thread.nominalFraction || thread.size}</span>
                            </div>
                        </td>
                        <td class="pitch-col">${isImperial ? thread.tpi : f(thread.basic.p)}</td>
                        <td class="gender-col">${gender}</td>
                        <td class="data-col">${f(data.major)}</td>
                        <td class="drill-col">${drillOutput}</td>
                        <td class="advisory-col">
                            ${advisoryText ? `<span class="${isDanger ? 'status-danger' : 'status-caution'}">${advisoryText}</span>` : '-'}
                        </td>
                    </tr>
                `;
            });
        });
    });

    const materialLabels = {
        'hard': 'Hard Alloys (60% PTE)',
        'ferrous': 'General Ferrous (70% PTE)',
        'soft': 'Soft Non-Ferrous (80% PTE)'
    };

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

    <table>
        <thead>
            <tr>
                <th style="width: 15%">Size / Designation</th>
                <th style="width: 10%; text-align: center">${isImperial ? 'TPI' : 'PITCH'}</th>
                <th style="width: 10%; text-align: center">GENDER</th>
                <th style="width: 10%; text-align: right">MAJOR DIA</th>
                <th style="width: 25%; padding-left: 4mm">TAP DRILL (TOOL)</th>
                <th style="width: 30%; padding-left: 4mm">WORKSHOP ADVISORY</th>
            </tr>
        </thead>
        <tbody>
            ${tableRows}
        </tbody>
    </table>

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


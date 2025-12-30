/**
 * @module App
 * @description Root component that manages the application state and layout.
 * 
 * Main functions:
 * - App (default export): Renders the main interface and handles standard selection and download logic.
 */

import React, { useState, useEffect } from 'react';
import ThreadForm from './components/ThreadForm';
import ThreadList from './components/ThreadList';
import {
  calculateWhitworth,
  calculateBA,
  calculateME,
  WhitworthStandard,
  BAStandard,
  MEStandard,
  BSW_SIZES,
  BSF_SIZES,
  BA_SIZES,
  ME_SIZES
} from './utils/calculators';
import { generateFusionXML } from './utils/xmlGenerator';

/**
 * Main application component.
 * Manages the list of threads, the current standard, and the XML generation process.
 */
function App() {
  const [standard, setStandard] = useState(WhitworthStandard);
  const [threads, setThreads] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState(WhitworthStandard.classes);
  const [whitworthFilters, setWhitworthFilters] = useState({ standard: true, fine: true });

  /**
   * Helper to calculate a full thread object based on standard and basic input.
   * @param {Object} std - The active thread standard.
   * @param {Object} input - Basic thread dimensions (size, tpi, designation).
   * @returns {Object|null} The calculated thread object.
   */
  const calculateThreadItem = (std, input) => {
    let calc;
    const isWhitworth = std.name.includes('Whitworth');

    // 1. Run standard-specific geometry calculator
    if (isWhitworth) {
      calc = calculateWhitworth(input.size, input.tpi);
    } else if (std.name.includes('ME')) {
      calc = calculateME(input.size, input.tpi);
    } else {
      calc = calculateBA(input.size);
    }

    if (!calc) return null;

    // 2. Auto-generate CTD (Custom Thread Designation) if missing
    // Standardizes the naming for Fusion 360 lookup
    const ctd = input.ctd || (isWhitworth
      ? `${input.designation.replace(' BSW', '').replace(' BSF', '')} - ${input.tpi} ${std.name.includes('BSW') ? 'BSW' : 'BSF'}`
      : std.name.includes('ME')
        ? `${input.designation.replace('ME ', '').replace(' BSB', '')} - ${input.tpi} ${input.tpi === 26 ? 'BSB' : 'ME'}`
        : input.designation
    );

    // 3. Return combined data
    return { ...input, ...calc, ctd, type: input.designation.includes('BSW') ? 'standard' : 'fine' };
  };

  /**
   * Populates the thread list with default sizes for a given standard.
   * @param {Object} newStd - The standard to load defaults for.
   * @param {Object} [filters] - Optional filters for Whitworth (Standard/Fine).
   */
  const loadStandardDefaults = (newStd, filters = whitworthFilters) => {
    // 1. Select the appropriate default size array
    let defaultSizes = [];
    if (newStd.name === 'Whitworth') {
      if (filters.standard) defaultSizes = [...defaultSizes, ...BSW_SIZES];
      if (filters.fine) defaultSizes = [...defaultSizes, ...BSF_SIZES];
    } else if (newStd.name.includes('ME')) {
      defaultSizes = ME_SIZES;
    } else {
      defaultSizes = BA_SIZES;
    }

    // 2. Map default sizes through the calculator
    const populated = defaultSizes
      .map(s => calculateThreadItem(newStd, s))
      .filter(Boolean);

    // 3. Update state
    setThreads(populated);
    setSelectedClasses(newStd.classes);
  };

  /**
   * Effect hook to load the initial standard (Whitworth) on mount.
   */
  useEffect(() => {
    loadStandardDefaults(WhitworthStandard);
  }, []);

  /**
   * Handles user selection of a different thread standard.
   * @param {string} standardName - Short code for the standard (Whitworth, BA).
   */
  const handleStandardChange = (standardName) => {
    let newStd;
    if (standardName === 'Whitworth') newStd = WhitworthStandard;
    else if (standardName === 'ME') newStd = MEStandard;
    else newStd = BAStandard;

    setStandard(newStd);
    loadStandardDefaults(newStd);
  };

  /**
   * Toggles Whitworth filters (Standard/Fine).
   * @param {string} filterKey - 'standard' or 'fine'.
   */
  const toggleWhitworthFilter = (filterKey) => {
    const newFilters = { ...whitworthFilters, [filterKey]: !whitworthFilters[filterKey] };
    setWhitworthFilters(newFilters);
    if (standard.name === 'Whitworth') {
      loadStandardDefaults(standard, newFilters);
    }
  };

  /**
   * Adds a new custom thread size to the list.
   * @param {Object} input - User-provided thread dimensions.
   */
  const handleAddThread = (input) => {
    const newThread = calculateThreadItem(standard, input);
    if (newThread) {
      setThreads([...threads, newThread]);
    }
  };

  /**
   * Removes a thread from the list by index.
   * @param {number} index - The index of the thread to remove.
   */
  const handleRemoveThread = (index) => {
    setThreads(threads.filter((_, i) => i !== index));
  };

  /**
   * Toggles inclusion of a specific thread class in the final XML.
   * @param {string} className - The name of the class (e.g., 'Close').
   */
  const toggleClass = (className) => {
    if (selectedClasses.includes(className)) {
      setSelectedClasses(selectedClasses.filter(c => c !== className));
    } else {
      setSelectedClasses([...selectedClasses, className]);
    }
  };

  /**
   * Orchestrates the XML generation and triggers browser download.
   */
  const handleDownload = () => {
    // 1. Generate XML string with build metadata
    const xml = generateFusionXML(standard, threads, selectedClasses, {
      version: __APP_VERSION__,
      commitHash: __COMMIT_HASH__
    });

    // 2. Create Blob and temporary URL
    const blob = new Blob([xml], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);

    // 3. Create invisible anchor and trigger click
    const a = document.createElement('a');
    a.href = url;

    // Sanitize filename: remove brackets, replace spaces/dots with underscores,
    // remove non-alphanumeric, collapse underscores
    const cleanName = standard.name
      .replace(/[()]/g, '')
      .replace(/[\s.]+/g, '_')
      .replace(/[^a-zA-Z0-9_-]/g, '')
      .replace(/_{2,}/g, '_')
      .replace(/^_+|_+$/g, '');

    a.download = `${cleanName}.xml`;
    document.body.appendChild(a);
    a.click();

    // 4. Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="App">
      <h1>Fusion 360 Thread Generator</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Create custom XML definitions for Whitworth (BSW/BSF) or British Association (BA) threads.
      </p>

      {/* Configuration Panel */}
      <div className="glass-panel" style={{ marginBottom: '2rem', padding: '1.5rem 0' }}>
        <div className="workflow-container">
          {/* Stage 1: Select */}
          <div className="workflow-column">
            <div className="step-header">
              <span className="step-number">1</span>
              <span className="step-title">Select Standard</span>
            </div>
            <div className="input-group" style={{ margin: 0 }}>
              <select
                value={standard.name === 'Whitworth' ? 'Whitworth' : (standard.name.includes('ME') ? 'ME' : 'BA')}
                onChange={(e) => handleStandardChange(e.target.value)}
              >
                <option value="Whitworth">Whitworth</option>
                <option value="BA">British Association (BA)</option>
                <option value="ME">Model Engineer (ME)</option>
              </select>
              {standard.docUrl && (
                <a
                  href={standard.docUrl.startsWith('http') ? standard.docUrl : `${import.meta.env.BASE_URL}${standard.docUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="doc-link workflow-link"
                >
                  View Engineering Specification
                </a>
              )}
            </div>
          </div>

          {/* Stage 2: Refine */}
          <div className="workflow-column">
            <div className="step-header">
              <span className="step-number">2</span>
              <span className="step-title">Refine Series & Fits</span>
            </div>
            <div className="input-group" style={{ margin: 0 }}>
              {standard.name === 'Whitworth' && (
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)', justifyContent: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input
                      type="checkbox"
                      checked={whitworthFilters.standard}
                      onChange={() => toggleWhitworthFilter('standard')}
                      style={{ marginRight: '0.4rem', width: 'auto' }}
                    />
                    Standard (BSW)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input
                      type="checkbox"
                      checked={whitworthFilters.fine}
                      onChange={() => toggleWhitworthFilter('fine')}
                      style={{ marginRight: '0.4rem', width: 'auto' }}
                    />
                    Fine (BSF)
                  </label>
                </div>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.25rem', justifyContent: 'center' }}>
                {standard.classes.map(c => (
                  <label key={c} style={{ display: 'flex', alignItems: 'center', fontWeight: 'normal', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input
                      type="checkbox"
                      checked={selectedClasses.includes(c)}
                      onChange={() => toggleClass(c)}
                      style={{ marginRight: '0.4rem', width: 'auto' }}
                    />
                    {c}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Stage 3: Export */}
          <div className="workflow-column">
            <div className="step-header">
              <span className="step-number">3</span>
              <span className="step-title">Launch Export</span>
            </div>
            <div className="input-group" style={{ margin: 0 }}>
              <button
                onClick={handleDownload}
                disabled={threads.length === 0}
                className="download-btn-small"
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  opacity: threads.length === 0 ? 0.5 : 1,
                  cursor: threads.length === 0 ? 'not-allowed' : 'pointer',
                  background: 'linear-gradient(to right, #38bdf8, #818cf8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: threads.length === 0 ? 'none' : '0 4px 15px rgba(56, 189, 248, 0.3)'
                }}
              >
                Download XML ({threads.length})
              </button>
              <a
                href="https://github.com/matthewmcneill/FusionThreadsGenerator#installation-in-fusion-360"
                target="_blank"
                rel="noopener noreferrer"
                className="doc-link workflow-link"
              >
                Installation Guide
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* List and Form components */}
      <ThreadList threads={threads} onRemove={handleRemoveThread} unit={standard.unit} />

      <ThreadForm onAdd={handleAddThread} currentStandard={standard.name} />

      <footer className="app-footer">
        <div className="footer-content">
          <p>
            <strong>Fusion 360 Thread Generator</strong><br />
            Generates custom XML definitions for Whitworth (BSW/BSF) and British Association (BA) threads.
          </p>
          <div className="footer-links">
            <a href="https://github.com/matthewmcneill/FusionThreadsGenerator" target="_blank" rel="noopener noreferrer">GitHub Repository</a>
            <span className="separator">|</span>
            <a href="https://github.com/matthewmcneill/FusionThreadsGenerator/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">GPLv3 License</a>
          </div>
          <p className="copyright">
            © {new Date().getFullYear()} Matthew McNeill. All rights reserved.<br />
            <span style={{ opacity: 0.6, fontSize: '0.8rem' }}>
              Version {__APP_VERSION__} ({__COMMIT_HASH__})
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

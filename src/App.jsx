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
  BSWStandard,
  BSFStandard,
  BAStandard,
  BSW_SIZES,
  BSF_SIZES,
  BA_SIZES
} from './utils/calculators';
import { generateFusionXML } from './utils/xmlGenerator';

/**
 * Main application component.
 * Manages the list of threads, the current standard, and the XML generation process.
 */
function App() {
  const [standard, setStandard] = useState(BSWStandard);
  const [threads, setThreads] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState(BSWStandard.classes);

  /**
   * Helper to calculate a full thread object based on standard and basic input.
   * @param {Object} std - The active thread standard.
   * @param {Object} input - Basic thread dimensions (size, tpi, designation).
   * @returns {Object|null} The calculated thread object.
   */
  const calculateThreadItem = (std, input) => {
    let calc;
    const isWhitworth = std.name.includes('Whitworth');

    if (isWhitworth) {
      calc = calculateWhitworth(input.size, input.tpi);
    } else {
      calc = calculateBA(input.size);
    }

    if (!calc) return null;

    // Auto-generate CTD if missing (useful for custom additions)
    const ctd = input.ctd || (isWhitworth
      ? `${input.designation.replace(' BSW', '').replace(' BSF', '')} - ${input.tpi} ${std.name.includes('BSW') ? 'BSW' : 'BSF'}`
      : input.designation
    );

    return { ...input, ...calc, ctd };
  };

  /**
   * Populates the thread list with default sizes for a given standard.
   * @param {Object} newStd - The standard to load defaults for.
   */
  const loadStandardDefaults = (newStd) => {
    // 1. Select the appropriate default size array
    let defaultSizes = [];
    if (newStd.name === 'Whitworth (BSW)') defaultSizes = BSW_SIZES;
    else if (newStd.name === 'Whitworth (BSF)') defaultSizes = BSF_SIZES;
    else defaultSizes = BA_SIZES;

    // 2. Map default sizes through the calculator
    const populated = defaultSizes
      .map(s => calculateThreadItem(newStd, s))
      .filter(Boolean);

    // 3. Update state
    setThreads(populated);
    setSelectedClasses(newStd.classes);
  };

  /**
   * Effect hook to load the initial standard (BSW) on mount.
   */
  useEffect(() => {
    loadStandardDefaults(BSWStandard);
  }, []);

  /**
   * Handles user selection of a different thread standard.
   * @param {string} standardName - Short code for the standard (BSW, BSF, BA).
   */
  const handleStandardChange = (standardName) => {
    let newStd;
    if (standardName === 'BSW') newStd = BSWStandard;
    else if (standardName === 'BSF') newStd = BSFStandard;
    else newStd = BAStandard;

    setStandard(newStd);
    loadStandardDefaults(newStd);
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
    // 1. Generate XML string
    const xml = generateFusionXML(standard, threads, selectedClasses);

    // 2. Create Blob and temporary URL
    const blob = new Blob([xml], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);

    // 3. Create invisible anchor and trigger click
    const a = document.createElement('a');
    a.href = url;
    a.download = `${standard.name.replace(/\s+/g, '_')}.xml`;
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
      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
          <div className="input-group" style={{ margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ marginBottom: 0 }}>Thread Standard:</label>
              {standard.docUrl && (
                <a
                  href={`${import.meta.env.BASE_URL}${standard.docUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="doc-link"
                  style={{ fontSize: '0.85rem' }}
                >
                  View Engineering Specification
                </a>
              )}
            </div>
            <select
              value={standard.name === 'Whitworth (BSW)' ? 'BSW' : standard.name === 'Whitworth (BSF)' ? 'BSF' : 'BA'}
              onChange={(e) => handleStandardChange(e.target.value)}
              style={{ width: '220px' }}
            >
              <option value="BSW">Whitworth (BSW)</option>
              <option value="BSF">Whitworth (BSF)</option>
              <option value="BA">British Association (BA)</option>
            </select>
          </div>

          <div className="input-group" style={{ margin: 0 }}>
            <label>Include Classes/Fits:</label>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              {standard.classes.map(c => (
                <label key={c} style={{ display: 'flex', alignItems: 'center', fontWeight: 'normal', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedClasses.includes(c)}
                    onChange={() => toggleClass(c)}
                    style={{ marginRight: '0.5rem', width: 'auto' }}
                  />
                  {c}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Form and List components */}
      <ThreadForm onAdd={handleAddThread} currentStandard={standard.name} />

      <ThreadList threads={threads} onRemove={handleRemoveThread} unit={standard.unit} />

      {/* Download Action */}
      {threads.length > 0 && (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button
            onClick={handleDownload}
            disabled={selectedClasses.length === 0}
            className="download-btn"
            style={{
              padding: '1rem 3rem',
              fontSize: '1.2rem',
              background: selectedClasses.length === 0 ? '#4b5563' : 'linear-gradient(to right, #38bdf8, #818cf8)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: selectedClasses.length === 0 ? 'not-allowed' : 'pointer',
              boxShadow: selectedClasses.length === 0 ? 'none' : '0 0 20px rgba(56, 189, 248, 0.4)',
              transition: 'all 0.3s ease'
            }}
          >
            Download {standard.name} XML
          </button>
          {selectedClasses.length === 0 && (
            <p style={{ color: '#f87171', marginTop: '0.5rem' }}>Please select at least one class.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;

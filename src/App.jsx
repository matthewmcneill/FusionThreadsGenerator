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
import ThreadPreview from './components/ThreadPreview';
import WorkshopGuide from './components/WorkshopGuide';
import {
  calculateWhitworth,
  calculateBA,
  calculateME,
  calculateBSC,
  calculateBSB,
  WhitworthStandard,
  BAStandard,
  MEStandard,
  BSCStandard,
  BSBStandard,
  BSW_SIZES,
  BSF_SIZES,
  BA_SIZES,
  ME_SIZES,
  STANDARD_BSC_SIZES,
  BSA_HEAVY_SIZES,
  BSB_SIZES
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
  const [selectedSeries, setSelectedSeries] = useState(WhitworthStandard.series);
  const [selectedDrillSets, setSelectedDrillSets] = useState(WhitworthStandard.defaultDrillSets);
  const [material, setMaterial] = useState('ferrous');
  const [activeTab, setActiveTab] = useState('config');

  const ALL_DRILL_SETS = ['Metric', 'Number', 'Letter', 'Imperial'];

  /**
   * Helper to calculate a full thread object based on standard and basic input.
   * @param {Object} std - The active thread standard.
   * @param {Object} input - Basic thread dimensions (size, tpi, designation).
   * @param {Array<string>} [drillSets] - Optional override for drill sets (uses state if omitted).
   * @returns {Object|null} The calculated thread object.
   */
  const calculateThreadItem = (std, input, drillSets = null) => {
    let calc;
    const isWhitworth = std.name.includes('Whitworth');
    const activeDrillSets = drillSets || selectedDrillSets;

    // 1. Run standard-specific geometry calculator
    if (std.id === 'WHITWORTH') {
      calc = calculateWhitworth(input.size, input.tpi, activeDrillSets, null, material);
    } else if (std.id === 'ME') {
      calc = calculateME(input.size, input.tpi, activeDrillSets, material);
    } else if (std.id === 'BSC') {
      calc = calculateBSC(input.size, input.tpi, activeDrillSets, null, material);
    } else if (std.id === 'BSB') {
      calc = calculateBSB(input.size, input.tpi, activeDrillSets, material);
    } else {
      calc = calculateBA(input.size, activeDrillSets, material);
    }

    if (!calc) return null;

    // 2. Auto-generate CTD and detect Series if missing (using standard delegates)
    const ctd = input.ctd || (std.getCTD ? std.getCTD(input) : input.designation);
    const series = input.series || (std.getSeries ? std.getSeries(input) : std.series[0]);

    return { ...input, ...calc, ctd, series };
  };

  /**
   * Populates the thread list with default sizes for a given standard.
   * @param {Object} newStd - The standard to load defaults for.
   * @param {Object} [filters] - Optional filters for designations (Series).
   */
  const loadStandardDefaults = (newStd, filters = null) => {
    // 1. Select the appropriate default size array
    let defaultSizes = [];
    const activeSeries = filters || newStd.series;

    if (newStd.id === 'WHITWORTH') {
      if (activeSeries.includes('BSW')) defaultSizes = [...defaultSizes, ...BSW_SIZES];
      if (activeSeries.includes('BSF')) defaultSizes = [...defaultSizes, ...BSF_SIZES];
    } else if (newStd.id === 'ME') {
      defaultSizes = ME_SIZES.filter(s => activeSeries.includes(s.series));
    } else if (newStd.id === 'BSC') {
      if (activeSeries.includes('Standard')) defaultSizes = [...defaultSizes, ...STANDARD_BSC_SIZES];
      if (activeSeries.includes('BSA')) defaultSizes = [...defaultSizes, ...BSA_HEAVY_SIZES];
    } else if (newStd.id === 'BSB') {
      defaultSizes = BSB_SIZES;
    } else {
      defaultSizes = BA_SIZES;
    }

    // 2. Map default sizes through the calculator (preserving custom threads)
    const populatedDefaults = defaultSizes
      .map(s => calculateThreadItem(newStd, s, newStd.defaultDrillSets))
      .filter(Boolean);

    const customThreads = threads.filter(t => !t.isPreset);

    // 3. Update state
    setThreads([...populatedDefaults.map(t => ({ ...t, isPreset: true })), ...customThreads]);
    setSelectedClasses(newStd.classes);
    setSelectedSeries(activeSeries);
    setSelectedDrillSets(newStd.defaultDrillSets || ['Number', 'Letter', 'Imperial']);
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
  const handleStandardChange = (standardId) => {
    let newStd;
    if (standardId === 'WHITWORTH') newStd = WhitworthStandard;
    else if (standardId === 'ME') newStd = MEStandard;
    else if (standardId === 'BSC') newStd = BSCStandard;
    else if (standardId === 'BSB') newStd = BSBStandard;
    else newStd = BAStandard;

    setStandard(newStd);
    // Explicitly pass material/tapType to ensure fresh calculation
    loadStandardDefaults(newStd);
  };

  /**
   * Toggles inclusion of a specific thread series (Designation).
   * @param {string} seriesName - The name of the series (e.g., 'BSW').
   */
  const toggleSeries = (seriesName) => {
    let newSeries;
    if (selectedSeries.includes(seriesName)) {
      newSeries = selectedSeries.filter(s => s !== seriesName);
    } else {
      newSeries = [...selectedSeries, seriesName];
    }
    setSelectedSeries(newSeries);
    loadStandardDefaults(standard, newSeries);
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

  const toggleDrillSet = (setName) => {
    const newSets = selectedDrillSets.includes(setName)
      ? selectedDrillSets.filter(s => s !== setName)
      : [...selectedDrillSets, setName];

    setSelectedDrillSets(newSets);
  };

  /**
   * Handles material change and recalculates threads.
   */
  const handleMaterialChange = (newMaterial) => {
    setMaterial(newMaterial);
    // The useEffect below will handle recalculation based on material change
  };

  /**
   * Recalculates all threads when global process settings change.
   */
  useEffect(() => {
    if (threads.length === 0) return;

    setThreads(prevThreads => prevThreads.map(t => calculateThreadItem(standard, t)).filter(Boolean));
  }, [material, selectedDrillSets]);

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
    <div className="min-h-screen bg-transparent py-8 px-8">
      <div className="max-w-[1344px] mx-auto flex flex-col items-center">
        <h1 className="text-3xl md:text-[51.2px] font-bold tracking-tight mt-[34px] mb-[25px] bg-clip-text text-transparent bg-gradient-to-r from-white to-sky-400 drop-shadow-2xl leading-tight">
          Fusion 360 Thread Generator
        </h1>
        <p className="text-slate-400 text-lg mb-10 max-w-2xl text-center">
          Create & Customise Professional Fusion 360 XML definitions for British Standard Threads.
        </p>

        {/* Persistent Configuration Panel (Visible for all tabs) */}
        {(activeTab === 'config' || activeTab === 'preview' || activeTab === 'guide') && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden mb-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-700/50">

                {/* Stage 1: Select */}
                <div className="p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-[0_0_10px_rgba(56,189,248,0.5)]">1</span>
                    <span className="text-sm font-semibold uppercase tracking-wide text-slate-300">Select Standard</span>
                  </div>

                  <div className="flex-grow flex flex-col">
                    <div className="flex-grow space-y-4 mb-8">
                      <select
                        aria-label="Select Standard"
                        className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-2.5 text-sm text-slate-100 focus:ring-1 focus:ring-sky-500 outline-none transition-all cursor-pointer font-bold"
                        value={standard.id}
                        onChange={(e) => handleStandardChange(e.target.value)}
                      >
                        <option value="WHITWORTH">{WhitworthStandard.name}</option>
                        <option value="BA">{BAStandard.name}</option>
                        <option value="ME">{MEStandard.name}</option>
                        <option value="BSB">{BSBStandard.name}</option>
                        <option value="BSC">{BSCStandard.name}</option>
                      </select>
                    </div>

                    <div className="pt-4 border-t border-slate-700/40">
                      <div className="flex items-center justify-center mb-3">
                        <p className="text-[10.5px] text-slate-400 font-medium uppercase tracking-widest">Resources</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <a
                          href="https://github.com/matthewmcneill/FusionThreadsGenerator/blob/main/docs/BRITISH_THREADING_OVERVIEW.md"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-sky-400/80 hover:text-sky-300 transition-colors font-bold flex items-center gap-2"
                        >
                          <span className="opacity-20">→</span> British Standards Overview
                        </a>
                        <a
                          href="https://github.com/matthewmcneill/FusionThreadsGenerator/blob/main/README.md"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-sky-400/80 hover:text-sky-300 transition-colors font-bold flex items-center gap-2"
                        >
                          <span className="opacity-20">→</span> App Documentation
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stage 2: Refine */}
                <div className="p-6 flex flex-col gap-4 bg-slate-400/[0.02]">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-[0_0_10px_rgba(56,189,248,0.5)]">2</span>
                    <span className="text-sm font-semibold uppercase tracking-wide text-slate-300">Refine Configuration</span>
                  </div>

                  <div className="space-y-4 flex-grow">
                    {/* Series Selection */}
                    {standard.series.length > 1 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <p className="text-[10.5px] text-slate-400 font-medium uppercase tracking-widest">Designation (Series)</p>
                          <a href={`${standard.docUrl}${standard.seriesAnchor || ''}`} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 text-xs transition-colors leading-none opacity-80 hover:opacity-100">ⓘ</a>
                        </div>
                        <div className="flex flex-wrap justify-center gap-x-5 gap-y-1">
                          {standard.series.map(s => (
                            <label key={s} className="flex items-center gap-2 cursor-pointer group">
                              <input
                                type="checkbox"
                                className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-900"
                                checked={selectedSeries.includes(s)}
                                onChange={() => toggleSeries(s)}
                              />
                              <span className="text-xs text-slate-400 group-hover:text-white transition-colors font-bold tracking-tight">{s}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tolerance Class */}
                    {standard.classes.length > 1 && (
                      <div className="space-y-2 pt-3 border-t border-slate-700/40">
                        <div className="flex items-center justify-center gap-2">
                          <p className="text-[10.5px] text-slate-400 font-medium uppercase tracking-widest">Class (Tolerance)</p>
                          <a href={`${standard.docUrl}${standard.classAnchor || ''}`} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 text-xs transition-colors leading-none opacity-80 hover:opacity-100">ⓘ</a>
                        </div>
                        <div className="flex flex-wrap justify-center gap-x-5 gap-y-1">
                          {standard.classes.map(c => (
                            <label key={c} className="flex items-center gap-2 cursor-pointer group">
                              <input
                                type="checkbox"
                                className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-900"
                                checked={selectedClasses.includes(c)}
                                onChange={() => toggleClass(c)}
                              />
                              <span className="text-xs text-slate-400 group-hover:text-white transition-colors font-bold tracking-tight">{c}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Material Options */}
                    <div className="space-y-2 pt-3 border-t border-slate-700/40">
                      <div className="flex items-center justify-center gap-2">
                        <p className="text-[10.5px] text-slate-400 font-medium uppercase tracking-widest">Tap Drill Selection</p>
                        <a href="https://github.com/matthewmcneill/FusionThreadsGenerator/blob/main/docs/DRILL_SPEC.md#2-calculation-philosophy" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 text-xs transition-colors leading-none opacity-80 hover:opacity-100">ⓘ</a>
                      </div>
                      <div className="space-y-1.5 px-4">
                        <select
                          aria-label="Tap Drill Selection"
                          className="w-full bg-slate-950/50 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:ring-1 focus:ring-sky-500 outline-none transition-all cursor-pointer font-bold"
                          value={material}
                          onChange={(e) => setMaterial(e.target.value)}
                        >
                          <option value="hard">Hard Alloys (60% PTE)</option>
                          <option value="ferrous">General Ferrous (70% PTE)</option>
                          <option value="soft">Soft Non-Ferrous (80% PTE)</option>
                        </select>
                      </div>
                    </div>

                    {/* Drill Sets */}
                    <div className="space-y-2 pt-3 border-t border-slate-700/40 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <p className="text-[10.5px] text-slate-400 font-medium uppercase tracking-widest">Drill Bit Sets</p>
                        <a href="https://github.com/matthewmcneill/FusionThreadsGenerator/blob/main/docs/DRILL_SPEC.md#3-drill-set-modeling" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 text-xs transition-colors leading-none opacity-80 hover:opacity-100">ⓘ</a>
                      </div>
                      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
                        {ALL_DRILL_SETS.map(s => (
                          <label key={s} className="flex items-center gap-1.5 cursor-pointer group">
                            <input
                              type="checkbox"
                              className="w-3 h-3 rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-900"
                              checked={selectedDrillSets.includes(s)}
                              onChange={() => toggleDrillSet(s)}
                            />
                            <span className="text-[10px] text-slate-500 group-hover:text-slate-300 transition-colors uppercase tracking-tight font-black">{s}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stage 3: Export */}
                <div className="p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-[0_0_10px_rgba(56,189,248,0.5)]">3</span>
                    <span className="text-sm font-semibold uppercase tracking-wide text-slate-300">Launch Export</span>
                  </div>

                  <div className="flex-grow flex flex-col">
                    <div className="flex-grow flex flex-col justify-center space-y-3 mb-8">
                      <button
                        onClick={handleDownload}
                        disabled={threads.length === 0}
                        className="w-full bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-slate-950 font-black py-4 px-6 rounded-xl shadow-[0_0_20px_rgba(56,189,248,0.2)] disabled:opacity-20 disabled:cursor-not-allowed transform active:scale-[0.98] transition-all text-xs uppercase tracking-widest"
                      >
                        Download XML ({threads.length})
                      </button>
                      <a
                        href="https://github.com/matthewmcneill/FusionThreadsGenerator#installation-in-fusion-360"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-sky-400/80 hover:text-sky-300 transition-colors font-bold flex items-center gap-2"
                      >
                        <span className="opacity-20">→</span> Installation Guide
                      </a>
                    </div>

                    <div className="pt-4 border-t border-slate-700/40">
                      <div className="flex items-center justify-center mb-3">
                        <p className="text-[10.5px] text-slate-400 font-medium uppercase tracking-widest">Thread Management</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <a
                          href="https://apps.autodesk.com/FUSION/en/Detail/Index?id=1725038115223093226"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-sky-400/80 hover:text-sky-300 transition-colors font-bold flex items-center gap-2"
                        >
                          <span className="opacity-20">→</span> ThreadKeeper (Autodesk Store)
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Toggle - Now below Configuration */}
        <div className="flex bg-slate-900/50 backdrop-blur-md p-1.5 rounded-full border border-slate-700/50 mb-12 shadow-2xl">
          <button
            className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === 'guide' ? 'bg-amber-500 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.4)]' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            onClick={() => setActiveTab('guide')}
          >
            Workshop Guide
          </button>
          <button
            className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === 'config' ? 'bg-sky-500 text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.4)]' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            onClick={() => setActiveTab('config')}
          >
            Configuration
          </button>
          <button
            className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === 'preview' ? 'bg-sky-500 text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.4)]' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            onClick={() => setActiveTab('preview')}
          >
            Data Preview
          </button>
        </div>

        {/* Dynamic Content Area */}
        {activeTab === 'config' && (
          <div className="w-full space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <ThreadList
              threads={threads}
              onRemove={handleRemoveThread}
              unit={standard.unit}
            />
            <ThreadForm
              onAdd={handleAddThread}
              currentStandard={standard.name}
              standardId={standard.id}
            />
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <ThreadPreview
              threads={threads}
              selectedClasses={selectedClasses}
              unit={standard.unit}
            />
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <WorkshopGuide />
          </div>
        )}

        <footer className="w-full py-12 border-t border-slate-700/30 mt-12">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <p className="text-slate-400 font-bold text-sm mb-4 tracking-tight">
              Fusion 360 Thread Generator
            </p>
            <p className="text-slate-500 text-[11px] leading-relaxed mb-6">
              Generates custom XML definitions for Whitworth (BSW/BSF), British Association (BA), and Model Engineer (ME) threads.
            </p>
            <div className="flex justify-center items-center gap-4 mb-8 text-sm font-bold tracking-tight">
              <a href="https://github.com/matthewmcneill/FusionThreadsGenerator" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 transition-colors">GitHub Repository</a>
              <span className="text-slate-700">|</span>
              <a href="https://github.com/matthewmcneill/FusionThreadsGenerator/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 transition-colors">GPLv3 License</a>
            </div>
            <div className="text-[10px] text-slate-600 font-mono">
              © {new Date().getFullYear()} Matthew McNeill. All rights reserved.
              <div className="mt-2 opacity-50 uppercase tracking-tighter">
                Version {__APP_VERSION__} ({__COMMIT_HASH__})
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;

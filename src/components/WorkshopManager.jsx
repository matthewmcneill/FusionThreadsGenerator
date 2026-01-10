import React, { useState, useMemo, useEffect } from 'react';
import { BSW_SIZES, BSF_SIZES, WhitworthStandard } from '../utils/calculators/whitworth';
import { BA_SIZES, BAStandard } from '../utils/calculators/ba';
import { ME_SIZES, MEStandard } from '../utils/calculators/me';
import { STANDARD_BSC_SIZES, BSA_HEAVY_SIZES, BSCStandard } from '../utils/calculators/bsc';
import { BSB_SIZES, BSBStandard } from '../utils/calculators/bsb';
import { NUMBER_DRILLS, LETTER_DRILLS, METRIC_DRILLS, FRACTIONAL_DRILLS } from '../utils/drills';
import { generateToolLibrary, parseToolLibrary } from '../utils/toolLibraryGenerator';
import ThreadForm from './ThreadForm';

/**
 * @module WorkshopManager
 * @description Modal/Overlay for managing the user's workshop inventory and active sets.
 */
const WorkshopManager = ({
    isOpen,
    onClose,
    config,
    onUpdateConfig,
    currentStandard
}) => {
    const [activeTab, setActiveTab] = useState('standards'); // 'curation', 'standards', or 'tools'
    const [editingStandardId, setEditingStandardId] = useState(currentStandard.id);
    const [seriesFilter, setSeriesFilter] = useState('All');
    const [expandedToolSet, setExpandedToolSet] = useState(null); // 'Metric', 'Number', etc.
    const [newDrillName, setNewDrillName] = useState('');
    const [newDrillSize, setNewDrillSize] = useState('');
    const [newDrillUnit, setNewDrillUnit] = useState('mm');
    const [importStrategy, setImportStrategy] = useState('merge'); // 'merge' or 'overwrite'
    const [importStatus, setImportStatus] = useState(null);

    // Reset to standards tab whenever the modal is opened
    useEffect(() => {
        if (isOpen) {
            setActiveTab('standards');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const ALL_STANDARDS_MAP = {
        'WHITWORTH': WhitworthStandard,
        'BA': BAStandard,
        'ME': MEStandard,
        'BSB': BSBStandard,
        'BSC': BSCStandard
    };

    const ALL_STANDARDS = Object.values(ALL_STANDARDS_MAP);
    const editingStandard = ALL_STANDARDS_MAP[editingStandardId] || WhitworthStandard;

    const ALL_DRILL_SETS = ['Metric', 'Number', 'Letter', 'Imperial'];

    const toggleStandard = (id) => {
        const enabled = config.workshop.enabledStandards.includes(id)
            ? config.workshop.enabledStandards.filter(s => s !== id)
            : [...config.workshop.enabledStandards, id];

        if (enabled.length === 0) return;
        onUpdateConfig('workshop', { enabledStandards: enabled });
    };

    const toggleDrillSet = (name) => {
        const enabled = config.workshop.enabledDrillSets.includes(name)
            ? config.workshop.enabledDrillSets.filter(s => s !== name)
            : [...config.workshop.enabledDrillSets, name];

        onUpdateConfig('workshop', { enabledDrillSets: enabled });
    };

    const toggleDrillBit = (name) => {
        const disabled = config.workshop.disabledDrills || [];
        const updated = disabled.includes(name)
            ? disabled.filter(d => d !== name)
            : [...disabled, name];

        onUpdateConfig('workshop', { disabledDrills: updated });
    };

    const bulkToggleDrills = (setName, disableAll) => {
        let drills = [];
        if (setName === 'Metric') drills = METRIC_DRILLS;
        if (setName === 'Number') drills = NUMBER_DRILLS;
        if (setName === 'Letter') drills = LETTER_DRILLS;
        if (setName === 'Imperial') drills = FRACTIONAL_DRILLS;

        const drillNames = drills.map(d => d.name);
        const currentDisabled = config.workshop.disabledDrills || [];

        let updated;
        if (disableAll) {
            updated = Array.from(new Set([...currentDisabled, ...drillNames]));
        } else {
            updated = currentDisabled.filter(d => !drillNames.includes(d));
        }

        onUpdateConfig('workshop', { disabledDrills: updated });
    };

    const handleAddCustomDrill = (e) => {
        e.preventDefault();
        if (!newDrillName || !newDrillSize) return;

        const size = parseFloat(newDrillSize);
        const drill = {
            name: newDrillName,
            size: newDrillUnit === 'in' ? size : size / 25.4,
            sizeMm: newDrillUnit === 'mm' ? size : size * 25.4,
            unit: newDrillUnit,
            type: 'custom'
        };

        onUpdateConfig('workshop', {
            customDrills: [...config.workshop.customDrills, drill]
        });

        setNewDrillName('');
        setNewDrillSize('');
    };

    const removeCustomDrill = (index) => {
        const updated = config.workshop.customDrills.filter((_, i) => i !== index);
        onUpdateConfig('workshop', { customDrills: updated });
    };

    // --- Curation Management ---

    const getPresetsForStd = (id) => {
        switch (id) {
            case 'WHITWORTH': return [...BSW_SIZES, ...BSF_SIZES];
            case 'BA': return BA_SIZES;
            case 'ME': return ME_SIZES;
            case 'BSC': return [...STANDARD_BSC_SIZES, ...BSA_HEAVY_SIZES];
            case 'BSB': return BSB_SIZES;
            default: return [];
        }
    };

    const activePresets = getPresetsForStd(editingStandardId);
    const disabledForStd = config.workshop.disabledDesignations[editingStandardId] || [];
    const customForStd = config.workshop.customDesignations[editingStandardId] || [];

    const toggleDesignation = (designation) => {
        const disabled = disabledForStd.includes(designation)
            ? disabledForStd.filter(d => d !== designation)
            : [...disabledForStd, designation];

        onUpdateConfig('workshop', {
            disabledDesignations: {
                ...config.workshop.disabledDesignations,
                [editingStandardId]: disabled
            }
        });
    };

    const handleAddCustomDesignation = (input) => {
        onUpdateConfig('workshop', {
            customDesignations: {
                ...config.workshop.customDesignations,
                [editingStandardId]: [...customForStd, { ...input, staysWithStd: true }]
            }
        });
    };

    const removeCustomDesignation = (index) => {
        const updated = customForStd.filter((_, i) => i !== index);
        onUpdateConfig('workshop', {
            customDesignations: {
                ...config.workshop.customDesignations,
                [editingStandardId]: updated
            }
        });
    };

    const bulkSetPresets = (disableAll, filter = 'All') => {
        const allPresets = getPresetsForStd(editingStandardId);
        const affected = filter === 'All'
            ? allPresets
            : allPresets.filter(p => p.series === filter);

        const affectedNames = affected.map(p => p.designation);

        let updated;
        if (disableAll) {
            // Add all affected to disabled list if not already there
            updated = Array.from(new Set([...disabledForStd, ...affectedNames]));
        } else {
            // Remove all affected from disabled list
            updated = disabledForStd.filter(d => !affectedNames.includes(d));
        }

        onUpdateConfig('workshop', {
            disabledDesignations: {
                ...config.workshop.disabledDesignations,
                [editingStandardId]: updated
            }
        });
    };

    const handleExportLibrary = () => {
        const ALL_PRESETS = {
            'WHITWORTH': [...BSW_SIZES, ...BSF_SIZES],
            'BA': BA_SIZES,
            'ME': ME_SIZES,
            'BSC': [...STANDARD_BSC_SIZES, ...BSA_HEAVY_SIZES],
            'BSB': BSB_SIZES
        };
        const lib = generateToolLibrary(config.workshop, ALL_PRESETS, {
            version: __APP_VERSION__,
            commitHash: __COMMIT_HASH__
        });
        const blob = new Blob([JSON.stringify(lib, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `workshop_tools_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImportLibrary = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const ALL_PRESETS = {
                    'WHITWORTH': [...BSW_SIZES, ...BSF_SIZES],
                    'BA': BA_SIZES,
                    'ME': ME_SIZES,
                    'BSC': [...STANDARD_BSC_SIZES, ...BSA_HEAVY_SIZES],
                    'BSB': BSB_SIZES
                };
                const { workshop: updatedWorkshop, stats } = parseToolLibrary(event.target.result, importStrategy, config.workshop, ALL_PRESETS);
                onUpdateConfig('workshop', updatedWorkshop);

                const statsMsg = stats.total === 0
                    ? "The library is empty."
                    : `Imported ${stats.drills} drills and ${stats.taps} taps. ${stats.ignored} items were ignored.`;

                setImportStatus({
                    success: true,
                    message: `Imported successfully using ${importStrategy} strategy. ${statsMsg}`
                });
            } catch (err) {
                setImportStatus({ success: false, message: `Import failed: ${err.message}` });
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />

            <div className="relative bg-slate-900 border border-slate-700/50 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">

                {/* Header & Tabs */}
                <div className="p-6 border-b border-slate-800 bg-slate-900/50">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">Workshop Configuration</h2>
                            <p className="text-slate-400 text-sm">Manage your tooling inventory and curated thread sets.</p>
                        </div>
                        <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all">✕</button>
                    </div>

                    <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-slate-800 mb-8 self-start">
                        <button
                            onClick={() => setActiveTab('standards')}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'standards' ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            Standards
                        </button>
                        <button
                            onClick={() => setActiveTab('curation')}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'curation' ? 'bg-sky-500 text-slate-930 shadow-lg shadow-sky-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            Curation
                        </button>
                        <button
                            onClick={() => setActiveTab('tools')}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'tools' ? 'bg-sky-500 text-slate-900 shadow-lg shadow-sky-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            Drills
                        </button>
                        <button
                            onClick={() => setActiveTab('data')}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'data' ? 'bg-sky-500 text-slate-900 shadow-lg shadow-sky-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            Data
                        </button>
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto p-8">
                    {activeTab === 'standards' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <section>
                                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Enabled Thread Standards</h3>
                                <p className="text-slate-500 text-xs mb-6">Select which standards should be available for project selection on the main dashboard.</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {ALL_STANDARDS.map(std => (
                                        <label key={std.id} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer group ${config.workshop.enabledStandards.includes(std.id) ? 'bg-sky-500/10 border-sky-500/30 text-white' : 'bg-slate-800/20 border-slate-800 text-slate-500 opacity-60'}`}>
                                            <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-sky-500" checked={config.workshop.enabledStandards.includes(std.id)} onChange={() => toggleStandard(std.id)} />
                                            <span className="font-bold text-sm tracking-tight">{std.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'tools' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <section>
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Drill Bit Inventory</h3>
                                        <p className="text-slate-400 text-xs">Manage which drill sets and specific sizes are available in your workshop.</p>
                                    </div>
                                </div>

                                {/* Drill Sets with Detailed Lists */}
                                <div className="space-y-4 mb-12">
                                    {ALL_DRILL_SETS.map(setName => {
                                        const isEnabled = config.workshop.enabledDrillSets.includes(setName);
                                        const isExpanded = expandedToolSet === setName;

                                        // Get actual drill list
                                        let drills = [];
                                        if (setName === 'Metric') drills = METRIC_DRILLS;
                                        if (setName === 'Number') drills = NUMBER_DRILLS;
                                        if (setName === 'Letter') drills = LETTER_DRILLS;
                                        if (setName === 'Imperial') drills = FRACTIONAL_DRILLS;

                                        return (
                                            <div key={setName} className={`rounded-3xl border transition-all overflow-hidden ${isEnabled ? 'border-slate-700 bg-slate-900/40' : 'border-slate-800 bg-slate-900/20 opacity-60'}`}>
                                                <div className="flex items-center justify-between p-4">
                                                    <div className="flex items-center gap-4">
                                                        <input
                                                            type="checkbox"
                                                            className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-sky-500 cursor-pointer"
                                                            checked={isEnabled}
                                                            onChange={() => toggleDrillSet(setName)}
                                                        />
                                                        <div>
                                                            <span className={`text-sm font-bold ${isEnabled ? 'text-white' : 'text-slate-500'}`}>{setName} Set</span>
                                                            <span className="text-[10px] text-slate-500 ml-3">{drills.length} bits</span>
                                                        </div>
                                                    </div>
                                                    {isEnabled && (
                                                        <button
                                                            onClick={() => setExpandedToolSet(isExpanded ? null : setName)}
                                                            className="text-[10px] font-black uppercase tracking-widest text-sky-500 hover:text-sky-400 px-4 py-2 bg-sky-500/5 rounded-xl border border-sky-500/10 transition-all"
                                                        >
                                                            {isExpanded ? 'Hide Individual Drills' : 'Edit Individual Drills'}
                                                        </button>
                                                    )}
                                                </div>

                                                {isExpanded && isEnabled && (
                                                    <div className="border-t border-slate-800 p-6 bg-slate-950/30">
                                                        <div className="flex items-center gap-4 mb-6">
                                                            <button
                                                                onClick={() => bulkToggleDrills(setName, false)}
                                                                className="px-3 py-1.5 bg-slate-800/50 hover:bg-slate-800 text-sky-400 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all border border-slate-700/50"
                                                            >
                                                                Select All {setName}
                                                            </button>
                                                            <button
                                                                onClick={() => bulkToggleDrills(setName, true)}
                                                                className="px-3 py-1.5 bg-slate-800/50 hover:bg-slate-800 text-rose-400 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all border border-slate-700/50"
                                                            >
                                                                Clear All {setName}
                                                            </button>
                                                        </div>
                                                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                                                            {drills.map(drill => {
                                                                const isBitEnabled = !(config.workshop.disabledDrills || []).includes(drill.name);
                                                                return (
                                                                    <label
                                                                        key={drill.name}
                                                                        className={`flex flex-col items-center p-2 rounded-lg border transition-all cursor-pointer ${isBitEnabled ? 'bg-slate-800/50 border-slate-700 text-slate-200' : 'bg-slate-950/50 border-transparent text-slate-700'}`}
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            className="hidden"
                                                                            checked={isBitEnabled}
                                                                            onChange={() => toggleDrillBit(drill.name)}
                                                                        />
                                                                        <span className="text-[10px] font-mono mb-1">{drill.name}</span>
                                                                        <span className="text-[9px] font-black opacity-50">{(drill.unit === 'mm' || drill.sizeMm) ? `${drill.sizeMm?.toFixed(2) || (drill.size * 25.4).toFixed(2)}mm` : `${drill.size.toFixed(3)}"`}</span>
                                                                    </label>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Custom Inventory</h3>
                                <form onSubmit={handleAddCustomDrill} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-slate-950/30 p-6 rounded-3xl border border-slate-800">
                                    <div className="md:col-span-2 flex flex-col gap-1">
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">Drill Name / Label</label>
                                        <input type="text" placeholder="e.g. #7 Jobber" className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white outline-none focus:border-sky-500" value={newDrillName} onChange={(e) => setNewDrillName(e.target.value)} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">Size</label>
                                        <div className="flex gap-2">
                                            <input type="number" step="any" placeholder="5.0" className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white outline-none focus:border-sky-500" value={newDrillSize} onChange={(e) => setNewDrillSize(e.target.value)} />
                                            <select className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-400 font-bold outline-none" value={newDrillUnit} onChange={(e) => setNewDrillUnit(e.target.value)}>
                                                <option value="mm">mm</option>
                                                <option value="in">in</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="pt-5">
                                        <button type="submit" className="w-full h-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-sky-500/10">Add Custom</button>
                                    </div>
                                </form>

                                <div className="space-y-2">
                                    {config.workshop.customDrills.length === 0 ? (
                                        <p className="text-slate-600 text-xs text-center py-8 italic border border-slate-800/50 border-dashed rounded-3xl">No custom drills in your inventory.</p>
                                    ) : config.workshop.customDrills.map((drill, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-slate-900/50 p-4 rounded-2xl border border-slate-800/50 hover:border-slate-700 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-2 h-2 rounded-full bg-sky-500" />
                                                <span className="text-white text-sm font-bold">{drill.name}</span>
                                                <span className="text-slate-500 text-[10px] bg-slate-800 px-2 py-0.5 rounded uppercase font-black tracking-tight">{drill.unit === 'mm' ? `${drill.sizeMm?.toFixed(2)} mm` : `${drill.size?.toFixed(3)} in`}</span>
                                            </div>
                                            <button onClick={() => removeCustomDrill(idx)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-red-400/10 transition-all">✕</button>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'curation' && (
                        <div className="animate-in fade-in duration-300">
                            {/* Standard & Series Navigation */}
                            <div className="flex flex-col md:flex-row gap-6 mb-8 bg-slate-950/30 p-6 rounded-3xl border border-slate-800">
                                <div className="flex-grow">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">Active Standard to Edit</label>
                                    <div className="flex flex-wrap gap-2">
                                        {ALL_STANDARDS.filter(s => config.workshop.enabledStandards.includes(s.id)).map(s => (
                                            <button
                                                key={s.id}
                                                onClick={() => { setEditingStandardId(s.id); setSeriesFilter('All'); }}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${editingStandardId === s.id ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                                            >
                                                {s.id}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="w-full md:w-64">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">Filter by Series</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['All', ...(editingStandard.series || [])].map(series => (
                                            <button
                                                key={series}
                                                onClick={() => setSeriesFilter(series)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${seriesFilter === series ? 'bg-slate-700 text-white border border-slate-600' : 'text-slate-500 hover:text-slate-300'}`}
                                            >
                                                {series}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Curation: {editingStandard.name}</h3>
                                    <p className="text-slate-400 text-xs">Included sizes will be available for project modeling and export.</p>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => bulkSetPresets(false, seriesFilter)} className="px-4 py-2 bg-slate-800/50 hover:bg-slate-800 text-sky-400 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all border border-slate-700/50">Select All {seriesFilter === 'All' ? '' : seriesFilter}</button>
                                    <button onClick={() => bulkSetPresets(true, seriesFilter)} className="px-4 py-2 bg-slate-800/50 hover:bg-slate-800 text-rose-400 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all border border-slate-700/50">Clear All {seriesFilter === 'All' ? '' : seriesFilter}</button>
                                </div>
                            </div>

                            {/* Detailed List View */}
                            <section className="bg-slate-950/20 rounded-3xl border border-slate-800/50 overflow-hidden mb-12">
                                <ThreadForm
                                    onAdd={handleAddCustomDesignation}
                                    currentStandard={editingStandard.name}
                                    standardId={editingStandardId}
                                    inline
                                    defaultSeries={seriesFilter === 'All' ? (editingStandard.series?.[0] || 'Custom') : seriesFilter}
                                />

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-800/30 text-[10px] font-black uppercase tracking-widest text-slate-500 border-y border-slate-700/50">
                                                <th className="px-6 py-4 w-16">Include</th>
                                                <th className="px-6 py-4">Designation</th>
                                                <th className="px-6 py-4 text-center">Nominal Size ({editingStandard.unit})</th>
                                                <th className="px-6 py-4 text-center">{editingStandard.unit === 'in' ? 'TPI' : 'Pitch'}</th>
                                                <th className="px-6 py-4 text-right">Series</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/50">
                                            {/* Custom Designations */}
                                            {customForStd
                                                .filter(c => seriesFilter === 'All' || c.series === seriesFilter)
                                                .map((c, idx) => {
                                                    const isEnabled = c.enabled !== false;
                                                    const toggleCustom = () => {
                                                        const updated = [...customForStd];
                                                        updated[idx] = { ...updated[idx], enabled: !isEnabled };
                                                        onUpdateConfig('workshop', {
                                                            customDesignations: {
                                                                ...config.workshop.customDesignations,
                                                                [editingStandardId]: updated
                                                            }
                                                        });
                                                    };

                                                    return (
                                                        <tr key={`custom-${idx}`} className={`group hover:bg-sky-500/[0.02] transition-colors ${!isEnabled ? 'opacity-40 grayscale' : ''}`}>
                                                            <td className="px-6 py-4">
                                                                <input
                                                                    type="checkbox"
                                                                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-sky-500 cursor-pointer"
                                                                    checked={isEnabled}
                                                                    onChange={toggleCustom}
                                                                />
                                                            </td>
                                                            <td className={`px-6 py-4 font-bold text-sm ${isEnabled ? 'text-white' : 'text-slate-500'}`}>{c.designation}</td>
                                                            <td className="px-6 py-4 text-center text-slate-300 text-sm font-mono">{c.nominalFraction || c.size}</td>
                                                            <td className="px-6 py-4 text-center text-slate-300 text-sm font-mono">{c.tpi || c.pitch}</td>
                                                            <td className="px-6 py-4 text-right">
                                                                <div className="flex items-center justify-end gap-3">
                                                                    <span className="text-[9px] font-black uppercase tracking-tighter bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded border border-amber-500/20">{c.series || 'Custom'}</span>
                                                                    <button
                                                                        onClick={() => removeCustomDesignation(idx)}
                                                                        className="text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                                                        title="Permanently remove"
                                                                    >✕</button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}

                                            {/* Presets */}
                                            {activePresets
                                                .filter(p => seriesFilter === 'All' || p.series === seriesFilter)
                                                .map((p) => {
                                                    const isEnabled = !disabledForStd.includes(p.designation);
                                                    return (
                                                        <tr key={`preset-${p.designation}`} className={`group hover:bg-sky-500/[0.02] transition-colors ${!isEnabled ? 'opacity-40 grayscale' : ''}`}>
                                                            <td className="px-6 py-4">
                                                                <input
                                                                    type="checkbox"
                                                                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-sky-500 cursor-pointer"
                                                                    checked={isEnabled}
                                                                    onChange={() => toggleDesignation(p.designation)}
                                                                />
                                                            </td>
                                                            <td className={`px-6 py-4 font-bold text-sm ${isEnabled ? 'text-slate-200' : 'text-slate-500'}`}>{p.designation}</td>
                                                            <td className="px-6 py-4 text-center text-slate-400 text-sm font-mono">{p.nominalFraction || p.size}</td>
                                                            <td className="px-6 py-4 text-center text-slate-400 text-sm font-mono">{p.tpi || p.pitch}</td>
                                                            <td className="px-6 py-4 text-right">
                                                                <span className="text-[9px] font-black uppercase tracking-tighter bg-slate-800 text-slate-500 px-2 py-0.5 rounded border border-slate-700/50">{p.series}</span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </div>
                    )}
                    {activeTab === 'data' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <section>
                                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Export Workshop Configuration</h3>
                                <p className="text-slate-400 text-xs mb-6">Download your inventory as a Fusion 360 Tool Library (.json). This serves as a backup and allows you to load these tools directly into Fusion 360 CAM.</p>
                                <button
                                    onClick={handleExportLibrary}
                                    className="px-8 py-4 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-sky-500/10"
                                >
                                    📥 Download Fusion 360 Tool Library
                                </button>
                            </section>

                            <section className="pt-8 border-t border-slate-800">
                                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Import Workshop Configuration</h3>
                                <div className="bg-slate-950/30 p-8 rounded-3xl border border-slate-800">
                                    <p className="text-slate-400 text-xs mb-8">Upload a Fusion 360 (.json) tool library to restore or update your workshop. Drills and Taps will be matched to their standard definitions.</p>

                                    <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                                        <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-slate-800">
                                            <button
                                                onClick={() => setImportStrategy('merge')}
                                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${importStrategy === 'merge' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                                            >
                                                Merge
                                            </button>
                                            <button
                                                onClick={() => setImportStrategy('overwrite')}
                                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${importStrategy === 'overwrite' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                                            >
                                                Overwrite
                                            </button>
                                        </div>

                                        <div className="flex-grow">
                                            <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-slate-700 hover:border-sky-500/50 rounded-2xl p-6 transition-all cursor-pointer group bg-slate-900/40">
                                                <input
                                                    type="file"
                                                    accept=".json,.tools"
                                                    className="hidden"
                                                    onChange={handleImportLibrary}
                                                />
                                                <span className="text-xs font-bold text-slate-300 group-hover:text-sky-400 mb-1">Click to Upload JSON</span>
                                                <span className="text-[10px] text-slate-500 italic">Select your exported tool library</span>
                                            </label>
                                        </div>
                                    </div>

                                    {importStatus && (
                                        <div className={`p-4 rounded-xl border text-xs font-bold animate-in zoom-in-95 duration-200 ${importStatus.success ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
                                            {importStatus.message}
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-slate-800 flex justify-end bg-slate-900/50">
                    <button onClick={onClose} className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black uppercase tracking-widest py-3 px-8 rounded-xl text-xs transition-all active:scale-95 shadow-lg shadow-sky-500/20">
                        Exit Configuration
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WorkshopManager;

import React, { useState, useEffect, useRef } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const threadData = {
    bsw: {
        id: 'bsw',
        name: 'BSW',
        fullName: 'British Standard Whitworth',
        angle: '55°',
        profile: 'Coarse',
        badge: 'Heavy Engineering',
        desc: "The world's first national screw thread standard, introduced by Sir Joseph Whitworth in 1841. Derived from the empirical average of existing best practices, it features a 55° angle with rounded roots and crests to reduce stress concentration.",
        usage: 'Essential for heavy machinery and agricultural equipment. The coarse pitch provides deep engagement, making it ideal for threading into soft or brittle materials like cast iron.',
        suitedFor: ['Cast Iron Components', 'Heavy Machinery', 'General Assembly (Pre-1950)', 'Steam Engines'],
        notes: 'Rounding the roots was a deliberate choice to prevent stress-risers. Note: A 1/2" BSW bolt has 12 TPI, while 1/2" UNC has 13 TPI. Do not mix them!',
        link: 'https://github.com/matthewmcneill/FusionThreadsGenerator/blob/main/docs/WHITWORTH_SPEC.md',
        officialLink: 'https://shop.bsigroup.com/products/parallel-screw-threads-of-whitworth-form-requirements',
        densityScore: 30,
        deepDives: [
            {
                icon: '📜',
                title: 'Whitworth Revolution (1841)',
                desc: 'Prior to 1841, screw threads were bespoke artifacts. Whitworth transformed engineering by deriving a standard from the average of best practices across Britain.'
            },
            {
                icon: '🛠️',
                title: 'Technical Rationale',
                desc: 'Whitworth chose 55° for its strength-to-manufacturing balance. Rounded roots were a breakthrough to prevent the "stress-risers" that caused fatigue failure.',
                highlight: true
            }
        ],
        extraChart: {
            title: 'The "Coarse vs Fine" TPI Gap',
            desc: 'BSW (Coarse) provides much deeper engagement than BSF for any given diameter.',
            type: 'line',
            labels: ['1/4', '3/8', '1/2', '5/8', '3/4', '1'],
            datasets: [
                { label: 'BSW (Coarse)', data: [20, 16, 12, 11, 10, 8], borderColor: '#d97706' },
                { label: 'BSF (Fine)', data: [26, 20, 16, 14, 12, 10], borderColor: '#0f172a' }
            ]
        }
    },
    bsf: {
        id: 'bsf',
        name: 'BSF',
        fullName: 'British Standard Fine',
        angle: '55°',
        profile: 'Fine',
        badge: 'Automotive & Aero',
        desc: 'Introduced in 1908 as a finer alternative to BSW. While it retains the 55° Whitworth form, the finer pitch increases the tensile strength by maintaining a larger core diameter.',
        usage: 'The standard for British automotive engineering (MG, Triumph, Jaguar) and early aviation (e.g., the Rolls-Royce Merlin). The shallower helix angle provides superior resistance to loosening under vibration.',
        suitedFor: ['Automotive Chassis/Engines', 'Vibration-prone Steel Bolts', 'High-tensile applications'],
        notes: 'Often used where a stud needs BSW on the "block" end and BSF on the "nut" end to maximize grip and vibration resistance respectively.',
        link: 'https://github.com/matthewmcneill/FusionThreadsGenerator/blob/main/docs/WHITWORTH_SPEC.md',
        officialLink: 'https://shop.bsigroup.com/products/parallel-screw-threads-of-whitworth-form-requirements',
        densityScore: 60,
        deepDives: [
            {
                icon: '🏎️',
                title: 'Automotive Dominance',
                desc: 'From the MG TC to the Jaguar E-Type, BSF was the backbone of the British motor industry, providing the vibration resistance coarse threads lacked.'
            },
            {
                icon: '✈️',
                title: 'The Merlin Connection',
                desc: 'The Rolls-Royce Merlin engine relied on BSF. Its shallow helix angle kept critical aero-engine components tight under extreme temperature and vibration cycles.',
                highlight: true
            }
        ],
        extraChart: {
            title: 'Tensile Core Advantage',
            desc: 'BSF has a larger core diameter than BSW, allowing for higher torque and tensile loading.',
            type: 'bar',
            labels: ['1/4", 3/8", 1/2", 5/8", 3/4"'],
            datasets: [
                { label: 'Core Area Increase % (BSF vs BSW)', data: [12, 11, 14, 12, 15], backgroundColor: 'rgba(217, 119, 6, 0.7)' }
            ]
        }
    },
    ba: {
        id: 'ba',
        name: 'BA',
        fullName: 'British Association',
        angle: '47.5°',
        profile: 'Miniature/Metric',
        badge: 'Instruments & Models',
        desc: 'A specialized "metric" thread developed in 1884 for scientific instruments. It uses a unique 47.5° angle and a logical, geometric progression where pitch shrinks as the number index increases.',
        usage: 'Ubiquitous in British electrical fittings, vintage Lucas automotive electronics, and live-steam model engineering. The rounded form provides excellent fatigue resistance for small diameters.',
        suitedFor: ['Model Steam Engines', 'Scientific Instruments', 'Vintage Electrical Gear', 'Small Mechanical Devices'],
        notes: '0BA is the largest (6.0mm). A 2BA thread is roughly comparable to 3/16" and is one of the most common fasteners in vintage British electronics.',
        link: 'https://github.com/matthewmcneill/FusionThreadsGenerator/blob/main/docs/BA_SPEC.md',
        officialLink: 'https://shop.bsigroup.com/products/british-association-ba-screw-threads-with-tolerances-for-sizes-0-ba-to-16-ba-requirements',
        densityScore: 90,
        deepDives: [
            {
                icon: '🇨🇭',
                title: 'The Swiss Connection',
                desc: 'BA is essentially a British adoption of the Swiss "Thury" thread. It is a metric-based system (0BA = 6mm) hidden in an imperial workshop world.'
            },
            {
                icon: '📉',
                title: 'Logarithmic Genius',
                desc: 'BA sizing follows a strict formula: $Pitch = 0.9^n$ mm. This logarithmic progression ensures that for every increase in index, the pitch reduces by exactly 10%.',
                highlight: true
            }
        ],
        extraChart: {
            title: 'Logarithmic Pitch Decay ($P=0.9^n$)',
            desc: 'Unlike linear systems, BA pitches shrink exponentially as the BA number increase.',
            type: 'line',
            labels: ['0BA', '2BA', '4BA', '6BA', '8BA', '10BA', '12BA', '14BA'],
            datasets: [
                { label: 'Pitch (mm)', data: [1.0, 0.81, 0.66, 0.53, 0.43, 0.35, 0.28, 0.23], borderColor: '#2563eb', fill: true, backgroundColor: 'rgba(37, 99, 235, 0.1)' }
            ]
        }
    },
    bsp: {
        id: 'bsp',
        name: 'BSP (G & R)',
        fullName: 'British Standard Pipe',
        angle: '55°',
        profile: 'Pipe',
        badge: 'Plumbing & Fluid',
        desc: 'The international standard for fluid interconnects. Divided into Parallel (BSPP/G) and Taper (BSPT/R). Nominal sizes refer to the internal bore of the pipe, not the thread diameter.',
        usage: 'Plumbing, pneumatics, and hydraulics. BSPP requires a sealing washer or O-ring, while BSPT seals on the thread itself using a 1:16 taper.',
        suitedFor: ['Home Plumbing', 'Air Compressors', 'Steam Lines', 'Hydraulic Fittings'],
        notes: 'A 1/4" BSP thread actually has a major diameter of roughly 13mm. It is incompatible with American NPT despite similarities.',
        link: 'https://github.com/matthewmcneill/FusionThreadsGenerator/blob/main/docs/BSPP_SPEC.md',
        officialLink: 'https://shop.bsigroup.com/products/pipe-threads-where-pressure-tight-joints-are-not-made-on-the-threads-dimensions-tolerances-and-designation',
        densityScore: 45,
        deepDives: [
            {
                icon: '🚇',
                title: 'The IPS Legacy',
                desc: 'BSP nomenclature is a historical artifact. A 1/2" BSP thread refers to a pipe with a 1/2" *internal* bore. The actual thread OD is closer to 0.825".'
            },
            {
                icon: '💧',
                title: 'Parallel vs Taper',
                desc: 'BSPP (Parallel) is for mechanical fastening with a seal. BSPT (Taper) is for pressure-tight joints where the threads wedge together.',
                highlight: true
            }
        ],
        extraChart: {
            title: 'Bore vs. Thread Outer Diameter',
            desc: 'The nominal size (Bore) is significantly smaller than the actual Major Diameter of the thread.',
            type: 'bar',
            labels: ['1/8"', '1/4"', '3/8"', '1/2"', '3/4"', '1"'],
            datasets: [
                { label: 'Internal Bore (approx)', data: [0.125, 0.25, 0.375, 0.5, 0.75, 1.0], backgroundColor: '#94a3b8' },
                { label: 'Major Thread OD', data: [0.383, 0.518, 0.656, 0.825, 1.041, 1.309], backgroundColor: '#0f172a' }
            ]
        }
    },
    bsb: {
        id: 'bsb',
        name: 'BSB',
        fullName: 'British Standard Brass',
        angle: '55°',
        profile: 'Constant Pitch',
        badge: 'Electrical & Thin Wall',
        desc: 'A specialized thread with a constant pitch of 26 TPI (Threads Per Inch) regardless of diameter. It retains the standard 55° Whitworth form.',
        usage: 'Designed for brass tubing and thin-walled pipes where a coarse thread would cut through the material. Used extensively in lighting fixtures and vintage optical instruments.',
        suitedFor: ['Lighting Fixtures', 'Thin-walled Tubing', 'Optical Instruments', 'Gas fittings'],
        notes: 'Constant 26 TPI is the key identifier. If you find a 26 TPI thread on a bicycle, check the angle; BSC uses 60° while BSB uses 55°.',
        link: 'https://github.com/matthewmcneill/FusionThreadsGenerator/blob/main/docs/BSB_SPEC.md',
        officialLink: 'https://shop.bsigroup.com/products/british-standard-brass-thread',
        densityScore: 70,
        deepDives: [
            {
                icon: '🏮',
                title: 'The Lighting Standard',
                desc: 'Used universally in brass electrical lamp-holders. The 26 TPI pitch allows for a secure grip on very thin spun-brass components.'
            },
            {
                icon: '⚠️',
                title: 'Wall Thickness Safety',
                desc: 'By keeping pitch constant at 26 TPI, the thread depth remains under 0.025", ensuring the tube wall isn\'t accidentally cut through as diameter increases.',
                highlight: true
            }
        ],
        extraChart: {
            title: 'Thread Depth Comparison',
            desc: 'BSB maintains a constant, safe thread depth regardless of pipe size.',
            type: 'line',
            labels: ['1/4"', '1/2"', '3/4"', '1"'],
            datasets: [
                { label: 'BSB Depth (Fixed)', data: [0.024, 0.024, 0.024, 0.024], borderColor: '#d97706', borderDash: [5, 5] },
                { label: 'BSW Depth (Scaling)', data: [0.032, 0.053, 0.064, 0.080], borderColor: '#94a3b8' }
            ]
        }
    },
    conduit: {
        id: 'conduit',
        name: 'BS Conduit',
        fullName: 'BS Conduit (BS 31)',
        angle: '60°',
        profile: 'Electrical',
        badge: 'Wiring',
        desc: 'Also known as ET (Electric Thread). This parallel thread is used for joining steel conduit tubing for electrical wiring systems.',
        usage: 'Mostly found in older industrial or commercial electrical installations. It specifies a 60° thread angle, unlike the 55° of most Whitworth standards.',
        suitedFor: ['Steel Electrical Conduit', 'Cable Glands (Vintage)'],
        notes: 'Standardized under BS 31. The 3/4" size is the most ubiquitous in older British commercial wiring.',
        officialLink: 'https://shop.bsigroup.com/products/specification-for-steel-conduit-and-fittings-for-electrical-wiring',
        densityScore: 50,
        deepDives: [
            {
                icon: '⚡',
                title: 'Electrical Safety',
                desc: 'Conduit threads were designed to ensure mechanical continuity of the steel pipe, which often served as the circuit earth (ground).'
            },
            {
                icon: '📐',
                title: 'Why 60 Degrees?',
                desc: 'Unlike most British threads of the era (55°), Conduit used 60°—possibly for easier manufacturing on standard machinery or better frictional locking in vibration.',
                highlight: true
            }
        ],
        extraChart: {
            title: 'Conduit Standards',
            desc: 'Comparing the most common electrical conduit sizes used in British industry.',
            type: 'bar',
            labels: ['5/8"', '3/4"', '1"', '1-1/4"'],
            datasets: [
                { label: 'TPI (Threads Per Inch)', data: [18, 16, 16, 16], backgroundColor: '#475569' }
            ]
        }
    },
    me: {
        id: 'me',
        name: 'Model Engineer',
        fullName: 'Model Engineer Series',
        angle: '55°',
        profile: 'Miniature',
        badge: 'Hobbyist',
        desc: 'Developed for small-scale steam engines where BSW would be too bulky. It uses a restricted pitch series, typically 32 or 40 TPI regardless of diameter.',
        usage: 'Miniature boilers, stationary steam engines, and small mechanical models. The ultra-fine pitch allows for precise alignment of steam fittings.',
        suitedFor: ['Live Steam Models', 'Small Lathe Tooling', 'Instrument Making'],
        notes: 'Mostly made in-house by model engineers using specialized taps and dies. It is the "gold standard" for small-scale realism.',
        link: 'https://github.com/matthewmcneill/FusionThreadsGenerator/blob/main/docs/ME_SPEC.md',
        densityScore: 80,
        deepDives: [
            {
                icon: '🚂',
                title: 'Live Steam Precision',
                desc: 'In miniature boilers, a 1/4" BSW thread would be too deep. ME 40 TPI allows for steam-tight joints on thin-walled copper boilers.'
            },
            {
                icon: '🏅',
                title: 'SMEE Standards (1912)',
                desc: 'Formalized by the Society of Model and Experimental Engineers to stop the chaos of "one-off" threads in the hobbyist workshop.',
                highlight: true
            }
        ],
        extraChart: {
            title: 'ME Pitch Density',
            desc: 'The ME system simplifies the workshop by using standard 32 and 40 TPI pitches across many diameters.',
            type: 'bar',
            labels: ['1/8"', '3/16"', '1/4"', '5/16"', '3/8"', '1/2"'],
            datasets: [
                { label: 'ME Standard (TPI)', data: [40, 40, 32, 32, 32, 26], backgroundColor: '#d97706' },
                { label: 'BSW Equivalent (TPI)', data: [40, 24, 20, 18, 16, 12], backgroundColor: '#94a3b8' }
            ]
        }
    },
    cycle: {
        id: 'cycle',
        name: 'BSC / CEI',
        fullName: 'British Standard Cycle',
        angle: '60°',
        profile: 'Constant/Fine',
        badge: 'Bicycles',
        desc: 'Originally the CEI standard. It breaks the Whitworth convention by using a 60° thread angle and a constant pitch of 26 TPI for almost all diameters.',
        usage: 'Axles, bottom brackets, and headsets on vintage British bicycles and motorcycles. Designed to resist loosening under high-frequency vibration.',
        suitedFor: ['Vintage Bicycles', 'British Motorcycles', 'Wheel Axles'],
        notes: 'Watch out for 24 TPI bottom brackets—a late exception to the 26 TPI rule. Ensure you check for 60° angle before using a BSB die (55°).',
        link: 'https://github.com/matthewmcneill/FusionThreadsGenerator/blob/main/docs/BSC_SPEC.md',
        officialLink: 'https://shop.bsigroup.com/products/cycle-threads-specification',
        densityScore: 75,
        deepDives: [
            {
                icon: '🚲',
                title: 'The 60° Outlier',
                desc: 'While most British threads use 55°, Cycle threads use 60°. This increases friction, helping fasteners stay tight during road vibration.'
            },
            {
                icon: '🌀',
                title: 'High-Frequency Vibration',
                desc: 'The fine 26 TPI pitch combined with a 60° angle makes it one of the most vibration-resistant mechanical fasteners ever designed.',
                highlight: true
            }
        ],
        extraChart: {
            title: 'Mechanical Strength: BSC vs BSF',
            desc: 'Cycle threads prioritize core diameter and vibration resistance over deep engagement.',
            type: 'line',
            labels: ['1/4"', '5/16"', '3/8"', '7/16"', '1/2"'],
            datasets: [
                { label: 'BSC TPI', data: [26, 26, 26, 26, 26], borderColor: '#16a34a' },
                { label: 'BSF TPI', data: [26, 22, 20, 18, 16], borderColor: '#94a3b8', borderDash: [2, 2] }
            ]
        }
    }
};

const matrixScenarios = [
    { icon: '🚜', title: 'Heavy Iron', desc: 'Working on a tractor or lathe bed.', result: 'bsw' },
    { icon: '🏎️', title: 'Vintage Car', desc: 'Restoring an MG or Triumph chassis.', result: 'bsf' },
    { icon: '🚂', title: 'Live Steam', desc: 'Building a miniature locomotive.', result: 'me' },
    { icon: '🚿', title: 'Plumbing', desc: 'Fitting air lines or water pipes.', result: 'bsp' },
    { icon: '💡', title: 'Lighting', desc: 'Rewiring an old brass lamp.', result: 'bsb' },
    { icon: '⌨️', title: 'Vintage Electronics', desc: 'Fixing a teleprinter or Lucas dynamo.', result: 'ba' },
    { icon: '🚲', title: 'Bicycle', desc: 'Fixing a vintage Raleigh axle.', result: 'cycle' },
];

const WorkshopGuide = () => {
    const [currentSelection, setCurrentSelection] = useState('bsw');
    const detailCardRef = useRef(null);

    const selectThread = (id) => {
        setCurrentSelection(id);
        if (detailCardRef.current) {
            detailCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const selectedData = threadData[currentSelection];

    // Chart configs
    const densityData = {
        labels: ['Current Selection', 'Average Metric', 'Average Fine'],
        datasets: [{
            label: 'Thread Density (Approx TPI Scale)',
            data: [selectedData.densityScore, 50, 70],
            backgroundColor: ['#d97706', '#e5e7eb', '#e5e7eb'],
            borderRadius: 4,
            barThickness: 40
        }]
    };


    return (
        <div className="bg-stone-100 text-stone-800 font-sans antialiased text-left p-4 md:p-8 rounded-xl shadow-inner mb-20">

            {/* Introduction Block */}
            <section className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-slate-500 mb-8">
                <h2 className="text-xl font-bold text-stone-800 mb-2">The Standardization Revolution</h2>
                <p className="text-stone-600 leading-relaxed">
                    Before Sir Joseph Whitworth proposed his standard in 1841, every workshop had its own thread forms. A bolt from London wouldn't fit a nut from Manchester. The <strong>British Standard Whitworth (BSW)</strong> was the world's first national screw thread standard, creating a 55° thread angle with rounded roots and crests. This guide explores the family of threads that evolved from that innovation, helping you identify and apply the right standard for your project.
                </p>
            </section>

            {/* Scenario Selector moved to top */}
            <section className="mb-8">
                <h2 className="text-xl font-bold text-stone-800 mb-4 flex items-center">
                    <span className="mr-2">🧭</span> Workshop Scenario Selector
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
                    {matrixScenarios.map(scenario => (
                        <div
                            key={scenario.title}
                            onClick={() => selectThread(scenario.result)}
                            className="bg-white p-3 rounded border border-stone-200 cursor-pointer hover:border-amber-500 hover:shadow-md transition-all group"
                        >
                            <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">{scenario.icon}</div>
                            <div className="font-bold text-stone-800 text-xs">{scenario.title}</div>
                            <div className="text-[10px] text-stone-500 mt-1 leading-tight">{scenario.desc}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Main Dashboard: Selector & Detail View */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* Navigation Sidebar */}
                <div className="lg:col-span-3 bg-white rounded-lg shadow-sm p-4 sticky top-4">
                    <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-4 border-b pb-2">Select Standard</h3>
                    <nav className="space-y-2">
                        {Object.values(threadData).map(thread => (
                            <button
                                key={thread.id}
                                onClick={() => setCurrentSelection(thread.id)}
                                className={`w-full text-left px-4 py-3 rounded-md transition-colors flex justify-between items-center group
                           ${currentSelection === thread.id ? 'bg-stone-800 text-white' : 'hover:bg-stone-100 text-stone-600'}`}
                            >
                                <span className="font-bold">{thread.name}</span>
                                <span className={`text-xs ${currentSelection === thread.id ? 'text-stone-400' : 'text-stone-400 group-hover:text-stone-500'}`}>{thread.angle}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Detail Panel */}
                <div className="lg:col-span-9 space-y-6">

                    {/* Dynamic Content Card */}
                    <div ref={detailCardRef} className="bg-white rounded-lg shadow-lg overflow-hidden border border-stone-200 min-h-[500px] transition-all duration-300">
                        {/* Header */}
                        <div className="bg-stone-800 text-white p-6 flex justify-between items-start">
                            <div>
                                <span className="bg-amber-600 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">{selectedData.badge}</span>
                                <h2 className="text-3xl font-bold mt-2">{selectedData.name}</h2>
                                <p className="text-stone-300 font-mono text-sm mt-1">{selectedData.fullName} • {selectedData.angle} Angle</p>
                            </div>
                            <div className="text-4xl opacity-20">⚙️</div>
                        </div>

                        {/* Content Grid */}
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* Left Col: Practical Usage */}
                            <div>
                                <h3 className="flex items-center text-lg font-bold text-amber-800 mb-3">
                                    <span className="mr-2">🔧</span> Practical Application
                                </h3>
                                <p className="text-stone-600 mb-4 leading-relaxed">
                                    {selectedData.desc}
                                    <br /><br />
                                    <strong>Application:</strong> {selectedData.usage}
                                </p>

                                <div className="bg-stone-50 p-4 rounded border border-stone-200">
                                    <h4 className="text-sm font-bold text-stone-700 uppercase mb-2">Best Suited For:</h4>
                                    <ul className="space-y-2 text-sm text-stone-600">
                                        {selectedData.suitedFor.map(item => <li key={item}>• {item}</li>)}
                                    </ul>
                                </div>

                                <div className="mt-6">
                                    <h3 className="flex items-center text-lg font-bold text-slate-700 mb-3">
                                        <span className="mr-2">📝</span> Workshop Notes
                                    </h3>
                                    <p className="text-sm text-stone-600 italic border-l-2 border-amber-400 pl-3">
                                        {selectedData.notes}
                                    </p>
                                </div>
                            </div>

                            {/* Right Col: Tech Specs & Visualization */}
                            <div>
                                <h3 className="flex items-center text-lg font-bold text-slate-700 mb-3">
                                    <span className="mr-2">📐</span> Technical Profile
                                </h3>

                                {/* Mini Stat Grid */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-slate-50 p-3 rounded text-center">
                                        <div className="text-xs text-slate-500 uppercase">Thread Angle</div>
                                        <div className="text-xl font-bold text-slate-800">{selectedData.angle}</div>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded text-center">
                                        <div className="text-xs text-slate-500 uppercase">Profile Type</div>
                                        <div className="text-xl font-bold text-slate-800">{selectedData.profile}</div>
                                    </div>
                                </div>

                                {/* Context Chart Container */}
                                <div className="mt-4">
                                    <h4 className="text-xs font-bold text-stone-400 uppercase mb-2 text-center">Relative Thread Density</h4>
                                    <div className="h-48">
                                        <Bar
                                            data={densityData}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                plugins: { legend: { display: false } },
                                                scales: {
                                                    y: { beginAtZero: true, display: false },
                                                    x: { grid: { display: false } }
                                                }
                                            }}
                                        />
                                    </div>
                                    <p className="text-xs text-center text-stone-400 mt-2">Comparison of Threads Per Inch (approx avg)</p>
                                </div>

                                <div className="mt-6 flex flex-col gap-3">
                                    {selectedData.link && (
                                        <a href={selectedData.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md text-sm font-semibold transition-colors border border-stone-300">
                                            📄 GitHub Technical Specification &rarr;
                                        </a>
                                    )}
                                    {selectedData.officialLink && (
                                        <a href={selectedData.officialLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-md text-xs font-medium transition-colors border border-amber-200">
                                            🏛️ Official Standard (BSI) &rarr;
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dynamic Thread Insights & Charts */}
            <section className="mt-8 bg-white rounded-lg shadow-sm overflow-hidden border border-stone-200">
                <div className="bg-stone-50 border-b border-stone-200 px-6 py-4">
                    <h2 className="text-xl font-bold text-stone-800">{selectedData.extraChart?.title || 'Standard Analysis'}</h2>
                    <p className="text-sm text-stone-500 mt-1">{selectedData.extraChart?.desc}</p>
                </div>

                <div className="p-6 md:p-8">
                    <div className="flex flex-col lg:flex-row gap-12 items-center">
                        <div className="w-full lg:w-3/5">
                            <div className="bg-stone-50 rounded-lg p-2 border border-stone-200 h-64 md:h-80">
                                {selectedData.extraChart?.type === 'line' ? (
                                    <Line
                                        data={{
                                            labels: selectedData.extraChart.labels,
                                            datasets: selectedData.extraChart.datasets.map(ds => ({
                                                ...ds,
                                                tension: 0.3,
                                                pointRadius: 4,
                                                pointHoverRadius: 6,
                                            }))
                                        }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: { position: 'bottom', labels: { boxWidth: 12, usePointStyle: true } }
                                            }
                                        }}
                                    />
                                ) : (
                                    <Bar
                                        data={{
                                            labels: selectedData.extraChart.labels,
                                            datasets: selectedData.extraChart.datasets
                                        }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: { position: 'bottom', labels: { boxWidth: 12 } }
                                            }
                                        }}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="w-full lg:w-2/5 space-y-6">
                            {selectedData.deepDives?.map((dive, idx) => (
                                <div
                                    key={idx}
                                    className={`p-5 rounded-lg border-l-4 transition-all ${dive.highlight
                                        ? 'bg-amber-50 border-amber-500 shadow-sm'
                                        : 'bg-slate-50 border-slate-400'
                                        }`}
                                >
                                    <h4 className={`font-bold flex items-center mb-2 ${dive.highlight ? 'text-amber-900' : 'text-slate-900'}`}>
                                        <span className="mr-2 text-xl">{dive.icon}</span>
                                        {dive.title}
                                    </h4>
                                    <p className={`text-sm leading-relaxed ${dive.highlight ? 'text-amber-800' : 'text-slate-700'}`}>
                                        {dive.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>


            {/* Reference Footer */}
            <footer className="mt-12 border-t border-stone-200 pt-8 pb-12 text-center text-stone-500 text-sm">
                <p className="mb-2"><strong>References & Further Reading:</strong></p>
                <div className="flex flex-wrap justify-center gap-4">
                    <a href="https://en.wikipedia.org/wiki/Machinery%27s_Handbook" target="_blank" rel="noopener noreferrer" className="hover:text-amber-700 underline">Machinery's Handbook</a>
                    <span>•</span>
                    <a href="https://shop.bsigroup.com/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-700 underline">BSI Group Official</a>
                    <span>•</span>
                    <a href="#" className="hover:text-amber-700 underline">Tubal Cain's Guides</a>
                </div>
                <p className="mt-8 text-stone-400">Designed for the Home Workshop. Always measure twice.</p>
            </footer>

        </div>
    );
};

export default WorkshopGuide;

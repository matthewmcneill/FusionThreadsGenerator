import React from 'react';

/**
 * @component EngagementMeter
 * @description Sleek, inline graphical visualization of thread engagement.
 * shows actual engagement vs material target on a color-coded scale.
 */
const EngagementMeter = ({ engagement, range, status }) => {
    if (!range) return null;

    // Normalize percentages for CSS (0-100 range)
    const actualPos = Math.min(100, Math.max(0, engagement));
    const targetPos = range.target;

    // Define color segments for the backdrop bar
    // Red (<25), Red/Amber (25-35), Amber (35-min), Green (min-max), Amber (max-90), Red (>90)
    const gradient = `linear-gradient(to right, 
        #ef4444 0%, #ef4444 25%, 
        #f59e0b 25%, #f59e0b ${range.min}%, 
        #10b981 ${range.min}%, #10b981 ${range.max}%, 
        #f59e0b ${range.max}%, #f59e0b 90%, 
        #ef4444 90%, #ef4444 100%)`;

    return (
        <div style={{ width: '100%', marginTop: '0.5rem' }}>
            {/* The Track */}
            <div style={{
                position: 'relative',
                height: '4px',
                width: '100%',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '2px',
                marginBottom: '0.4rem',
                overflow: 'visible'
            }}>
                {/* Color Zones Background */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: gradient,
                    opacity: 0.6,
                    borderRadius: '2px'
                }} />

                {/* Target Marker (Hollow Circle) */}
                <div style={{
                    position: 'absolute',
                    left: `${targetPos}%`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    border: '2px solid white',
                    boxShadow: '0 0 4px rgba(0,0,0,0.5)',
                    zIndex: 2
                }} title="Target" />

                {/* Actual Marker (Solid Dot) */}
                <div style={{
                    position: 'absolute',
                    left: `${actualPos}%`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'white',
                    boxShadow: '0 0 8px rgba(255,255,255,0.8)',
                    zIndex: 3
                }} title="Actual" />
            </div>

            {/* Labels */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.65rem',
                fontFamily: 'monospace',
                opacity: 0.8
            }}>
                <span>{Math.round(engagement)}% Eng.</span>
                <span style={{
                    color: status.startsWith('catastrophic') || status.startsWith('danger') ? '#ef4444' :
                        status.startsWith('warning') ? '#f59e0b' : '#10b981',
                    fontWeight: 'bold'
                }}>
                    {status.replace(/-/g, ' ').toUpperCase()}
                </span>
            </div>
        </div>
    );
};

export default EngagementMeter;

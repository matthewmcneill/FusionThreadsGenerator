
import React, { useState } from 'react';
import ThreadForm from './components/ThreadForm';
import ThreadList from './components/ThreadList';
import { calculateWhitworth, calculateBA, WhitworthStandard, BAStandard } from './utils/calculators';
import { generateFusionXML } from './utils/xmlGenerator';

function App() {
  const [threads, setThreads] = useState([]);
  const [standard, setStandard] = useState(WhitworthStandard);

  const handleStandardChange = (newStandardType) => {
    if (newStandardType === 'Whitworth') {
      setStandard(WhitworthStandard);
    } else {
      setStandard(BAStandard);
    }
    // Clear threads when standard changes to avoid mixing units in one XML?
    // Or keep them but warn? For Fusion XML, it's safer to have one standard per file.
    setThreads([]);
  };

  const handleAddThread = (input) => {
    let calc;
    if (standard.name === 'Whitworth') {
      calc = calculateWhitworth(input.size, input.tpi);
    } else {
      calc = calculateBA(input.size); // BA size is the number string
    }

    if (!calc) return;

    const newThread = {
      ...input,
      ...calc
    };

    setThreads([...threads, newThread]);
  };

  const handleRemoveThread = (index) => {
    const newList = [...threads];
    newList.splice(index, 1);
    setThreads(newList);
  };

  const handleDownload = () => {
    const xml = generateFusionXML(standard, threads);
    const blob = new Blob([xml], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${standard.name.replace(/\s+/g, '_')}_Custom.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="App">
      <h1>Fusion 360 Thread Generator</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Create custom XML definitions for Whitworth (BSW/BSF) or British Association (BA) threads.
      </p>

      <ThreadForm
        onAdd={handleAddThread}
        currentStandard={standard.name}
        onStandardChange={handleStandardChange}
      />

      <ThreadList threads={threads} onRemove={handleRemoveThread} unit={standard.unit} />

      {threads.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <button
            onClick={handleDownload}
            style={{
              padding: '1rem 2rem',
              fontSize: '1.2rem',
              background: 'linear-gradient(to right, #38bdf8, #818cf8)',
              color: 'white',
              border: 'none',
              boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)'
            }}
          >
            Download {standard.name} XML
          </button>
        </div>
      )}
    </div>
  );
}

export default App;

import React, { useState } from 'react';
import './App.css';
import { RecorderControls } from './components/RecorderControls';
import { TranscriptDisplay } from './components/TranscriptDisplay';
import { FontSizeControls } from './components/FontSizeControls';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';

const App: React.FC = () => {
  const {
    transcript,
    interimTranscript,
    finalTranscript,
    isListening,
    isSupported,
    start,
    stop,
    reset,
  } = useSpeechRecognition();

  const [fontSize, setFontSize] = useState<number>(18);

  if (!isSupported) {
    return <div className="container">Speech recognition is not supported in this browser. Please use Safari.</div>;
  }

  return (
    <div className="container">
      <div className="card">
        <TranscriptDisplay lines={finalTranscript} interimTranscript={interimTranscript} fontSize={fontSize} />
        <div className="controls-container">
          <div className="controls-spacer" />
          <RecorderControls
            isListening={isListening}
            hasTranscript={!!transcript}
            onStart={start}
            onStop={stop}
            onReset={reset}
          />
          <FontSizeControls fontSize={fontSize} onFontSizeChange={setFontSize} />
        </div>
      </div>
    </div>
  );
};

export default App;

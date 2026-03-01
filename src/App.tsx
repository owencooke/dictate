import React from 'react';
import './App.css';
import { RecorderControls } from './components/RecorderControls';
import { TranscriptDisplay } from './components/TranscriptDisplay';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';

const App: React.FC = () => {
  const {
    transcript,
    interimTranscript,
    // finalTranscript could be used elsewhere if needed
    isListening,
    isSupported,
    start,
    stop,
    reset,
  } = useSpeechRecognition();

  if (!isSupported) {
    return <div className="container">Speech recognition is not supported in this browser. Please use Safari.</div>;
  }

  return (
    <div className="container">
      <h1 className="title">Dictate</h1>
      <div className="card">
      <TranscriptDisplay transcript={transcript} interimTranscript={interimTranscript} />
      <RecorderControls
        isListening={isListening}
        hasTranscript={!!transcript}
        onStart={start}
        onStop={stop}
        onReset={reset}
      />
      </div>
    </div>
  );
};

export default App;

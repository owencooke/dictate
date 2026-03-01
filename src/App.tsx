import React from 'react';
import './App.css';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { TranscriptDisplay } from './components/TranscriptDisplay';
import { RecorderControls } from './components/RecorderControls';

const App: React.FC = () => {
  const { transcript, isListening, isSupported, start, stop, reset } = useSpeechRecognition();

  if (!isSupported) {
    return <div className="container">Speech recognition is not supported in this browser. Please use Safari.</div>;
  }

  return (
    <div className="container">
      <TranscriptDisplay transcript={transcript} />
      <RecorderControls
        isListening={isListening}
        hasTranscript={!!transcript}
        onStart={start}
        onStop={stop}
        onReset={reset}
      />
    </div>
  );
};

export default App;

import React from 'react';
import { FiMic, FiRefreshCw, FiSquare } from 'react-icons/fi';

interface RecorderControlsProps {
  isListening: boolean;
  hasTranscript: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
}

export const RecorderControls: React.FC<RecorderControlsProps> = ({
  isListening,
  hasTranscript,
  onStart,
  onStop,
  onReset,
}) => (
  <div className="button-container">
      <div className="recorder-controls">
        <button
          className={`btn mic-button ${isListening ? 'listening' : ''}`}
          onClick={onStart}
          disabled={isListening}
          aria-label="Start recording"
        >
          <FiMic />
        </button>
        <button
          className="btn stop-button"
          onClick={onStop}
          disabled={!isListening}
          aria-label="Stop recording"
        >
          <FiSquare />
        </button>
        <button
          className="btn reset-button"
          onClick={onReset}
          aria-label="Reset transcription"
        >
          <FiRefreshCw />
        </button>
      </div>
  </div>
);

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
    {hasTranscript && !isListening ? (
      <button onClick={onReset} className="button restart-button">🔄</button>
    ) : (
      <button
        onClick={isListening ? onStop : onStart}
        className={`button ${isListening ? 'stop-button' : 'start-button'}`}
      >
        {isListening ? '⏹️' : '🎤'}
      </button>
    )}
  </div>
);

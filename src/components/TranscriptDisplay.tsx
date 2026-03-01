interface TranscriptDisplayProps {
  transcript: string;
}

export const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ transcript }) => (
  <div className="text-container">
    <p>{transcript || <span className="placeholder">Tap the mic to start speaking...</span>}</p>
  </div>
);

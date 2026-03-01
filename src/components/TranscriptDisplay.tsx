import React from "react";

interface TranscriptDisplayProps {
  /** concatenated final+interim for legacy purposes */
  transcript: string;
  /** the most recent interim segment, not persisted */
  interimTranscript?: string;
}

export const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ transcript, interimTranscript }) => {
  // split finalized text into lines, drop empty ones
  const finalLines = transcript
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);

  const textContainerRef = React.useRef<HTMLDivElement>(null);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  // auto-scroll when either transcript or interimTranscript change
  React.useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcript, interimTranscript]);

  return (
    <div className="text-container" ref={textContainerRef}>
      {finalLines.length > 0 ? (
        finalLines.map((line, i) => (
          <p key={i} className="transcript-line">
            {line}
          </p>
        ))
      ) : (
        <span className="placeholder">Tap the mic to start speaking...</span>
      )}
      {interimTranscript && interimTranscript.length > 0 && (
        <p className="interim-line">{interimTranscript}</p>
      )}
      {/* sentinel to scroll into view */}
      <div ref={bottomRef} />
    </div>
  );
};

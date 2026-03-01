import React from "react";
import { FiArrowDown } from 'react-icons/fi';

interface Line {
  text: string;
  timestamp: string;
}

interface TranscriptDisplayProps {
  lines: Line[];
  interimTranscript?: string;
  fontSize: number;
}

export const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ lines, interimTranscript, fontSize }) => {
  const textContainerRef = React.useRef<HTMLDivElement>(null);
  const bottomRef = React.useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = React.useState(false);

  // auto-scroll when new lines or interim arrive
  React.useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [lines, interimTranscript]);

  // scroll detection to show/hide the scroll-to-bottom button
  React.useEffect(() => {
    const el = textContainerRef.current;
    if (!el) return;

    const onScroll = () => {
      const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 20;
      setShowScrollButton(!nearBottom);
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    // run once to set initial state
    onScroll();

    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="text-container" ref={textContainerRef}>
        <div style={{ fontSize: `${fontSize}px` }}>
          {lines && lines.length > 0 ? (
            lines.map((line, i) => (
              <p key={i} className="transcript-line">
                <span className="timestamp">{line.timestamp}</span>
                <span className="line-text">{line.text}</span>
              </p>
            ))
          ) : (
            <span className="placeholder">Tap the mic to start speaking...</span>
          )}

          {interimTranscript && interimTranscript.length > 0 && (
            <p className="interim-line">{interimTranscript}</p>
          )}
        </div>

        {showScrollButton && (
          <button
            className="scroll-to-bottom-btn secondary"
            onClick={() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' })}
            aria-label="Scroll to bottom"
          >
            <FiArrowDown />
          </button>
        )}

        {/* sentinel to scroll into view */}
        <div ref={bottomRef} />
      </div>
  );
};

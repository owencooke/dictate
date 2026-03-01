import React from "react";
import { FiArrowDown } from 'react-icons/fi';
import { RiAddLine, RiFontSize, RiSubtractLine } from 'react-icons/ri';

interface Line {
  text: string;
  timestamp: string;
}

interface TranscriptDisplayProps {
  lines: Line[];
  interimTranscript?: string;
}

export const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ lines, interimTranscript }) => {
  const textContainerRef = React.useRef<HTMLDivElement>(null);
  const bottomRef = React.useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = React.useState(false);
  // text size widget state (px) — default larger for tablet/iPad readability
  const [fontSize, setFontSize] = React.useState<number>(18);
  const MIN_FONT = 12;
  const MAX_FONT = 28;
  const STEP = 2;

  const increaseFont = () => setFontSize(s => Math.min(MAX_FONT, s + STEP));
  const decreaseFont = () => setFontSize(s => Math.max(MIN_FONT, s - STEP));

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
      <div className="text-size-controls" aria-hidden={false} role="group" aria-label="Text size controls">
        <div className="sz-panel" aria-hidden>
          <button className="sz-btn" onClick={decreaseFont} aria-label="Decrease text size">
            <RiSubtractLine />
          </button>
          <RiFontSize className="sz-icon" aria-hidden />
          <button className="sz-btn" onClick={increaseFont} aria-label="Increase text size">
            <RiAddLine />
          </button>
        </div>
      </div>
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

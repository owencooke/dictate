import React from 'react';
import { RiAddLine, RiFontSize, RiSubtractLine } from 'react-icons/ri';

interface FontSizeControlsProps {
  fontSize: number;
  onFontSizeChange: (size: number) => void;
}

export const FontSizeControls: React.FC<FontSizeControlsProps> = ({
  fontSize,
  onFontSizeChange,
}) => {
  const MIN_FONT = 12;
  const MAX_FONT = 28;
  const STEP = 2;

  const increaseFont = () => onFontSizeChange(Math.min(MAX_FONT, fontSize + STEP));
  const decreaseFont = () => onFontSizeChange(Math.max(MIN_FONT, fontSize - STEP));

  return (
    <div className="font-size-controls" aria-label="Text size controls" role="group">
      <div className="font-size-panel">
        <button
          className="font-size-btn"
          onClick={decreaseFont}
          aria-label="Decrease text size"
          disabled={fontSize <= MIN_FONT}
        >
          <RiSubtractLine />
        </button>
        <RiFontSize className="font-size-icon" aria-hidden />
        <button
          className="font-size-btn"
          onClick={increaseFont}
          aria-label="Increase text size"
          disabled={fontSize >= MAX_FONT}
        >
          <RiAddLine />
        </button>
      </div>
    </div>
  );
};

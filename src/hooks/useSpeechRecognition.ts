import { useCallback, useEffect, useRef, useState } from 'react';

interface TranscriptLine {
  text: string;
  timestamp: string;
}

interface SpeechRecognitionResult {
  transcript: string;
  interimTranscript: string;
  finalTranscript: TranscriptLine[];
  isListening: boolean;
  isSupported: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

interface UseSpeechRecognitionOptions {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

export const useSpeechRecognition = ({
  lang = 'en-US',
  continuous = true,
  interimResults = true,
}: UseSpeechRecognitionOptions = {}): SpeechRecognitionResult => {
  // split state: finalized lines and interim pieces
  const [finalTranscript, setFinalTranscript] = useState<TranscriptLine[]>([]);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition ?? (window as any).SpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    const recognition = new SpeechRecognition();
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = lang;

    recognition.onresult = (event: any) => {
      let interimText = '';
      let finalText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += text;
        } else {
          interimText += text;
        }
      }

      if (finalText) {
        const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        setFinalTranscript(prev => [...prev, { text: finalText.trim(), timestamp }]);
      }
      // always replace interim, never accumulate
      setInterimTranscript(interimText);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => recognition.stop();
  }, [lang, continuous, interimResults]);

  const start = useCallback(() => {
    recognitionRef.current?.start();
    setIsListening(true);
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
    // clear any lingering interim results when recognition stops
    setInterimTranscript('');
  }, []);

  const reset = useCallback(() => {
    stop();
    setFinalTranscript([]);
    setInterimTranscript('');
  }, [stop]);

  // expose combined transcript for convenience (string form)
  const transcript = finalTranscript.map(l => l.text).join('\n') + interimTranscript;
  return {
    transcript,
    finalTranscript,
    interimTranscript,
    isListening,
    isSupported,
    start,
    stop,
    reset,
  };
};

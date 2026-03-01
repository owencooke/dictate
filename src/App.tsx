import React, { useEffect, useRef, useState } from 'react';
import './App.css';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

type SpeechRecognition = any;
type SpeechRecognitionEvent = any;

const App: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Web Speech API is not supported in this browser.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(finalTranscript + interimTranscript);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
    setIsListening(!isListening);
  };

  const handleRestart = () => {
    setTranscript('');
  };

  return (
    <div className="container">
      <div className="text-container">
        <p>{transcript}</p>
      </div>
      <div className="button-container">
        {transcript && !isListening ? (
          <button onClick={handleRestart} className="button restart-button">
            🔄
          </button>
        ) : (
          <button onClick={toggleListening} className={`button ${isListening ? 'stop-button' : 'start-button'}`}>
            {isListening ? '⏹️' : '🎤'}
          </button>
        )}
      </div>
    </div>
  );
};

export default App;

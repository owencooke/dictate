import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  View,
} from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";

// TODO: Move this to a separate HTML file
const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Speech to Text</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
      <script>
        // TypeScript declarations for non-standard properties
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        const recognition = new (window.SpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.continuous = true;

        recognition.onresult = (event) => {
          console.log('onresult', event);
          let final_transcript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              final_transcript += event.results[i][0].transcript;
            }
          }
          if (final_transcript) {
            console.log('postMessage', final_transcript);
            window.ReactNativeWebView.postMessage(final_transcript);
          }
        };
        
        recognition.onerror = (event) => {
          console.error('Speech recognition error', event.error);
        };

        window.addEventListener('message', (event) => {
          console.log('webview received message', event.data);
          if (event.data === 'start') {
            recognition.start();
          } else if (event.data === 'stop') {
            recognition.stop();
          }
        });
      </script>
    </body>
  </html>
`;

export default function Index() {
  const [dictatedText, setDictatedText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const webviewRef = useRef<WebView>(null);

  const handleButtonPress = () => {
    console.log("handleButtonPress", isRecording);
    if (isRecording) {
      webviewRef.current?.postMessage("stop");
      setIsRecording(false);
    } else {
      webviewRef.current?.postMessage("start");
      setIsRecording(true);
    }
  };

  const handleWebViewMessage = (event: WebViewMessageEvent) => {
    console.log("handleWebViewMessage", event.nativeEvent.data);
    setDictatedText((prev) => prev + event.nativeEvent.data + "\n");
  };

  const handleRestart = () => {
    setDictatedText("");
    setIsRecording(false);
    webviewRef.current?.postMessage("stop");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.textContainer}>
        <Text style={styles.text}>{dictatedText}</Text>
      </ScrollView>
      <TouchableOpacity onPress={handleButtonPress} style={styles.button}>
        <Text style={styles.buttonText}>{isRecording ? "⏹️" : "🎤"}</Text>
      </TouchableOpacity>
      {dictatedText.length > 0 && !isRecording && (
        <TouchableOpacity onPress={handleRestart} style={styles.restartButton}>
          <Text style={styles.buttonText}>🔄</Text>
        </TouchableOpacity>
      )}
      <View style={styles.hiddenWebView}>
        <WebView
          ref={webviewRef}
          source={{ html }}
          onMessage={handleWebViewMessage}
          javaScriptEnabled={true}
          onShouldStartLoadWithRequest={() => true}
          originWhitelist={['*']}
          />

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  textContainer: {
    flex: 1,
    padding: 20,
  },
  text: {
    fontSize: 18,
  },
  button: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "lightgray",
    borderRadius: 50,
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 30,
  },
  restartButton: {
    position: "absolute",
    bottom: 120,
    alignSelf: "center",
    backgroundColor: "lightcoral",
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  hiddenWebView: {
    width: 0,
    height: 0,
    position: 'absolute',
    top: -9999,
    left: -9999,
  },
});

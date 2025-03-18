import React, { useState, useEffect } from "react";
import "./App.css";
import BulkInputTable from "./components/BulkInputTable";
import FileUpload from "./components/FileUpload";
import LanguageSelector from "./components/LanguageSelector";

interface Language {
  code: string;
  name: string;
}

interface TextPair {
  text1: string;
  text2: string;
  language1: string;
  language2: string;
}

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

function App() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [pairs, setPairs] = useState<TextPair[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [defaultLanguage1, setDefaultLanguage1] = useState("");
  const [defaultLanguage2, setDefaultLanguage2] = useState("");

  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      const response = await fetch(`${API_URL}/api/languages`);
      const data = await response.json();
      setLanguages(data.languages);
      if (data.languages.length > 0) {
        setDefaultLanguage1(data.languages[0].code);
        setDefaultLanguage2(data.languages[0].code);
      }
    } catch (err) {
      setError("Failed to load languages");
    }
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/api/upload-file`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await response.json();
      const newPairs = data.pairs.map((pair: any) => ({
        ...pair,
        language1: defaultLanguage1,
        language2: defaultLanguage2,
      }));
      setPairs([...pairs, ...newPairs]); // Append new pairs to existing ones
    } catch (err) {
      setError("Failed to process file");
    }
  };

  const handleBulkTextInput = async (text: string) => {
    try {
      const response = await fetch(`${API_URL}/api/parse-bulk-text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to parse text");
      }

      const data = await response.json();
      const newPairs = data.pairs.map((pair: any) => ({
        ...pair,
        language1: defaultLanguage1,
        language2: defaultLanguage2,
      }));
      setPairs([...pairs, ...newPairs]); // Append new pairs to existing ones
    } catch (err) {
      setError("Failed to process text");
    }
  };

  const handleClearAll = () => {
    setPairs([]);
    setAudioUrl(null);
  };

  const handleGenerateSpeech = async () => {
    setIsLoading(true);
    setError(null);
    setAudioUrl(null);

    try {
      const response = await fetch(`${API_URL}/api/bulk-tts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pairs }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate speech");
      }

      const data = await response.json();
      setAudioUrl(`data:audio/mp3;base64,${data.audio}`);
    } catch (err) {
      setError("Failed to generate speech. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Bulk Text to Speech Converter for Sanya – German Speaker</h1>
      </header>
      <main>
        <div className="language-settings">
          <LanguageSelector
            languages={languages}
            label="Default Language 1"
            value={defaultLanguage1}
            onChange={setDefaultLanguage1}
          />
          <LanguageSelector
            languages={languages}
            label="Default Language 2"
            value={defaultLanguage2}
            onChange={setDefaultLanguage2}
          />
        </div>

        <div className="input-methods">
          <FileUpload onFileUpload={handleFileUpload} />
          <button className="paste-button" onClick={() => setShowPasteModal(true)}>
            Paste Word List
          </button>
          <button className="clear-button" onClick={handleClearAll}>
            Clear All Words
          </button>
        </div>

        {showPasteModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Paste Word Pairs</h2>
              <p>Enter each word pair on separate lines:</p>
              <textarea
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder="First word&#10;Second word&#10;Third word&#10;Fourth word"
                rows={10}
              />
              <div className="modal-buttons">
                <button
                  onClick={() => {
                    if (pasteText) {
                      handleBulkTextInput(pasteText);
                    }
                    setShowPasteModal(false);
                    setPasteText("");
                  }}
                >
                  Process
                </button>
                <button
                  onClick={() => {
                    setShowPasteModal(false);
                    setPasteText("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {pairs.length > 0 && (
          <>
            <BulkInputTable pairs={pairs} setPairs={setPairs} languages={languages} />
            <button className="generate-button" onClick={handleGenerateSpeech} disabled={isLoading}>
              {isLoading ? "Generating..." : "Generate Speech"}
            </button>
          </>
        )}

        {error && <div className="error">{error}</div>}

        {audioUrl && (
          <div className="audio-section">
            <audio controls src={audioUrl} />
            <a href={audioUrl} download="bulk-speech.mp3" className="download-button">
              Download MP3
            </a>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

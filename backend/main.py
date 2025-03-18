from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from gtts import gTTS
import base64
import io
import csv
import json
import chardet
from typing import List
from pydub import AudioSegment

app = FastAPI(title="Multilingual TTS API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-vercel-app.vercel.app"  # Add your Vercel domain when you have it
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Language codes supported by gTTS
LANGUAGE_CODES = {
    "en": "English",
    "de": "German",
    "uk": "Ukrainian",
    "es": "Spanish",
    "fr": "French",
    "it": "Italian",
    "pl": "Polish",
    "pt": "Portuguese",
    "ru": "Russian",
    "ja": "Japanese",
    "ko": "Korean",
    "zh": "Chinese"
}

class TextPair(BaseModel):
    text1: str
    text2: str
    language1: str
    language2: str

class BulkTTSRequest(BaseModel):
    pairs: List[TextPair]

def parse_csv_content(content: str) -> List[dict]:
    # Detect delimiter
    first_line = content.split('\n')[0]
    if ',' in first_line:
        delimiter = ','
    elif ';' in first_line:
        delimiter = ';'
    elif '\t' in first_line:
        delimiter = '\t'
    else:
        delimiter = ','

    pairs = []
    reader = csv.reader(content.splitlines(), delimiter=delimiter)
    for row in reader:
        if len(row) >= 2:
            text1, text2 = row[0].strip(), row[1].strip()
            if text1 and text2:
                pairs.append({
                    "text1": text1,
                    "text2": text2
                })
    return pairs

@app.post("/api/upload-file")
async def upload_file(file: UploadFile = File(...)):
    content = await file.read()
    
    # Detect file encoding
    encoding = chardet.detect(content)['encoding']
    content_str = content.decode(encoding)
    
    # Process based on file type
    if file.filename.endswith('.csv') or file.filename.endswith('.txt'):
        pairs = parse_csv_content(content_str)
    elif file.filename.endswith('.json'):
        pairs = json.loads(content_str)
    else:
        raise HTTPException(status_code=400, detail="Unsupported file type")
    
    return {"pairs": pairs}

@app.post("/api/parse-bulk-text")
async def parse_bulk_text(request: dict):
    text = request.get('text', '')
    lines = text.strip().split('\n')
    pairs = []
    
    for i in range(0, len(lines), 2):
        if i + 1 < len(lines):
            text1 = lines[i].strip()
            text2 = lines[i + 1].strip()
            if text1 and text2:
                pairs.append({
                    "text1": text1,
                    "text2": text2
                })
    
    return {"pairs": pairs}

def generate_single_audio(text: str, language: str) -> io.BytesIO:
    audio_buffer = io.BytesIO()
    tts = gTTS(text=text, lang=language, slow=False)
    tts.write_to_fp(audio_buffer)
    audio_buffer.seek(0)
    return audio_buffer

@app.post("/api/bulk-tts")
async def bulk_text_to_speech(request: BulkTTSRequest):
    try:
        combined = AudioSegment.empty()
        silence = AudioSegment.silent(duration=500)
        
        for pair in request.pairs:
            # Generate first audio
            audio1_buffer = generate_single_audio(pair.text1, pair.language1)
            audio1 = AudioSegment.from_mp3(audio1_buffer)
            
            # Generate second audio
            audio2_buffer = generate_single_audio(pair.text2, pair.language2)
            audio2 = AudioSegment.from_mp3(audio2_buffer)
            
            # Combine pair with silence
            pair_combined = audio1 + silence + audio2 + silence
            combined += pair_combined
        
        # Export combined audio
        output_buffer = io.BytesIO()
        combined.export(output_buffer, format="mp3")
        output_buffer.seek(0)
        
        # Encode to base64
        audio_base64 = base64.b64encode(output_buffer.read()).decode('utf-8')
        
        return {
            "audio": audio_base64,
            "format": "mp3"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/languages")
async def get_supported_languages():
    return {
        "languages": [
            {"code": code, "name": name}
            for code, name in LANGUAGE_CODES.items()
        ]
    }

# Multilingual Text-to-Speech App

A web application that converts text to speech using native speaker voices for multiple languages.

## Features

- Support for German, Ukrainian, and English languages
- Native speaker voices
- Audio playback and download functionality
- Simple and intuitive user interface

## Prerequisites

- Python 3.8+
- Node.js 16+
- Google Cloud account with Text-to-Speech API enabled
- Google Cloud credentials (JSON key file)

## Setup

### Backend Setup

1. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the backend directory with your Google Cloud credentials:

```
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/credentials.json
```

4. Start the backend server:

```bash
cd backend
uvicorn main:app --reload
```

### Frontend Setup

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Start the development server:

```bash
npm start
```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Enter text in the input field
3. Select the language from the dropdown
4. Click "Generate Audio" to create the speech
5. Play the audio or download it as an MP3 file

## API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for the interactive API documentation.

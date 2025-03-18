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

## Deployment Guide

### Frontend Deployment (Vercel)

1. Push your code to GitHub
2. Sign up for [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Set environment variables in Vercel:
   - `REACT_APP_API_URL`: Your Render backend URL

### Backend Deployment (Render)

1. Sign up for [Render](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Configure the service:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables if needed

### Local Development

1. Clone the repository
2. Install dependencies:

   ```bash
   # Backend
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt

   # Frontend
   cd frontend
   npm install
   ```

3. Start the development servers:

   ```bash
   # Backend
   cd backend
   uvicorn main:app --reload

   # Frontend
   cd frontend
   npm start
   ```

### Environment Variables

#### Frontend (.env.development)

REACT_APP_API_URL=http://localhost:8000

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

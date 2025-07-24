# Dongeng TTS Integration Setup

## How to run the complete application:

### 1. Start the Backend (Flask TTS Server)
```bash
cd backend
# Set your Azure Speech Service credentials
set AZURE_SPEECH_KEY=your_speech_key_here
set AZURE_SPEECH_REGION=your_region_here

# Install dependencies if needed
pip install flask flask-cors azure-cognitiveservices-speech

# Run the Flask server
python app.py
```

### 2. Start the Frontend (Next.js)
```bash
cd frontend
npm run dev
```

### 3. Test the Integration
1. Go to http://localhost:3000/dongeng
2. Click on any dongeng story
3. Select a voice from the dropdown
4. Click "Dengarkan Dongeng" to hear the story

## Voice Options Available:
- **Ardi** - Indonesian Male Neural Voice
- **Gadis** - Indonesian Female Neural Voice  
- **Seraphina** - German Multilingual Neural Voice
- **Remy** - French Dragon HD Latest Neural Voice

## Features Implemented:
✅ Send dongeng content to TTS backend
✅ Voice selection with 4 different voices
✅ Play/Pause functionality
✅ Loading states and error handling
✅ Server health checking
✅ Clean content formatting for TTS
✅ Audio cleanup on component unmount

## API Endpoints:
- `GET /health` - Check server status
- `GET /voices` - Get available voices
- `POST /synthesize-speech` - Convert text to speech

## Required Environment Variables:
- `AZURE_SPEECH_KEY` - Your Azure Speech Service key
- `AZURE_SPEECH_REGION` - Your Azure region (e.g., "eastus")

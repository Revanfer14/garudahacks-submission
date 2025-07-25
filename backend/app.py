from flask import Flask, request, jsonify
from flask_cors import CORS
import azure.cognitiveservices.speech as speechsdk
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

SPEECH_KEY = os.environ.get("AZURE_SPEECH_KEY")
SPEECH_REGION = os.environ.get("AZURE_SPEECH_REGION")

AVAILABLE_VOICES = {
    "id-ID-ArdiNeural": "Ardi (Indonesian - Neural Male)",
    "id-ID-GadisNeural": "Gadis (Indonesian - Neural Female)",
    "fr-FR-Remy:DragonHDLatestNeural": "Remy (French - Dragon HD Latest Neural)",
    "de-DE-SeraphinaMultilingualNeural": "Seraphina (German Multilingual Neural)", 
}

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "TTS service is running"})

@app.route('/voices', methods=['GET'])
def get_voices():
    return jsonify({"voices": AVAILABLE_VOICES})

@app.route('/synthesize-speech', methods=['POST'])
def synthesize_speech():
    if not SPEECH_KEY or not SPEECH_REGION:
        return jsonify({"error": "Azure Speech key or region not configured."}), 500

    data = request.json
    text_to_synthesize = data.get('text')
    voice_name = data.get('voice_name', 'id-ID-ArdiNeural')
    title = data.get('title', 'dongeng')  # Use title for filename

    if not text_to_synthesize:
        return jsonify({"error": "No text provided."}), 400

    if voice_name not in AVAILABLE_VOICES:
        return jsonify({"error": f"Invalid voice name: {voice_name}"}), 400

    # Generate a predictable, safe filename
    dongeng_name = "".join(filter(str.isalnum, title.replace(" ", "_")))[:50]
    voice_name_safe = "".join(filter(str.isalnum, voice_name.replace(" ", "_")))
    filename = f"{dongeng_name}-{voice_name_safe}.wav"
    
    audio_dir = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'public', 'audio')
    if not os.path.exists(audio_dir):
        os.makedirs(audio_dir)
    file_path = os.path.join(audio_dir, filename)
    audio_url = f"/audio/{filename}"

    # If the file already exists, return it without calling Azure
    if os.path.exists(file_path):
        print(f"Audio file found in cache: {file_path}")
        return jsonify({"success": True, "message": "Audio retrieved from cache.", "audio_url": audio_url})

    speech_config = speechsdk.SpeechConfig(subscription=SPEECH_KEY, region=SPEECH_REGION)
    audio_config = speechsdk.audio.AudioOutputConfig(filename=file_path)
    speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)

    ssml_string = f"""
    <speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="id-ID">
      <voice name="{voice_name}">
        <prosody contour="(29%, +79%) (44%, -4%) (84%, +40%)">{text_to_synthesize}</prosody>
      </voice>
    </speak>
    """

    try:
        result = speech_synthesizer.speak_ssml_async(ssml_string).get()

        if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
            print(f"Speech synthesis completed successfully. Audio saved to {file_path}")
            return jsonify({"success": True, "message": "Speech synthesized.", "audio_url": audio_url})
        else:
            if os.path.exists(file_path):
                os.remove(file_path)
            
            if result.reason == speechsdk.ResultReason.Canceled:
                cancellation_details = result.cancellation_details
                print(f"Speech synthesis canceled: {cancellation_details.reason}")
                print(f"Error details: {cancellation_details.error_details}")
                return jsonify({"error": f"Speech synthesis canceled: {cancellation_details.reason}. Details: {cancellation_details.error_details}"}), 500
            else:
                return jsonify({"error": "An unknown error occurred during speech synthesis.", "details": str(result.reason)}), 500
    except Exception as e:
        # Clean up the failed file if it was created
        if os.path.exists(file_path):
            os.remove(file_path)
        return jsonify({"error": f"An error occurred calling Azure TTS: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
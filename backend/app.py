from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import azure.cognitiveservices.speech as speechsdk
import io
import os

app = Flask(__name__)
CORS(app)

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

    if not text_to_synthesize:
        return jsonify({"error": "No text provided."}), 400

    if voice_name not in AVAILABLE_VOICES:
        return jsonify({"error": f"Invalid voice name: {voice_name}"}), 400

    speech_config = speechsdk.SpeechConfig(subscription=SPEECH_KEY, region=SPEECH_REGION)
    
    speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config)

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
            audio_data = io.BytesIO(result.audio_data)
            return send_file(audio_data, mimetype="audio/wav", as_attachment=False)
        elif result.reason == speechsdk.ResultReason.Canceled:
            cancellation_details = result.cancellation_details
            print(f"Speech synthesis canceled: {cancellation_details.reason}")
            print(f"Error details: {cancellation_details.error_details}")
            return jsonify({"error": f"Speech synthesis canceled: {cancellation_details.reason}. Details: {cancellation_details.error_details}"}), 500
        else:
            return jsonify({"error": "An unknown error occurred during speech synthesis.", "details": str(result.reason)}), 500
    except Exception as e:
        return jsonify({"error": f"An error occurred calling Azure TTS: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
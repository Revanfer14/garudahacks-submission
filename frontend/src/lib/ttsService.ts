const API_BASE_URL = 'http://localhost:5000';

export interface TTSRequest {
  text: string;
  voice_name: string;
}

export interface Voice {
  [key: string]: string;
}

export class TTSService {
  static async synthesizeSpeech(request: TTSRequest): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/synthesize-speech`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.blob();
  }

  static async getVoices(): Promise<Voice> {
    const response = await fetch(`${API_BASE_URL}/voices`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.voices;
  }

  static async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

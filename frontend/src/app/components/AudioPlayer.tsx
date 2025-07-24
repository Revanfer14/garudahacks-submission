"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play, Pause, Volume2, Loader2, AlertCircle, Square } from "lucide-react";
import { toast } from "sonner";

interface AudioPlayerProps {
  content: string;
}

const voices = [
  { id: "id-ID-ArdiNeural", name: "Ardi" },
  { id: "id-ID-GadisNeural", name: "Gadis" },
  { id: "de-DE-SeraphinaMultilingualNeural", name: "Seraphina" },
  { id: "fr-FR-Remy:DragonHDLatestNeural", name: "Remy" },
];

export const AudioPlayer = ({ content }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(voices[0].id);
  const [serverError, setServerError] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Check server health on component mount
  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch('http://localhost:5000/health');
        setServerError(!response.ok);
      } catch (error) {
        setServerError(true);
      }
    };
    checkServer();
  }, []);

  const handlePlayAudio = async () => {
    // If audio is currently playing, pause it
    if (isPlaying && !isPaused) {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        setIsPaused(true);
        toast("Audio dijeda.");
      }
      return;
    }

    // If audio is paused, resume it
    if (isPaused && audioRef.current) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        setIsPaused(false);
        toast("Audio dilanjutkan.");
      } catch (error) {
        console.error('Error resuming audio:', error);
        toast.error("Gagal melanjutkan audio.");
      }
      return;
    }

    // If no audio loaded or need to restart, generate new audio
    if (serverError) {
      toast.error("Server TTS tidak tersedia. Pastikan backend berjalan di port 5000.");
      return;
    }

    try {
      setIsLoading(true);
      const voiceName = voices.find(v => v.id === selectedVoice)?.name || 'Suara default';
      toast(`Mempersiapkan audio dengan suara ${voiceName}...`);

      // Clean content - remove extra whitespace and format for TTS
      const cleanContent = content
        .replace(/\n\n+/g, '. ')
        .replace(/\n/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      // Send request to Flask backend
      const response = await fetch('http://localhost:5000/synthesize-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: cleanContent,
          voice_name: selectedVoice
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // Get audio blob from response
      const audioBlob = await response.blob();
      const newAudioUrl = URL.createObjectURL(audioBlob);

      // Clean up previous audio URL
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      setAudioUrl(newAudioUrl);

      // Create and play audio
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      const newAudio = new Audio(newAudioUrl);
      audioRef.current = newAudio;
      
      // Set up event listeners
      newAudio.onplay = () => {
        setIsLoading(false);
        setIsPlaying(true);
        setIsPaused(false);
        toast.success("Audio sedang diputar...");
      };

      newAudio.onpause = () => {
        // This handles both explicit pause and stop
        if (newAudio.currentTime > 0 && !newAudio.ended) {
          setIsPaused(true);
        } else {
          setIsPaused(false);
        }
        setIsPlaying(false);
      };

      newAudio.onended = () => {
        setIsPlaying(false);
        setIsPaused(false);
        toast("Terima kasih telah mendengarkan dongeng ini.");
      };

      newAudio.onerror = () => {
        setIsLoading(false);
        setIsPlaying(false);
        setIsPaused(false);
        toast.error("Terjadi kesalahan saat memutar audio.");
      };

      // Attempt to play the audio
      newAudio.play().catch(error => {
        console.error("Error playing audio:", error);
        toast.error("Gagal memulai pemutaran audio.");
        setIsLoading(false);
      });

    } catch (error) {
      setIsLoading(false);
      setIsPlaying(false);
      setIsPaused(false);
      console.error('Error synthesizing speech:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          setServerError(true);
          toast.error("Tidak dapat terhubung ke server TTS. Pastikan backend berjalan.");
        } else {
          toast.error(`Gagal membuat audio: ${error.message}`);
        }
      } else {
        toast.error("Gagal membuat audio. Silakan coba lagi.");
      }
    }
  };

  const handleStopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setIsPaused(false);
    toast("Audio dihentikan.");
  };

  // Cleanup audio on component unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  return (
    <div className="flex flex-col items-center gap-4">
      {serverError && (
        <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">Server TTS tidak tersedia</span>
        </div>
      )}
      
      <div className="flex items-center gap-3">
        <Button
          onClick={handlePlayAudio}
          variant="default"
          size="lg"
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Memproses...
            </> 
          ) : isPlaying && !isPaused ? (
            <>
              <Pause className="h-5 w-5" />
              Jeda
            </>
          ) : isPaused ? (
            <>
              <Play className="h-5 w-5" />
              Lanjutkan
            </>
          ) : (
            <>
              <Volume2 className="h-5 w-5" />
              Dengarkan Dongeng
            </>
          )}
        </Button>

        {(isPlaying || isPaused) && (
          <Button
            onClick={handleStopAudio}
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            <Square className="h-4 w-4" />
            Stop
          </Button>
        )}
        
        <Select 
          value={selectedVoice} 
          onValueChange={setSelectedVoice} 
          disabled={isLoading || isPlaying}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Pilih Suara" />
          </SelectTrigger>
          <SelectContent>
            {voices.map((voice) => (
              <SelectItem key={voice.id} value={voice.id}>
                {voice.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

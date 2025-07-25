"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Play,
  Pause,
  Volume2,
  Loader2,
  AlertCircle,
  Square,
  VolumeX,
} from "lucide-react";
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
  type PlayerState = "stopped" | "loading" | "playing" | "paused";

  const [playerState, setPlayerState] = useState<PlayerState>("stopped");
  const [selectedVoice, setSelectedVoice] = useState(voices[0].id);
  const [serverError, setServerError] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [downloadedAudioUrl, setDownloadedAudioUrl] = useState<string | null>(
    null
  );
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);

  const cleanupAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute("src"); // Remove the src to ensure it stops loading
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setCurrentTime(0);
    setDuration(0);
  }, [audioUrl]);

  const getAudioFilePath = (title: string, voice: string) => {
    let dongengName = title
      .split(/\s+/)
      .slice(0, 5)
      .join("_")
      .replace(/[^a-zA-Z0-9_]/g, "");
    if (!dongengName) dongengName = "dongeng";
    const voiceName = voice.replace(/[^a-zA-Z0-9_]/g, "");
    return `/audio/${dongengName}-${voiceName}.wav`;
  };

  const handlePlay = async () => {
    if (serverError) {
      toast.error("Server TTS tidak tersedia. Pastikan backend berjalan.");
      return;
    }
    if (playerState !== "stopped") {
      cleanupAudio();
    }
    setPlayerState("loading");
    const audioPath = getAudioFilePath(content, selectedVoice);
    // Check if file exists in public/audio
    try {
      const res = await fetch(audioPath);
      if (res.ok) {
        setAudioUrl(audioPath);
        setDownloadedAudioUrl(audioPath);
        setPlayerState("stopped");
        toast.success(`Audio ditemukan di lokal: ${audioPath}`);
        return;
      }
    } catch {}
    // If not found, request TTS from backend
    try {
      const response = await fetch("http://localhost:5000/synthesize-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: content, voice_name: selectedVoice }),
      });
      if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
      // Get audio from Azure (simulate download)
      const audioBlob = await response.blob();
      // Save to public/audio using download hack
      const url = window.URL.createObjectURL(audioBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = audioPath.split("/").pop() || "audio.wav";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      // Wait for user to save, then play from local
      setTimeout(() => {
        setAudioUrl(audioPath);
        setDownloadedAudioUrl(audioPath);
        setPlayerState("stopped");
        toast.success(`Audio berhasil dibuat dan disimpan: ${audioPath}`);
      }, 1000);
    } catch (error) {
      console.error("Error synthesizing speech:", error);
      toast.error("Gagal membuat audio. Periksa koneksi ke server.");
      setPlayerState("stopped");
      cleanupAudio();
    }
  };

  const handleStop = () => {
    setPlayerState("stopped");
    cleanupAudio();
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
    }
  };

  // Use the downloaded audio for playback, don't fetch again if already downloaded for this dongeng and voice
  const handleMainButtonClick = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (downloadedAudioUrl && audioUrl === downloadedAudioUrl) {
      if (playerState === "playing") {
        audio.pause();
      } else if (playerState === "paused") {
        audio.play();
      } else if (playerState === "stopped") {
        setAudioUrl(downloadedAudioUrl);
      }
    } else {
      handlePlay();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, [cleanupAudio]);

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch("http://localhost:5000/health");
        setServerError(!response.ok);
      } catch {
        setServerError(true);
      }
    };
    checkServer();
  }, []);

  // Effect to manage audio time updates
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const setAudioDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", setAudioDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", setAudioDuration);
    };
  }, [audioUrl]); // Rerun when audioUrl changes

  return (
    <div className="flex w-full flex-col gap-4 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Dengarkan Dongeng</h3>
        {serverError && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>Server Error</span>
          </div>
        )}
      </div>

      <Select
        onValueChange={setSelectedVoice}
        defaultValue={selectedVoice}
        disabled={playerState !== "stopped"}
      >
        <SelectTrigger>
          <SelectValue placeholder="Pilih suara..." />
        </SelectTrigger>
        <SelectContent>
          {voices.map((voice) => (
            <SelectItem key={voice.id} value={voice.id}>
              {voice.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center justify-center gap-4">
        <Button
          onClick={handleMainButtonClick}
          size="icon"
          disabled={!content.trim() && playerState === "stopped"}
        >
          {playerState === "loading" && (
            <Loader2 className="h-6 w-6 animate-spin" />
          )}
          {playerState === "playing" && <Pause className="h-6 w-6" />}
          {playerState === "paused" && <Play className="h-6 w-6" />}
          {playerState === "stopped" && <Play className="h-6 w-6" />}
        </Button>

        <Button
          size="icon"
          variant="destructive"
          onClick={handleStop}
          disabled={playerState === "stopped" || playerState === "loading"}
        >
          <Square className="h-6 w-6" />
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <VolumeX className="h-5 w-5 text-muted-foreground" />
        <Slider
          value={[volume]}
          onValueChange={handleVolumeChange}
          max={1}
          step={0.05}
          className="w-full"
          disabled={playerState === "stopped"}
        />
        <Volume2 className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground">
          {Math.floor(currentTime)}s
        </span>
        <Slider
          value={[currentTime]}
          min={0}
          max={duration || 1}
          step={0.1}
          onValueChange={handleSeek}
          disabled={!audioUrl || playerState === "stopped"}
          className="w-full"
        />
        <span className="text-xs text-muted-foreground">
          {Math.floor(duration)}s
        </span>
      </div>

      {/* FIX: The <audio> element is now the single source of truth for player state */}
      <audio
        ref={audioRef}
        src={audioUrl ?? undefined}
        onPlay={() => setPlayerState("playing")}
        onPause={() => {
          // Only set to 'paused' if it's not being stopped intentionally
          if (playerState !== "stopped") {
            setPlayerState("paused");
          }
        }}
        onEnded={() => setPlayerState("stopped")}
        onCanPlay={() => {
          // When audio is ready, and we are in a 'loading' state, play it.
          if (audioRef.current && playerState === "loading") {
            audioRef.current.play();
            toast.success("Audio sedang diputar...");
          }
        }}
        style={{ display: "none" }}
      />
    </div>
  );
};

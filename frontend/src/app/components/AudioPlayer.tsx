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
import { Play, Pause, Loader2, AlertCircle, Square } from "lucide-react";
import { toast } from "sonner";

interface AudioPlayerProps {
  content: string;
  title: string; // Add title prop
}

const voices = [
  { id: "id-ID-ArdiNeural", name: "Ardi" },
  { id: "id-ID-GadisNeural", name: "Gadis" },
  { id: "de-DE-SeraphinaMultilingualNeural", name: "Seraphina" },
  { id: "fr-FR-Remy:DragonHDLatestNeural", name: "Remy" },
];

export const AudioPlayer = ({ content, title }: AudioPlayerProps) => {
  type PlayerState = "stopped" | "loading" | "playing" | "paused";

  const [playerState, setPlayerState] = useState<PlayerState>("stopped");
  const [selectedVoice, setSelectedVoice] = useState(voices[0].id);
  const [serverError, setServerError] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);

  const cleanupAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute("src"); // Remove the src to ensure it stops loading
    }
    setAudioUrl(null);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  const handlePlay = async () => {
    if (serverError) {
      toast.error("Server TTS tidak tersedia. Pastikan backend berjalan.");
      return;
    }

    if (playerState !== "stopped") {
      cleanupAudio();
    }

    setPlayerState("loading");

    try {
      const response = await fetch("http://localhost:5000/synthesize-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: content,
          voice_name: selectedVoice,
          title: title,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Server error: ${response.statusText}`
        );
      }

      const data = await response.json();
      if (data.success && data.audio_url) {
        setAudioUrl(data.audio_url);
        toast.success("Audio siap untuk diputar.");
      } else {
        throw new Error(data.message || "Gagal mendapatkan audio URL.");
      }
    } catch (error: unknown) {
      console.error("Error synthesizing speech:", error);
      const errorMessage =
        typeof error === "object" && error !== null && "message" in error
          ? String((error as { message?: string }).message)
          : "Gagal membuat audio. Periksa koneksi ke server.";
      toast.error(errorMessage);
      setPlayerState("stopped");
      cleanupAudio();
    }
  };

  const handleStop = () => {
    setPlayerState("stopped");
    cleanupAudio();
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
    }
  };

  const handleMainButtonClick = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playerState === "playing") {
      audio.pause();
    } else if (playerState === "paused") {
      audio.play();
    } else if (playerState === "stopped") {
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
        onValueChange={(value) => {
          if (playerState !== "stopped") {
            handleStop();
          }
          setAudioUrl(null);
          setSelectedVoice(value);
        }}
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
          disabled={(!content.trim() && playerState === "stopped") || !title}
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

      {/* The <audio> element is the single source of truth for player state */}
      <audio
        ref={audioRef}
        src={audioUrl ?? undefined}
        onPlay={() => setPlayerState("playing")}
        onPause={() => {
          if (playerState !== "stopped") {
            setPlayerState("paused");
          }
        }}
        onEnded={handleStop}
        onCanPlay={() => {
          if (
            audioRef.current &&
            (playerState === "loading" ||
              (playerState === "stopped" && audioUrl))
          ) {
            audioRef.current.play();
          }
        }}
        onError={() => {
          toast.error(
            "Gagal memuat audio. File mungkin tidak ditemukan atau rusak."
          );
          setPlayerState("stopped");
          cleanupAudio();
        }}
        style={{ display: "none" }}
      />
    </div>
  );
};

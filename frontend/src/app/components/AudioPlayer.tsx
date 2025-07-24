"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play, Pause, Volume2 } from "lucide-react";
import { toast } from "sonner";

const voices = [
  { id: "voice-1", name: "Ardi" },
  { id: "voice-2", name: "Gadis" },
  { id: "voice-3", name: "Seraphine" },
  { id: "voice-4", name: "Remy" },
];

export const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(voices[0].id);

  const handlePlayAudio = async () => {
    if (!isPlaying) {
      const voiceName = voices.find(v => v.id === selectedVoice)?.name || 'Suara default';
      toast(`Mempersiapkan audio dengan ${voiceName}...`);
      setIsPlaying(true);

      // Simulate audio playing
      setTimeout(() => {
        setIsPlaying(false);
        toast("Terima kasih telah mendengarkan dongeng ini.");
      }, 5000);
    } else {
      setIsPlaying(false);
      toast("Pemutaran audio telah dihentikan.");
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        onClick={handlePlayAudio}
        variant="default"
        size="lg"
        className="flex items-center gap-2"
      >
        {isPlaying ? (
          <>
            <Pause className="h-5 w-5" />
            Hentikan Audio
          </>
        ) : (
          <>
            <Volume2 className="h-5 w-5" />
            Dengarkan Dongeng
          </>
        )}
      </Button>
      <Select value={selectedVoice} onValueChange={setSelectedVoice}>
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
  );
};

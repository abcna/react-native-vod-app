import { AVPlaybackStatus, AVPlaybackStatusToSet, Video } from "expo-av";
import { useRef, useState } from "react";

export function useVideoPlayer(videoUri: string) {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  async function play() {
    if (videoRef.current) {
      await videoRef.current.playAsync();
      setIsPlaying(true);
    }
  }

  async function pause() {
    if (videoRef.current) {
      await videoRef.current.pauseAsync();
      setIsPlaying(false);
    }
  }

  async function seek(positionMs: number) {
    if (videoRef.current) {
      await videoRef.current.setPositionAsync(positionMs);
      setPosition(positionMs);
    }
  }

  function handlePlaybackStatusUpdate(status: AVPlaybackStatus) {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);
    }
  }

  return {
    videoRef,
    isPlaying,
    position,
    duration,
    play,
    pause,
    seek,
    handlePlaybackStatusUpdate,
  };
}

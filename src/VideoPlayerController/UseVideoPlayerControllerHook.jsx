import { useState, useEffect } from "react";

const useVideoController = (playerRef) => {
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const player = playerRef?.current;
    if (player) {
      // Set duration when metadata is loaded
      const handleLoadedMetadata = () => {
        if (player.duration) {
          setDuration(player.duration);
        }
      };
      player.addEventListener("loadedmetadata", handleLoadedMetadata);

      // Cleanup the event listener
      return () => player.removeEventListener("loadedmetadata", handleLoadedMetadata);
    }
  }, [playerRef]);

  useEffect(() => {
    const updateProgress = () => {
      const player = playerRef?.current;
      if (player && duration > 0) {
        setCurrentTime(player.currentTime);
        setPlayed(player.currentTime / duration);
      }
    };

    // Update every second
    const interval = setInterval(updateProgress, 1000);
    return () => clearInterval(interval);
  }, [playerRef, duration]);

  const handlePlayPause = () => {
    const player = playerRef.current;
    if (playing) {
      player.pause();
    } else {
      player.play();
    }
    setPlaying(!playing);
  };

  const handleSeekChange = (seekTo) => {
    setPlayed(seekTo);
    const player = playerRef.current;
    if (player && duration > 0) {
      player.currentTime = seekTo * duration;
    }
  };

  const handleSpeedChange = (rate) => {
    setPlaybackRate(rate);
    const player = playerRef.current;
    if (player) {
      player.playbackRate = rate;
    }
  };

  const handleFullScreen = () => {
    const parentElement = document.getElementById("main-container");
    if (parentElement) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        parentElement.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
      }
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return {
    playing,
    played,
    playbackRate,
    duration,
    currentTime,
    handlePlayPause,
    handleSeekChange,
    handleSpeedChange,
    handleFullScreen,
    formatTime,
  };
};

export default useVideoController;

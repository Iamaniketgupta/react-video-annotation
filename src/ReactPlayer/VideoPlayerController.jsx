import React, { useState, useEffect } from "react";

const VideoController = ({ playerRef , setwid }) => {
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const player = playerRef.current;
    if (player) {
      player.onloadedmetadata = () => {
        setDuration(player.duration);
      };
    }
  }, [playerRef]);

  useEffect(() => {
    const updateProgress = () => {
      if (playerRef.current) {
        const player = playerRef.current;
        setCurrentTime(player.currentTime);
        setPlayed(Number(player.currentTime) / Number(duration));
      }
    };

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

  const handleSeekChange = (e) => {
    const seekTo = parseFloat(e.target.value);
    setPlayed(seekTo);
    if (playerRef.current) {
      playerRef.current.currentTime = seekTo * duration;
    }
  };

  const handleSpeedChange = (e) => {
    const rate = parseFloat(e.target.value);
    setPlaybackRate(rate);
    if (playerRef.current) {
      playerRef.current.playbackRate = rate;
    }
  };

  const handleFullScreen = () => {
    const parentElement = document.getElementById('main-container');
    if (parentElement) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        parentElement.requestFullscreen().catch(err => {
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

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        padding: "10px",
        background: "#000",
        color: "#fff",
      }}
    >
      <button
        onClick={handlePlayPause}
        style={{
          background: "transparent",
          border: "none",
          color: "#fff",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        {playing ? "⏸️" : "▶️"}
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={played}
        onChange={handleSeekChange}
        style={{ flexGrow: 1 
      }}
      />
      <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
      <select onChange={handleSpeedChange} value={playbackRate}>
        <option value={1}>1x</option>
        <option value={1.5}>1.5x</option>
        <option value={2}>2x</option>
      </select>
      <button onClick={handleFullScreen} style={{ marginLeft: "10px", background: "transparent", border: "none", color: "#fff", cursor: "pointer" }}>
        Fullscreen
      </button>
    </div>
  );
};

export default VideoController;

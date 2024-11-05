import React from "react";
import useVideoController from "./UseVideoPlayerControllerHook";

const VideoController = ({ playerRef }) => {
  const {
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
  } = useVideoController(playerRef);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        padding: "10px 15px",
        background: "#1c1c1c", // Dark gray background
        color: "#fff",
        position: "absolute",
        bottom: 0,
        transition: "opacity 0.5s",
        opacity: 1, // Make it visible initially (could add state for hiding/showing on mouse movement if needed)
      }}
    >
      <button
        onClick={handlePlayPause}
        style={{
          background: "transparent",
          border: "none",
          color: "#fff",
          cursor: "pointer",
          fontSize: "24px",
          marginRight: "10px",
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
        onChange={(e) => handleSeekChange(parseFloat(e.target.value))}
        style={{
          flexGrow: 1,
          marginRight: "15px",
          accentColor: "#ff0000", // Red accent color for the progress bar
          cursor: "pointer",
        }}
      />

      <span style={{ marginRight: "15px", fontSize: "14px" }}>
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>

      <select
        onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
        value={playbackRate}
        style={{
          background: "#333", // Darker gray background for the dropdown
          color: "#fff",
          border: "none",
          padding: "5px",
          cursor: "pointer",
          fontSize: "14px",
          marginRight: "10px",
        }}
      >
        <option value={1}>1x</option>
        <option value={1.5}>1.5x</option>
        <option value={2}>2x</option>
      </select>

      <button
        onClick={handleFullScreen}
        style={{
          background: "transparent",
          border: "none",
          color: "#fff",
          cursor: "pointer",
          fontSize: "20px",
        }}
      >
        ⛶
      </button>
    </div>
  );
};

export default VideoController;

import React, { useState, useEffect, useRef } from "react";
import useVideoController from "./UseVideoPlayerControllerHook";

const TransparentVideoController = ({playerRef}) => {
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

  const [controlsVisible, setControlsVisible] = useState(true);
  const hideTimeout = useRef(null);

  console.log({controlsVisible})

  useEffect(() => {
    const handleMouseMove = (event) => {
      const container = playerRef.current;
      const buffer = 10; // Distance from the edge in pixels
      if (container) {
        const { left, right, top } = container.getBoundingClientRect();
        
        
        if (
          event.clientX <= left + buffer - 10 || // -10 is just a fudge factor
          event.clientX >= right - buffer ||
          event.clientY <= top + buffer
        ) {
          setControlsVisible(false);
          return;
        }

        // Show controls if not near boundary
        setControlsVisible(true);

        // Reset the timeout to hide controls after 3 seconds
        if (hideTimeout.current) {
          clearTimeout(hideTimeout.current);
        }

        hideTimeout.current = setTimeout(() => setControlsVisible(false), 3000);
      }
    };

    const container = document.getElementById("main-container");
    
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
      clearTimeout(hideTimeout?.current);
    };
  }, [playerRef]);
 

  return (
    <div
      style={{
        position: "absolute",
        bottom: "0",
        height: "20px",
        width: "98%",
        margin:'0 20px',
        
        background: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        alignItems: "center",
        padding: "10px 30px",
        paddingRight: "20px",
        color: "#fff",
        transition: "opacity 0.5s",
        opacity: controlsVisible ? 1 : 0,
        pointerEvents: controlsVisible ? "auto" : "none",
      }}
    >
      <button
        onClick={handlePlayPause}
        style={{
          background: "transparent",
          border: "none",
          color: "#fff",
          cursor: "pointer",
          fontSize: "20px",
          marginRight: "10px",
        }}
      >
        {playing ? <div style={{fontSize:"12px"}}>
          play
        </div>:"pause"
        }
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
          marginRight: "10px",
          accentColor: "#ff0000",
        }}
      />
      
      <span style={{ marginRight: "15px", fontSize: "14px" }}>
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
      
      <select
        onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
        value={playbackRate}
        style={{
          background: "rgba(0,0,0, 0.5)",
          color: "#fff",
          border: "none",
          outline: "none",
          padding: "5px",
          cursor: "pointer",
          fontSize: "10px",
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
          fontSize: "18px",
        }}
      >
        ⛶
      </button>
    </div>
  );
};

export default TransparentVideoController;
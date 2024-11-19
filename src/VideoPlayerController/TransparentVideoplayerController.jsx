import React, { useState, useEffect, useRef } from "react";
import useVideoController from "./UseVideoPlayerControllerHook";
import { CiMaximize2 } from "react-icons/ci";

import { FaPauseCircle, FaPlayCircle } from "react-icons/fa";

const TransparentVideoController = ({ playerRef ,dimensions}) => {
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
      width={dimensions.width}
      
      style={{
        minWidth: dimensions.width,
        height: "35px",
        minHeight: "20px",
        background: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        alignItems: "center",
        margin:'4px 0',
        gap: "3px",
        padding: "10px 5px",
        color: "#fff",
        transition: "opacity 0.5s",
        opacity: controlsVisible ? 1 : 0,
        pointerEvents: controlsVisible ? "auto" : "none",
      }}
    >
      <div onClick={handlePlayPause} style={{ fontSize: "12px", cursor: "pointer", margin: "0 10px" }}>
        {playing ?
          <FaPauseCircle size={25} />
          :
          <FaPlayCircle size={25} />
        }
      </div>


      <input
        type="range"
        min={0}
        max={1}

        step={0.01}
        value={played}
        onChange={(e) => handleSeekChange(parseFloat(e.target.value))}
        style={{
          flexGrow: 1,
          cursor: "pointer",
          accentColor: "#ff0000",
        }}
      />

      <span style={{ marginRight: "10px", fontSize: "14px" }}>
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
        <option value={0.25}>0.25x</option>
        <option value={0.5}>0.5x</option>
        <option value={1}>1x</option>
        <option value={1.5}>1.5x</option>
        <option value={2}>2x</option>
      </select>


      <CiMaximize2
        onClick={handleFullScreen}
        style={{
          color: "#fff",
          cursor: "pointer",
          fontSize: "18px",
          marginRight: "10px",
        }}
       />
   
    </div >
  );
};

export default TransparentVideoController;

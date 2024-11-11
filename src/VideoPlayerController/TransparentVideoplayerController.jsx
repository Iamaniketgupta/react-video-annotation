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
        {playing ? <div style={{fontSize:"12px"}}><svg fill="#fff" height="20px" width="20px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M256,0C114.617,0,0,114.615,0,256s114.617,256,256,256s256-114.615,256-256S397.383,0,256,0z M224,320 c0,8.836-7.164,16-16,16h-32c-8.836,0-16-7.164-16-16V192c0-8.836,7.164-16,16-16h32c8.836,0,16,7.164,16,16V320z M352,320 c0,8.836-7.164,16-16,16h-32c-8.836,0-16-7.164-16-16V192c0-8.836,7.164-16,16-16h32c8.836,0,16,7.164,16,16V320z"></path> </g></svg></div> : <svg fill="#fff" height="20px" width="20px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M256,0C114.615,0,0,114.615,0,256s114.615,256,256,256s256-114.615,256-256S397.385,0,256,0z M280.875,269.313l-96,64 C182.199,335.094,179.102,336,176,336c-2.59,0-5.184-0.625-7.551-1.891C163.246,331.32,160,325.898,160,320V192 c0-5.898,3.246-11.32,8.449-14.109c5.203-2.773,11.516-2.484,16.426,0.797l96,64C285.328,245.656,288,250.648,288,256 S285.328,266.344,280.875,269.313z M368,320c0,8.836-7.164,16-16,16h-16c-8.836,0-16-7.164-16-16V192c0-8.836,7.164-16,16-16h16 c8.836,0,16,7.164,16,16V320z"></path> </g></svg>}
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

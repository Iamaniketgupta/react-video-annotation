import React, {  useState, useEffect } from "react";
import Canvas from "../Canvas/Canvas";
import usePlayer from "../hooks/Player";
import TransparentVideoController from "../VideoPlayerController/TransparentVideoplayerController";

const ReactPlayer = ({ url, width }) => {
  const { playerRef, getCurrentTime } = usePlayer();

  const [stageSize, setStageSize] = useState({ width: "100%", height: "100%" });
  const [scale, setScale] = useState({ scaleX: 1, scaleY: 1 });
  const [wid, setWid] = useState(width || 640);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const [wrapperSize, setWrapperSize] = useState({ width: 0, height: 0 });

  
  useEffect(() => {
    const handleResize = () => {
      const containerWidth = playerRef.current
        ? playerRef.current.offsetWidth
        : wid;
      const containerHeight = playerRef.current
        ? playerRef.current.offsetHeight
        : 360;

      setScale({
        scaleX: containerWidth / 640,
        scaleY: containerHeight / 360,
      });

      setStageSize({
        width: containerWidth,
        height: containerHeight,
      });
    };

    handleResize();
    document
      .getElementById("main-container")
      ?.addEventListener("resize", handleResize);
    return () => {
      document
        .getElementById("main-container")
        ?.removeEventListener("resize", handleResize);
    };
  }, [wid]);

  
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
      if (document.fullscreenElement) {
        setWid(window.innerWidth); 
      } else {
        setWid(640); 
      }
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);


  console.log({ isFullScreen });
  return (
    <div
      style={{
        position: "relative",
        width: `${wid}px`,
        height: "auto",
        maxWidth: "800px",
        aspectRatio: "16/9",
        overflow: "hidden",
      }}
      id="main-container"
      ref={wrapperSize}
    >
      {/* Video player for playback */}
      <video
        ref={playerRef}
        src={url || "x.mp4"}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
          objectFit: "contain",
        }}
      />

      {/* Canvas component for annotations */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 2,
        }}
      >
        <Canvas
          isFullScreen={isFullScreen}
          getCurrentTime={getCurrentTime}
          videoRef={playerRef}
          wrapperSize={wrapperSize}
          scale={scale}
        />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "10px",
          right: "17px",
          width: "100%",
          zIndex: 3,
        }}
      >
        <TransparentVideoController playerRef={playerRef} />
      </div>
    </div>
  );
};

export default ReactPlayer;

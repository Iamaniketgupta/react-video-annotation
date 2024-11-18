
// import React, { useRef, useState, useEffect } from "react";
// import Canvas from "../components/Canvas";
// import usePlayer from "../hooks/Player";
// import TransparentVideoController from "../VideoPlayerController/TransparentVideoplayerController";

// const ReactPlayer = ({ url = "hai", width = 1080 }) => {
//   const { playerRef, getCurrentTime } = usePlayer();
//   const [stageSize, setStageSize] = useState({ width: "100%", height: "100%" });
//   const [scale, setScale] = useState({ scaleX: 1, scaleY: 1 });
//   const [wid, setWid] = useState(width || 640);
//   const [isFullScreen, setIsFullScreen] = useState(false);


//   const [wrapperSize, setWrapperSize] = useState({ width: 0, height: 0 });

//   // Handle window resizing to maintain video aspect ratio
//   useEffect(() => {
//     const handleResize = () => {
//       const containerWidth = playerRef.current
//         ? playerRef.current.offsetWidth
//         : wid;
//       const containerHeight = playerRef.current
//         ? playerRef.current.offsetHeight
//         : 360;

//       setScale({
//         scaleX: containerWidth / 640,
//         scaleY: containerHeight / 360,
//       });

//       setStageSize({
//         width: containerWidth,
//         height: containerHeight,
//       });
//     };

//     handleResize();
//     document
//       .getElementById("main-container")
//       ?.addEventListener("resize", handleResize);
//     return () => {
//       document
//         .getElementById("main-container")
//         ?.removeEventListener("resize", handleResize);
//     };
//   }, [wid]);


//   // Handle fullscreen changes
//   useEffect(() => {
//     const handleFullScreenChange = () => {
//       setIsFullScreen(!!document.fullscreenElement);
//       if (document.fullscreenElement) {
//         setWid(window.innerWidth); // Update width to full window width
//       } else {
//         setWid(640); // Reset to default width
//       }
//     };

//     document.addEventListener("fullscreenchange", handleFullScreenChange);

//     return () => {
//       document.removeEventListener("fullscreenchange", handleFullScreenChange);
//     };
//   }, []);

//   return (

//     <div
//       style={{
//         position: "relative",
//         width: `${wid}px`,
//         height: "auto",
//         maxWidth: "800px",
//         aspectRatio: "16/9",
//         overflow: "hidden",
//       }}
//       id="main-container"
//       ref={wrapperSize}
//     >
//       Video player for playback
//       <video
//         ref={playerRef}
//         src={url}
//         style={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           width: "100%",
//           height: "100%",
//           zIndex: 1,
//           objectFit: "contain",
//         }}
//       />

//       {/* Canvas component for annotations */}
//       <div
//       ref = {canvasParentRef}
//         style={{
//           backgroundColor: "black",
//           width: "100%",
//           height: "100%",

//         }}
//       >
//         <Canvas
//           getCurrentTime={getCurrentTime}
//           videoRef={playerRef}
//           wrapperSize={wrapperSize}
//           scale={scale}
//         />
//       </div>


//       <div
//         style={{
//           position: "absolute",
//           bottom: "0",
//           right: "17px",
//           width: "100%",
//           zIndex: 3,
//         }}
//       >
//         <TransparentVideoController playerRef={playerRef} />
//       </div>

//     </div>


//   );
// };

// export default ReactPlayer;

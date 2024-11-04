// import React, { useRef, useState, useEffect } from 'react';
// import { Stage, Layer, Rect, Circle } from 'react-konva';
// import VideoController from './VideoPlayerController';
// import Canvas from '../components/Canvas';
// import Player from '../hooks/Player';

// const Rectangle = ({ x, y, width, height, color, scaleX, scaleY }) => (
//   <Rect
//     x={x * scaleX}
//     y={y * scaleY}
//     width={width * scaleX}
//     height={height * scaleY}
//     fill={color}
//     shadowBlur={5}
//   />
// );

// const CircleShape = ({ x, y, radius, color, scaleX, scaleY }) => (
//   <Circle
//     x={x * scaleX}
//     y={y * scaleY}
//     radius={radius * Math.min(scaleX, scaleY)}
//     fill={color}
//     shadowBlur={5}
//   />
// );

// function AnnotationOverlay({ annotations, currentTime, scaleX, scaleY }) {
//   return (
//     <Layer>
//       {annotations
//         .filter(annotation => currentTime >= annotation.startTime && currentTime <= annotation.endTime)
//         .map((annotation, index) => {
//           switch (annotation.type) {
//             case 'rectangle':
//               return <Rectangle key={index} {...annotation} scaleX={scaleX} scaleY={scaleY} />;
//             case 'circle':
//               return <CircleShape key={index} {...annotation} {...annotation} scaleX={scaleX} scaleY={scaleY} />;
//             default:
//               return null;
//           }
//         })}
//     </Layer>
//   );
// }

// const ReactPlayer = () => {
//   const {playerRef} = Player();
//   console.log(playerRef)

//   const [currentTime, setCurrentTime] = useState(0);
//   const [stageSize, setStageSize] = useState({ width: "100%", height: "100%" });
//   const [scale, setScale] = useState({ scaleX: 1, scaleY: 1 });
//   const [wid, setwid] = useState(640);
//   const [isFullScreen, setIsFullScreen] = useState(false);

//   // const annotations = [
//   //   { type: 'rectangle', x: 50, y: 60, width: 120, height: 80, color: 'rgba(255, 0, 0, 0.5)', startTime: 1, endTime: 4 },
//   //   { type: 'circle', x: 200, y: 200, radius: 40, color: 'rgba(0, 255, 0, 0.5)', startTime: 3, endTime: 6 },
//   //   { type: 'rectangle', x: 300, y: 100, width: 100, height: 50, color: 'rgba(0, 0, 255, 0.5)', startTime: 5, endTime: 8 }
//   // ];

//   useEffect(() => {
//     const handleTimeUpdate = () => {
//       setCurrentTime(playerRef.current.currentTime);
//     };

//     const video = playerRef.current;
//     video.addEventListener('timeupdate', handleTimeUpdate);

//     return () => {
//       video.removeEventListener('timeupdate', handleTimeUpdate);
//     };
//   }, []);

//   useEffect(() => {
//     const handleResize = () => {
//       const containerWidth = playerRef.current ? playerRef.current.offsetWidth : wid;
//       const containerHeight = playerRef.current ? playerRef.current.offsetHeight : 360;

//       setScale({
//         scaleX: containerWidth / 640,
//         scaleY: containerHeight / 360
//       });

//       setStageSize({
//         width: containerWidth,
//         height: containerHeight
//       });
//     };

//     handleResize();

//     window.addEventListener('resize', handleResize);
//     return () => {
//       window.removeEventListener('resize', handleResize);
//     };
//   }, [wid]);

//   // Handle fullscreen changes
//   useEffect(() => {
//     const handleFullScreenChange = () => {
//       setIsFullScreen(!!document.fullscreenElement);
//       if (document.fullscreenElement) {
//         setwid(window.innerWidth); // Update width to full window width
//       } else {
//         setwid(640); // Reset to default width
//       }
//     };

//     document.addEventListener('fullscreenchange', handleFullScreenChange);

//     return () => {
//       document.removeEventListener('fullscreenchange', handleFullScreenChange);
//     };
//   }, []);

//   return (
//     <div
//       style={{
//         position: 'relative',
//         width: `${wid}px`,
//         height: "auto",
//         maxWidth: '800px',
//         aspectRatio: '16/9',
//         overflow: 'hidden',
//       }}
//       id='main-container'
//     >
//       <video
//         ref={playerRef}
//         src="x.mp4"
//         controls
//         style={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           width: '100%',
//           height: '100%',
//           zIndex: 1,
//           objectFit: 'contain',
//         }}
//       />

//       {/* <Stage
//         style={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           zIndex: 2,
//         }}
//         width={stageSize.width}
//         height={stageSize.height}
//       >
//         <AnnotationOverlay
//           annotations={annotations}
//           currentTime={currentTime}
//           scaleX={scale.scaleX}
//           scaleY={scale.scaleY}
//         />
//       </Stage> */}
//         <Canvas />
//       <div
//         id="video-controller"
//         style={{
//           position: 'absolute',
//           bottom: '10px',
//           right: '10px',
//           zIndex: 4,
//         }}
//       >
//         <VideoController playerRef={playerRef} setwid={setwid} />
//       </div>
//     </div>
//   );
// };

// export default ReactPlayer;


import React, { useRef, useState, useEffect } from 'react';
import VideoController from './VideoPlayerController';
import Canvas from '../components/Canvas';
import usePlayer from '../hooks/Player';

const ReactPlayer = () => {
  const { playerRef, getCurrentTime } = usePlayer();
  const [stageSize, setStageSize] = useState({ width: '100%', height: '100%' });
  const [scale, setScale] = useState({ scaleX: 1, scaleY: 1 });
  const [wid, setWid] = useState(640);
  const [isFullScreen, setIsFullScreen] = useState(false)

  const wrapperRef = useRef(null);
  const [wrapperSize, setWrapperSize] = useState({ width: 0, height: 0 });

 

  // Handle window resizing to maintain video aspect ratio
  useEffect(() => {
    const handleResize = () => {
      const containerWidth = playerRef.current ? playerRef.current.offsetWidth : wid;
      const containerHeight = playerRef.current ? playerRef.current.offsetHeight : 360;

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
    document.getElementById("main-container").addEventListener('resize', handleResize);
    return () => {
      document.getElementById("main-container").removeEventListener('resize', handleResize);
    };
  }, [wid]);

  console.log({scale})
  
  // Handle fullscreen changes
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
      if (document.fullscreenElement) {
        setWid(window.innerWidth); // Update width to full window width
      } else {
        setWid(640); // Reset to default width
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: `${wid}px`,
        height: 'auto',
        maxWidth: '800px',
        aspectRatio: '16/9',
        overflow: 'hidden',
      }}
      id="main-container"
      ref={wrapperSize}
    >
      {/* Video player for playback */}
      <video
        ref={playerRef}
        src="x.mp4" // replace with your video source
        controls
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          objectFit: 'contain',
        }}
      />


      {/* Canvas component for annotations */}
      <div style={{position:"absolute" ,top:0,left:0,width:"100%",height:"100%",  zIndex:2 }} >
      <Canvas getCurrentTime={getCurrentTime} videoRef={playerRef} wrapperSize={wrapperSize} scale={scale} />
      </div>



      {/* Video controls */}
      <div
        id="video-controller"
        style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          zIndex: 4,
        }}
      >
        <VideoController playerRef={playerRef} setWid={setWid} />
      </div>
    </div>
  );
};

export default ReactPlayer;

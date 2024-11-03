import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Rect, Circle } from 'react-konva';
import VideoController from './VideoPlayerController';

const Rectangle = ({ x, y, width, height, color, scaleX, scaleY }) => (
  <Rect
    x={x * scaleX}
    y={y * scaleY}
    width={width * scaleX}
    height={height * scaleY}
    fill={color}
    shadowBlur={5}
  />
);

const CircleShape = ({ x, y, radius, color, scaleX, scaleY }) => (
  <Circle
    x={x * scaleX}
    y={y * scaleY}
    radius={radius * Math.min(scaleX, scaleY)}
    fill={color}
    shadowBlur={5}
  />
);

function AnnotationOverlay({ annotations, currentTime, scaleX, scaleY }) {
  return (
    <Layer>
      {annotations
        .filter(annotation => currentTime >= annotation.startTime && currentTime <= annotation.endTime)
        .map((annotation, index) => {
          switch (annotation.type) {
            case 'rectangle':
              return <Rectangle key={index} {...annotation} scaleX={scaleX} scaleY={scaleY} />;
            case 'circle':
              return <CircleShape key={index} {...annotation} {...annotation} scaleX={scaleX} scaleY={scaleY} />;
            default:
              return null;
          }
        })}
    </Layer>
  );
}

const ReactPlayer = () => {
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [stageSize, setStageSize] = useState({ width: "100%", height: "100%" });
  const [scale, setScale] = useState({ scaleX: 1, scaleY: 1 });
  const [wid, setwid] = useState(640);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const annotations = [
    { type: 'rectangle', x: 50, y: 60, width: 120, height: 80, color: 'rgba(255, 0, 0, 0.5)', startTime: 1, endTime: 4 },
    { type: 'circle', x: 200, y: 200, radius: 40, color: 'rgba(0, 255, 0, 0.5)', startTime: 3, endTime: 6 },
    { type: 'rectangle', x: 300, y: 100, width: 100, height: 50, color: 'rgba(0, 0, 255, 0.5)', startTime: 5, endTime: 8 }
  ];

  useEffect(() => {
    const handleTimeUpdate = () => {
      setCurrentTime(videoRef.current.currentTime);
    };

    const video = videoRef.current;
    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const containerWidth = videoRef.current ? videoRef.current.offsetWidth : wid;
      const containerHeight = videoRef.current ? videoRef.current.offsetHeight : 360;

      setScale({
        scaleX: containerWidth / 640,
        scaleY: containerHeight / 360
      });

      setStageSize({
        width: containerWidth,
        height: containerHeight
      });
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [wid]);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
      if (document.fullscreenElement) {
        setwid(window.innerWidth); // Update width to full window width
      } else {
        setwid(640); // Reset to default width
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
        height: "auto",
        maxWidth: '800px',
        aspectRatio: '16/9',
        overflow: 'hidden',
      }}
      id='main-container'
    >
      <video
        ref={videoRef}
        src="x.mp4"
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

      <Stage
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 2,
        }}
        width={stageSize.width}
        height={stageSize.height}
      >
        <AnnotationOverlay
          annotations={annotations}
          currentTime={currentTime}
          scaleX={scale.scaleX}
          scaleY={scale.scaleY}
        />
      </Stage>

      <div
        id="video-controller"
        style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          zIndex: 4,
        }}
      >
        <VideoController playerRef={videoRef} setwid={setwid} />
      </div>
    </div>
  );
};

export default ReactPlayer;


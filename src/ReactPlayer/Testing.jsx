import React, { useRef, useState, useEffect } from 'react';

// Custom Video Player Component
const CustomVideoPlayer = () => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Play/Pause Video
  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Show controls when mouse is moved, then hide them after a delay
  useEffect(() => {
    let controlTimeout;
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(controlTimeout);
      controlTimeout = setTimeout(() => {
        setShowControls(false);
      }, 3000); // Hide controls after 3 seconds of inactivity
    };

    if (isFullscreen) {
      document.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      clearTimeout(controlTimeout);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isFullscreen]);

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '100%', height: '100vh', backgroundColor: '#000' }}
    >
      <video
        ref={videoRef}
        src="x.mp4"
        style={{ width: '100%', height: '100%' }}
        onClick={togglePlay} // Clicking on the video toggles play/pause
        onEnded={() => setIsPlaying(false)} // Reset play button on end
      />

      {/* Custom Controls Overlay */}
      <div
        style={{
          display: showControls ? 'flex' : 'none',
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(255, 0, 0, 0.7)', // Changed to red for visibility
          padding: '10px 20px',
          borderRadius: '5px',
          zIndex: 10, // Ensure it's above other content
          alignItems: 'center'
        }}
      >
        {/* Play/Pause Button */}
        <button onClick={togglePlay} style={controlButtonStyle}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>

        {/* Fullscreen Button */}
        <button onClick={toggleFullscreen} style={controlButtonStyle}>
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>
    </div>
  );
};

const controlButtonStyle = {
  color: 'white',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '5px 10px',
  fontSize: '16px',
  margin: '0 10px',
};

// Usage
export default CustomVideoPlayer;

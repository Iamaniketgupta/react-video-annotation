import React, { forwardRef, useEffect, useRef } from 'react';

const Player = forwardRef(function VideoElem(props, ref) {
    const playerRef = useRef();
    useEffect(() => {
        if (!playerRef) return;

        ref.current = playerRef.current;
        const videoElement = playerRef.current;
        console.log(props.url)
        videoElement.src = props?.url;
        videoElement.crossOrigin = 'anonymous';
        videoElement.loop=true;
        videoElement.autoPlay=true;
        videoElement.addEventListener('loadeddata', () => {
        });

        return () => {
            videoElement.removeEventListener('loadeddata', () => { });
        };
    }, [props?.parentref, props.url, ref]);

    return <video style={{
        minHeight: 300,
        objectFit: "cover",
        minWidth: 500,
        position: "absolute", 
        top: 0,
        left: 0,
        width: props.dimensions.width, 
        height: props.dimensions.height, 
    }} ref={playerRef} {...props} preload='auto' controls={false}  />;
});
export default Player;



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

    return <video ref={playerRef} {...props} controls={false} hidden />;
});
export default Player;



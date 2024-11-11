import { useRef } from 'react';

export default function usePlayer() {
    const playerRef = useRef(null);

    /*
    * Get the current time of the video
    * @returns {number} time in milliseconds
    */
    const getCurrentTime = () => {
        if (playerRef.current) {
            const currentTimeInMs = Math.floor(playerRef.current?.currentTime * 1000);
            console.log(currentTimeInMs);
            return currentTimeInMs;
        }
        return 0; 
    };

    return {
        playerRef,
        getCurrentTime
    };
}

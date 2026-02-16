import React, { useState, useRef, useEffect } from 'react';
import { Music, Pause, Play } from 'lucide-react';

const MusicPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    // Local file in public folder
    const musicUrl = "/dil.mp3";

    useEffect(() => {
        // Handle autoplay on first user interaction if blocked
        const handleInteraction = () => {
            if (audioRef.current && audioRef.current.paused) {
                // Ensure we respect the start time if not already played
                if (audioRef.current.currentTime < 33) {
                    audioRef.current.currentTime = 33;
                }
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            setIsPlaying(true);
                            // Remove listeners once playing
                            document.removeEventListener('click', handleInteraction);
                            document.removeEventListener('keydown', handleInteraction);
                            document.removeEventListener('touchstart', handleInteraction);
                        })
                        .catch((error) => {
                            console.log("Autoplay still prevented:", error);
                        });
                }
            }
        };

        document.addEventListener('click', handleInteraction);
        document.addEventListener('keydown', handleInteraction);
        document.addEventListener('touchstart', handleInteraction);

        return () => {
            document.removeEventListener('click', handleInteraction);
            document.removeEventListener('keydown', handleInteraction);
            document.removeEventListener('touchstart', handleInteraction);
        };
    }, []);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="music-player" style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 100, display: 'none' }}>
            <audio ref={audioRef} src={musicUrl} loop />
            <button
                onClick={togglePlay}
                style={{
                    background: 'rgba(255, 77, 109, 0.8)',
                    borderRadius: '50%',
                    padding: '12px',
                    boxShadow: '0 4px 15px rgba(255, 77, 109, 0.4)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
        </div>
    );

};

export default MusicPlayer;

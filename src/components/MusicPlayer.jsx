import React, { useState, useRef, useEffect } from 'react';
import { Music, Pause, Play } from 'lucide-react';

const MusicPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    // Default romantic music URL (royalty free or placeholder)
    // Using a sample URL for now. In production, user should upload a file to assets.
    const musicUrl = "https://cdn.pixabay.com/download/audio/2022/02/07/audio_184f4b97d1.mp3?filename=piano-moment-116298.mp3";

    useEffect(() => {
        // Attempt autoplay
        if (audioRef.current) {
            audioRef.current.volume = 0.5;
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setIsPlaying(true);
                    })
                    .catch((error) => {
                        console.log("Autoplay prevented by browser:", error);
                        setIsPlaying(false);
                    });
            }
        }
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
        <div className="music-player" style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 100 }}>
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
            {!isPlaying && (
                <div style={{ position: 'absolute', right: '60px', bottom: '10px', background: 'white', color: 'black', padding: '5px 10px', borderRadius: '20px', fontSize: '12px', whiteSpace: 'nowrap', opacity: 0.8 }}>
                    Tap to Play Music 🎵
                </div>
            )}
        </div>
    );
};

export default MusicPlayer;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const TypewriterText = ({ text, onComplete }) => {
    const [displayText, setDisplayText] = useState('');
    const [index, setIndex] = useState(0);

    React.useEffect(() => {
        if (index < text.length) {
            const timer = setTimeout(() => {
                setDisplayText((prev) => prev + text.charAt(index));
                setIndex((prev) => prev + 1);
            }, 50); // Typing speed
            return () => clearTimeout(timer);
        } else {
            if (onComplete) onComplete();
        }
    }, [index, text, onComplete]);

    return <span>{displayText}</span>;
};

const LoveGame = () => {
    const [gameState, setGameState] = useState('playing'); // 'playing', 'typing', 'revealed'

    const handleReveal = () => {
        setGameState('typing');
    };

    const handleTypingComplete = () => {
        setGameState('revealed');
        // Trigger generic confetti
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#8B0000', '#ff4d6d', '#ffffff']
        });

        // Trigger rose petals effect (simulated with shapes/colors)
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: ['#ff4d6d', '#8B0000'],
                shapes: ['circle']
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ['#ff4d6d', '#8B0000'],
                shapes: ['circle']
            });
        }, 250);
    };

    const buttonStyle = {
        padding: '15px 40px',
        fontSize: '1.5rem',
        background: 'rgba(139, 0, 0, 0.3)',
        color: 'white',
        borderRadius: '50px',
        border: '2px solid #ff4d6d',
        cursor: 'pointer',
        backdropFilter: 'blur(5px)',
        boxShadow: '0 4px 15px rgba(255, 77, 109, 0.3)',
        transition: 'all 0.3s ease'
    };

    return (
        <div style={{ textAlign: 'center', padding: '100px 20px', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '60px', color: '#ff4d6d', textShadow: '0 0 20px rgba(139, 0, 0, 0.6)' }}>Guess how much I love you?</h2>

            <AnimatePresence mode='wait'>
                {gameState === 'playing' ? (
                    <motion.div
                        key="buttons"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}
                    >
                        {['30%', '50%', '100%'].map((percent) => (
                            <motion.button
                                key={percent}
                                whileHover={{ scale: 1.1, backgroundColor: 'rgba(139, 0, 0, 0.8)' }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleReveal}
                                style={buttonStyle}
                            >
                                {percent}
                            </motion.button>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '300px' }}
                    >

                        <h3 style={{ fontSize: '2rem', color: '#fff', marginBottom: '30px', minHeight: '3rem' }}>
                            <TypewriterText text="Wrong ❤️ My love for you is Infinity ♾️" onComplete={handleTypingComplete} />
                        </h3>

                        {gameState === 'revealed' && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", bounce: 0.5 }}
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                                    style={{
                                        fontSize: 'clamp(5rem, 15vw, 10rem)',
                                        background: 'linear-gradient(45deg, #ff4d6d, #8B0000)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        filter: 'drop-shadow(0 0 30px rgba(255, 77, 109, 0.6))',
                                        margin: '20px 0'
                                    }}
                                >
                                    ♾️
                                </motion.div>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    style={{ fontSize: 'clamp(1.2rem, 3vw, 2rem)', color: '#ffccd5', marginTop: '20px', fontFamily: 'var(--font-heading)' }}
                                >
                                    Happy Valentine’s Day My Love 💖
                                </motion.p>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LoveGame;

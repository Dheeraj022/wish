import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const LoveGame = () => {
    const [showResult, setShowResult] = useState(false);

    const handleClick = () => {
        setShowResult(true);
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#8B0000', '#ff4d6d', '#ffffff']
        });
    };

    return (
        <div style={{ textAlign: 'center', padding: '100px 20px', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '40px', color: 'white' }}>Guess how much I love you?</h2>

            <AnimatePresence mode='wait'>
                {!showResult ? (
                    <motion.button
                        key="button"
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.1, 1] }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        onClick={handleClick}
                        style={{
                            padding: '20px 60px',
                            fontSize: '2rem',
                            background: '#8B0000',
                            color: 'white',
                            borderRadius: '50px',
                            boxShadow: '0 0 20px rgba(139, 0, 0, 0.5)',
                            border: '2px solid #ff4d6d'
                        }}
                    >
                        100%
                    </motion.button>
                ) : (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, type: 'spring' }}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                        <h3 style={{ fontSize: '2rem', color: '#ff4d6d', marginBottom: '20px' }}>
                            Wrong ❤️ My love for you is Infinity
                        </h3>

                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                            style={{
                                fontSize: '8rem',
                                color: '#fff',
                                textShadow: '0 0 20px #ff4d6d, 0 0 40px #8B0000',
                                margin: '20px 0'
                            }}
                        >
                            ♾️
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            style={{ fontSize: '1.5rem', marginTop: '20px' }}
                        >
                            Happy Valentine’s Day My Love 💖
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LoveGame;

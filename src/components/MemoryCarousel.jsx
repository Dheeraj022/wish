import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MemoryCarousel = ({ memories }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!memories || memories.length === 0) return null;

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % memories.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + memories.length) % memories.length);
    };

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <h2 style={{
                color: 'var(--color-love-red)',
                fontSize: 'clamp(2rem, 5vw, 4rem)',
                marginBottom: '40px',
                textShadow: '0 0 20px rgba(255, 77, 109, 0.5)'
            }}>
                Our Beautiful Moments
            </h2>

            <div style={{ position: 'relative', width: '100%', maxWidth: '500px', height: '600px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                        transition={{ duration: 0.5 }}
                        className="glass-card"
                        style={{
                            width: '90%',
                            height: '100%',
                            padding: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'absolute'
                        }}
                    >
                        <div style={{ flex: 1, overflow: 'hidden', borderRadius: '15px', marginBottom: '20px' }}>
                            <img
                                src={memories[currentIndex].image_url}
                                alt={memories[currentIndex].year}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <h3 style={{ fontSize: '3rem', color: '#ff4d6d', fontFamily: 'var(--font-heading)' }}>
                                {memories[currentIndex].year}
                            </h3>
                            <p style={{ fontSize: '1.2rem', color: '#eee', lineHeight: '1.6', marginTop: '10px' }}>
                                {memories[currentIndex].message}
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <button
                    onClick={prevSlide}
                    style={{
                        position: 'absolute',
                        left: '0',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '50%',
                        padding: '10px',
                        color: 'white',
                        zIndex: 10
                    }}
                >
                    <ChevronLeft size={40} />
                </button>
                <button
                    onClick={nextSlide}
                    style={{
                        position: 'absolute',
                        right: '0',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '50%',
                        padding: '10px',
                        color: 'white',
                        zIndex: 10
                    }}
                >
                    <ChevronRight size={40} />
                </button>
            </div>

            {/* Dots Indicator */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                {memories.map((_, idx) => (
                    <div
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: idx === currentIndex ? '#ff4d6d' : 'rgba(255, 255, 255, 0.3)',
                            cursor: 'pointer',
                            transition: 'background 0.3s'
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default MemoryCarousel;

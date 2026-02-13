import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MemoryCarousel = ({ memories }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!memories || memories.length === 0) return null;

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % memories.length);
    };

    // Calculate the indices of the 3 visible cards
    const visibleMemories = [
        memories[currentIndex % memories.length],
        memories[(currentIndex + 1) % memories.length],
        memories[(currentIndex + 2) % memories.length]
    ].reverse(); // Reverse so the first element (top card) is rendered last in DOM (highest z-index by default, though we set it explicitly)

    // Helper to get properties based on stack position (0 = top, 1 = middle, 2 = bottom)
    const getStackProps = (indexFromTop) => {
        if (indexFromTop === 0) { // Top Card
            return {
                scale: 1,
                y: 0,
                rotate: 0,
                opacity: 1,
                zIndex: 3,
                filter: 'blur(0px)'
            };
        } else if (indexFromTop === 1) { // Second Card
            return {
                scale: 0.92,
                y: 30,
                rotate: -2,
                opacity: 0.7,
                zIndex: 2,
                filter: 'blur(1px)'
            };
        } else if (indexFromTop === 2) { // Third Card
            return {
                scale: 0.84,
                y: 60,
                rotate: 2,
                opacity: 0.4,
                zIndex: 1,
                filter: 'blur(3px)'
            };
        }
        return {};
    };

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, var(--color-bg-dark), var(--color-bg-light))' // Ensure bg matches theme
        }}>
            <h2 style={{
                color: 'var(--color-love-red)',
                fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                marginBottom: '50px',
                textShadow: '0 0 25px rgba(255, 77, 109, 0.6)',
                zIndex: 10,
                fontFamily: 'var(--font-heading)',
                textAlign: 'center'
            }}>
                Our Beautiful Moments
            </h2>

            {/* Carousel Container */}
            <div
                style={{
                    position: 'relative',
                    width: 'min(90vw, 360px)',
                    height: '520px',
                    perspective: '1200px',
                    cursor: 'pointer'
                }}
                onClick={handleNext}
            >
                <AnimatePresence initial={false} mode="popLayout">
                    {/* 
                     We map based on the visible stack. 
                     We key by memory ID to let Framer Motion track the elements moving positions.
                    */}
                    {[...Array(3)].map((_, i) => {
                        const offset = i; // 0, 1, 2
                        const memoryIndex = (currentIndex + offset) % memories.length;
                        const memory = memories[memoryIndex];
                        const props = getStackProps(offset);

                        return (
                            <motion.div
                                key={memory.id} // Key persists the instance
                                layout // Allow smooth layout transitions (shifts up)
                                initial={false} // Don't animate on first render
                                animate={{
                                    scale: props.scale,
                                    y: props.y,
                                    rotate: props.rotate,
                                    opacity: props.opacity,
                                    zIndex: props.zIndex,
                                    filter: props.filter
                                }}
                                exit={{
                                    x: -500, // Move completely off-screen
                                    rotate: -20, // Rotate more
                                    opacity: 1, // No fade
                                    scale: 0.9,
                                    transition: { duration: 0.5, ease: "easeInOut" }
                                }}
                                transition={{
                                    duration: 0.7,
                                    ease: [0.25, 0.8, 0.25, 1] // Smooth cubic-bezier
                                }}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '25px',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(15px)',
                                    border: '1px solid rgba(255, 77, 109, 0.3)',
                                    boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transformOrigin: 'bottom center'
                                }}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                onDragEnd={(e, { offset, velocity }) => {
                                    if (Math.abs(offset.x) > 50 || Math.abs(velocity.x) > 500) {
                                        handleNext();
                                    }
                                }}
                            >
                                <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                                    <img
                                        src={memory.image_url}
                                        alt={memory.year}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        draggable="false"
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        width: '100%',
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                                        padding: '40px 20px 20px',
                                        textAlign: 'center'
                                    }}>
                                        <h3 style={{
                                            fontSize: '3rem',
                                            color: '#ff4d6d',
                                            marginBottom: '5px',
                                            fontFamily: 'var(--font-heading)'
                                        }}>
                                            {memory.year}
                                        </h3>
                                        <p style={{
                                            color: 'rgba(255,255,255,0.9)',
                                            fontSize: '1.1rem',
                                            lineHeight: '1.5'
                                        }}>
                                            {memory.message}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            <motion.p
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{
                    marginTop: '50px',
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: '0.9rem',
                    letterSpacing: '1px'
                }}
            >
                SWIPE LEFT / RIGHT OR CLICK TO EXPLORE
            </motion.p>
        </div>
    );
};

export default MemoryCarousel;

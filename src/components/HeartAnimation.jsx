import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const HeartAnimation = () => {
    const [hearts, setHearts] = useState([]);

    useEffect(() => {
        // Generate hearts periodically
        const interval = setInterval(() => {
            const id = Date.now();
            const style = {
                left: Math.random() * 100 + 'vw',
                animationDuration: Math.random() * 5 + 5 + 's', // 5-10s duration
                opacity: Math.random() * 0.5 + 0.3,
                scale: Math.random() * 0.5 + 0.8,
            };
            setHearts((prev) => [...prev, { id, style }]);

            // Remove old hearts to prevent memory leaks
            if (hearts.length > 20) {
                setHearts((prev) => prev.slice(1));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="heart-container" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: -1, overflow: 'hidden' }}>
            {hearts.map((heart) => (
                <motion.div
                    key={heart.id}
                    initial={{ y: '100vh', opacity: 0 }}
                    animate={{ y: '-10vh', opacity: heart.style.opacity }}
                    transition={{ duration: parseFloat(heart.style.animationDuration), ease: 'linear' }}
                    style={{
                        position: 'absolute',
                        left: heart.style.left,
                        fontSize: `${heart.style.scale * 2}rem`,
                        color: '#8B0000',
                        textShadow: '0 0 5px rgba(255, 77, 109, 0.5)',
                    }}
                >
                    ❤️
                </motion.div>
            ))}
        </div>
    );
};

export default HeartAnimation;

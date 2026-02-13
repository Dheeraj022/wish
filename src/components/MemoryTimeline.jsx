import React from 'react';
import { motion } from 'framer-motion';

const MemoryTimeline = ({ memories }) => {
    if (!memories || memories.length === 0) return null;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '50px', color: '#ff4d6d', fontSize: '3rem' }}>Our Journey</h2>
            <div style={{ position: 'relative' }}>
                {/* Vertical Line */}
                <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', background: 'rgba(255, 77, 109, 0.3)', transform: 'translateX(-50%)' }}></div>

                {memories.map((memory, index) => (
                    <motion.div
                        key={memory.id}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        style={{
                            display: 'flex',
                            justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end',
                            marginBottom: '60px',
                            position: 'relative'
                        }}
                    >
                        {/* Card */}
                        <div
                            className="memory-card"
                            style={{
                                width: '45%',
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(10px)',
                                padding: '20px',
                                borderRadius: '15px',
                                border: '1px solid rgba(255, 77, 109, 0.1)',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                transition: 'transform 0.3s ease',
                                cursor: 'default'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            {memory.image_url && (
                                <img
                                    src={memory.image_url}
                                    alt={memory.year}
                                    style={{ width: '100%', borderRadius: '10px', marginBottom: '15px', objectFit: 'cover', maxHeight: '300px' }}
                                />
                            )}
                            <h3 style={{ color: '#ff4d6d', fontSize: '2rem', marginBottom: '10px' }}>{memory.year}</h3>
                            <p style={{ lineHeight: '1.6', fontSize: '1.1rem', color: '#eee' }}>{memory.message}</p>
                        </div>

                        {/* Dot on timeline */}
                        <div style={{
                            position: 'absolute',
                            left: '50%',
                            top: '20px',
                            width: '20px',
                            height: '20px',
                            background: '#8B0000',
                            border: '4px solid #ff4d6d',
                            borderRadius: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 2
                        }}></div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default MemoryTimeline;

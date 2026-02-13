import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 20px', overflow: 'hidden' }}>
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1 }}
                style={{ zIndex: 1 }}
            >
                <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', color: '#ff4d6d', marginBottom: '20px', textShadow: '0 0 20px rgba(139, 0, 0, 0.5)' }}>
                    To The Love of My Life ❤️
                </h1>
                <p style={{ fontSize: 'clamp(1rem, 3vw, 1.5rem)', color: '#cccccc', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.6' }}>
                    Every moment with you feels magical.
                    <br />
                    <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>(Create your own love story below)</span>
                </p>

                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/login" style={{
                        padding: '15px 40px',
                        background: '#8B0000',
                        color: 'white',
                        borderRadius: '50px',
                        fontSize: '1.2rem',
                        boxShadow: '0 10px 30px rgba(139, 0, 0, 0.4)',
                        transition: 'transform 0.2s'
                    }}>
                        Login
                    </Link>
                    <Link to="/register" style={{
                        padding: '15px 40px',
                        background: 'transparent',
                        border: '2px solid #ff4d6d',
                        color: '#ff4d6d',
                        borderRadius: '50px',
                        fontSize: '1.2rem',
                        backdropFilter: 'blur(5px)'
                    }}>
                        Create Yours
                    </Link>
                </div>
            </motion.div>

            {/* Background Decorative Elements */}
            <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '30%', background: 'linear-gradient(to top, #0a0a0a, transparent)', zIndex: 0 }}></div>
        </div>
    );
};

export default LandingPage;

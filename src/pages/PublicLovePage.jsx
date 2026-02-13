import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProfileBySlug } from '../services/profileService';
import { getMemories } from '../services/memoryService';
import MemoryCarousel from '../components/MemoryCarousel'; // Updated import
import LoveGame from '../components/LoveGame';

const PublicLovePage = () => {
    const { slug } = useParams();
    const [profile, setProfile] = useState(null);
    const [memories, setMemories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const { data: profileData, error: profileError } = await getProfileBySlug(slug);

            if (profileError || !profileData) {
                setError("Love page not found.");
                setLoading(false);
                return;
            }

            setProfile(profileData);

            const { data: memoriesData, error: memoriesError } = await getMemories(profileData.id);
            if (memoriesData) {
                setMemories(memoriesData);
            }
            setLoading(false);
        };

        fetchData();
    }, [slug]);

    if (loading) return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                style={{ fontSize: '3rem' }}
            >
                ❤️
            </motion.div>
        </div>
    );

    if (error) return <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '1.5rem' }}>{error}</div>;

    return (
        <div className="love-page" style={{ overflowX: 'hidden' }}>
            {/* Hero Section */}
            <section style={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative'
            }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                >
                    <h1 style={{
                        fontSize: 'clamp(3.5rem, 8vw, 6rem)',
                        marginBottom: '20px',
                        color: 'var(--color-love-red)',
                        textShadow: '0 0 30px rgba(255, 77, 109, 0.6)'
                    }}>
                        To The Love of My Life ❤️
                    </h1>
                </motion.div>

                {profile?.username && (
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', color: '#fff', marginBottom: '20px', fontFamily: 'var(--font-heading)' }}
                    >
                        {profile.username}
                    </motion.h2>
                )}

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    style={{ fontSize: 'clamp(1rem, 3vw, 1.5rem)', color: '#e0e0e0', maxWidth: '600px', padding: '0 20px', lineHeight: '1.6' }}
                >
                    Every moment with you feels magical. This is our beautiful journey.
                </motion.p>

                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    style={{ position: 'absolute', bottom: '40px', fontSize: '2rem', color: 'rgba(255,255,255,0.7)' }}
                >
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                    </svg>
                </motion.div>
            </section>

            {/* Memory Carousel Section */}
            <section id="memories" style={{ minHeight: '100vh' }}>
                <MemoryCarousel memories={memories} />
            </section>

            {/* Love Game Section */}
            <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LoveGame name={profile?.username} />
            </section>

            <footer style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
                Made with ❤️ for Valentine's Day
            </footer>
        </div>
    );
};

export default PublicLovePage;


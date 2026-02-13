import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProfileBySlug } from '../services/profileService';
import { getMemories } from '../services/memoryService';
import MemoryTimeline from '../components/MemoryTimeline';
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
        <div className="love-page">
            {/* Hero Section */}
            <section style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: 'linear-gradient(to bottom, transparent, #0a0a0a)' }}>
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    style={{ fontSize: '4rem', marginBottom: '20px', color: '#ff4d6d' }}
                >
                    To The Love of My Life ❤️
                </motion.h1>
                {profile?.username && (
                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 1 }}
                        style={{ fontSize: '2rem', color: '#fff', marginBottom: '20px', fontFamily: 'var(--font-family-heading)' }}
                    >
                        {profile.username}
                    </motion.h2>
                )}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    style={{ fontSize: '1.5rem', color: '#ccc', maxWidth: '600px', padding: '0 20px' }}
                >
                    Every moment with you feels magical. Scroll down to see our journey.
                </motion.p>

                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    style={{ position: 'absolute', bottom: '30px', fontSize: '2rem', color: '#8B0000' }}
                >
                    ⬇️
                </motion.div>
            </section>

            {/* Memory Timeline */}
            <section id="memories" style={{ minHeight: '100vh' }}>
                <MemoryTimeline memories={memories} />
            </section>

            {/* Love Game */}
            <section style={{ paddingBottom: '100px' }}>
                <LoveGame />
            </section>

            <footer style={{ textAlign: 'center', padding: '20px', color: '#555', fontSize: '0.8rem' }}>
                Made with ❤️ for Valentine's Day
            </footer>
        </div>
    );
};

export default PublicLovePage;

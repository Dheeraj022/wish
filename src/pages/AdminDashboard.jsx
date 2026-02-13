import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getMemories, createMemory, deleteMemory, uploadImage } from '../services/memoryService';
import { getProfile } from '../services/profileService';
import { useNavigate } from 'react-router-dom';
import { Trash2, Link as LinkIcon, Upload } from 'lucide-react';

const AdminDashboard = () => {
    const { user, signOut, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [memories, setMemories] = useState([]);
    const [year, setYear] = useState('');
    const [message, setMessage] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [slug, setSlug] = useState('');

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
        }
        if (user) {
            fetchMemories();
            fetchProfileData();
        }
    }, [user, authLoading, navigate]);

    const fetchMemories = async () => {
        const { data, error } = await getMemories(user.id);
        if (data) setMemories(data);
    };

    const fetchProfileData = async () => {
        const { data, error } = await getProfile(user.id);

        if (data) {
            setSlug(data.slug || data.id);
        } else {
            // Profile might be missing if registration happened before table creation
            // Try to create it now
            const username = user.user_metadata?.username || 'user';
            const { data: newData, error: createError } = await import('../services/profileService').then(m => m.createProfile(user.id, username));

            if (newData) {
                setSlug(newData.slug);
            } else {
                console.error("Failed to create profile:", createError);
                // Fallback to ID
                setSlug(user.id);
            }
        }
    };

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    const handleAddMemory = async (e) => {
        e.preventDefault();
        if (!image || !year || !message) return alert("Please fill all fields");
        if (memories.length >= 5) return alert("Maximum 5 memories allowed based on the plan.");

        setUploading(true);
        const { publicUrl, error: uploadError } = await uploadImage(image, user.id);

        if (uploadError) {
            alert("Image upload failed: " + uploadError.message);
            setUploading(false);
            return;
        }

        const { error: dbError } = await createMemory(user.id, publicUrl, year, message);
        if (dbError) {
            alert("Failed to save memory: " + dbError.message);
        } else {
            setYear('');
            setMessage('');
            setImage(null);
            fetchMemories();
        }
        setUploading(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure?")) {
            const { error } = await deleteMemory(id);
            if (!error) fetchMemories();
        }
    };

    if (authLoading) return <div>Loading...</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', color: 'white' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h2>Admin Dashboard</h2>
                <button onClick={handleLogout} style={{ padding: '8px 16px', background: '#333', color: 'white', borderRadius: '5px' }}>Logout</button>
            </header>

            <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
                <h3>Add New Memory ({memories.length}/5)</h3>
                <form onSubmit={handleAddMemory} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            placeholder="Year (e.g. 2023)"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            style={{ flex: 1, padding: '10px', background: '#333', border: 'none', color: 'white', borderRadius: '5px' }}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                            style={{ flex: 2, padding: '10px', background: '#333', border: 'none', color: 'white', borderRadius: '5px' }}
                        />
                    </div>
                    <textarea
                        placeholder="Message (e.g. The first time we met...)"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        style={{ padding: '10px', background: '#333', border: 'none', color: 'white', borderRadius: '5px', minHeight: '80px' }}
                    />
                    <button
                        type="submit"
                        disabled={uploading || memories.length >= 5}
                        style={{
                            padding: '12px',
                            background: uploading ? '#555' : '#8B0000',
                            color: 'white',
                            borderRadius: '5px',
                            cursor: uploading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {uploading ? 'Uploading...' : 'Add Memory'}
                    </button>
                </form>
            </div>

            <div className="memory-list">
                <h3>Your Memories</h3>
                {memories.length === 0 && <p style={{ color: '#888' }}>No memories yet.</p>}
                {memories.map(mem => (
                    <div key={mem.id} style={{ display: 'flex', alignItems: 'center', background: '#222', padding: '10px', marginBottom: '10px', borderRadius: '8px' }}>
                        <img src={mem.image_url} alt={mem.year} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '5px', marginRight: '15px' }} />
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 'bold', color: '#ff4d6d' }}>{mem.year}</div>
                            <div style={{ fontSize: '0.9rem', color: '#ddd' }}>{mem.message}</div>
                        </div>
                        <button onClick={() => handleDelete(mem.id)} style={{ color: '#ff4d6d', background: 'transparent' }}>
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Share Link Section */}
            <div style={{ marginTop: '40px', textAlign: 'center', background: '#222', padding: '20px', borderRadius: '10px' }}>
                <p>Share your love page:</p>
                {slug ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                        <code style={{ background: '#333', padding: '10px', borderRadius: '5px', color: '#ff4d6d' }}>
                            {window.location.origin}/love/{slug}
                        </code>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/love/${slug}`);
                                alert("Link copied!");
                            }}
                            style={{ background: 'transparent', color: '#ff4d6d' }}
                            title="Copy Link"
                        >
                            <LinkIcon />
                        </button>
                    </div>
                ) : (
                    <p>Loading link...</p>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;


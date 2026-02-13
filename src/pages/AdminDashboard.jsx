import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getMemories, createMemory, deleteMemory, uploadImage } from '../services/memoryService';
import { getProfile, createProfile, updateProfile } from '../services/profileService';
import { useNavigate } from 'react-router-dom';
import { Trash2, Link as LinkIcon, Upload, Save } from 'lucide-react';

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
    const [displayName, setDisplayName] = useState('');
    const [isEditingName, setIsEditingName] = useState(false);

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
            setDisplayName(data.username || '');
        } else {
            // Profile might be missing if registration happened before table creation
            // Try to create it now
            const username = user.user_metadata?.username || 'user';
            const { data: newData, error: createError } = await createProfile(user.id, username);

            if (newData) {
                setSlug(newData.slug);
                setDisplayName(newData.username);
            } else {
                console.error("Failed to create profile:", createError);
                // Fallback to ID
                setSlug(user.id);
            }
        }
    };

    const handleUpdateName = async () => {
        if (!displayName.trim()) return alert("Name cannot be empty");

        const { error } = await updateProfile(user.id, { username: displayName });
        if (error) {
            alert("Failed to update name: " + error.message);
        } else {
            alert("Name updated successfully!");
            setIsEditingName(false);
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
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', color: 'white', fontFamily: 'var(--font-body)' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: '#ff4d6d' }}>Admin Dashboard</h2>
                <button onClick={handleLogout} style={{ padding: '8px 16px', background: 'rgba(255, 255, 255, 0.1)', color: 'white', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}>Logout</button>
            </header>

            {/* Profile Name Section */}
            <div className="glass-card" style={{ padding: '25px', marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', color: '#ffccd5' }}>Your Profile Name</h3>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        disabled={!isEditingName}
                        style={{
                            flex: 1,
                            padding: '12px 20px',
                            background: isEditingName ? 'rgba(0,0,0,0.3)' : 'transparent',
                            border: isEditingName ? '1px solid #ff4d6d' : 'none',
                            color: 'white',
                            borderRadius: '10px',
                            fontSize: '1.2rem',
                            fontFamily: 'var(--font-heading)',
                            transition: 'all 0.3s'
                        }}
                    />
                    {isEditingName ? (
                        <button
                            onClick={handleUpdateName}
                            style={{
                                padding: '10px 20px',
                                background: '#ff4d6d',
                                color: 'white',
                                borderRadius: '10px',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}
                        >
                            <Save size={18} /> Save
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsEditingName(true)}
                            style={{
                                padding: '10px 20px',
                                background: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                borderRadius: '10px',
                                border: '1px solid rgba(255, 77, 109, 0.5)',
                                cursor: 'pointer'
                            }}
                        >
                            Edit
                        </button>
                    )}
                </div>
            </div>

            <div className="glass-card" style={{ padding: '25px', marginBottom: '30px' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', fontFamily: 'var(--font-heading)', color: '#ffccd5' }}>Add New Memory ({memories.length}/5)</h3>
                <form onSubmit={handleAddMemory} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <input
                            type="text"
                            placeholder="Year (e.g. 2023)"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            style={{ flex: 1, padding: '15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px' }}
                        />
                        <div style={{ flex: 2, position: 'relative' }}>
                            <input
                                type="file"
                                id="file-upload"
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files[0])}
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="file-upload" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '15px',
                                background: 'rgba(0,0,0,0.3)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                color: image ? '#ff4d6d' : '#888'
                            }}>
                                <Upload size={20} />
                                {image ? image.name : "Choose Image"}
                            </label>
                        </div>
                    </div>
                    <textarea
                        placeholder="Message (e.g. The first time we met...)"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        style={{ padding: '15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', minHeight: '100px', fontFamily: 'inherit' }}
                    />
                    <button
                        type="submit"
                        disabled={uploading || memories.length >= 5}
                        style={{
                            padding: '15px',
                            background: uploading ? '#555' : 'linear-gradient(45deg, #ff4d6d, #8B0000)',
                            color: 'white',
                            borderRadius: '10px',
                            cursor: uploading ? 'not-allowed' : 'pointer',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            border: 'none',
                            marginTop: '10px',
                            boxShadow: '0 4px 15px rgba(255, 77, 109, 0.4)'
                        }}
                    >
                        {uploading ? 'Uploading...' : 'Add Memory'}
                    </button>
                </form>
            </div>

            <div className="memory-list">
                <h3 style={{ fontSize: '2rem', marginBottom: '20px', fontFamily: 'var(--font-heading)', color: '#ffccd5' }}>Your Memories</h3>
                {memories.length === 0 && <p style={{ color: '#888', textAlign: 'center' }}>No memories yet. Add your first one above! ✨</p>}
                {memories.map(mem => (
                    <div key={mem.id} className="glass-card" style={{ display: 'flex', alignItems: 'center', padding: '15px', marginBottom: '15px' }}>
                        <img src={mem.image_url} alt={mem.year} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px', marginRight: '20px' }} />
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 'bold', color: '#ff4d6d', fontSize: '1.5rem', fontFamily: 'var(--font-heading)' }}>{mem.year}</div>
                            <div style={{ fontSize: '1rem', color: '#ddd' }}>{mem.message}</div>
                        </div>
                        <button onClick={() => handleDelete(mem.id)} style={{ color: '#ff4d6d', background: 'rgba(255, 77, 109, 0.1)', padding: '10px', borderRadius: '50%', border: 'none', cursor: 'pointer' }}>
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Share Link Section */}
            <div className="glass-card" style={{ marginTop: '50px', textAlign: 'center', padding: '30px' }}>
                <p style={{ color: '#ccc', marginBottom: '15px' }}>Share your love page:</p>
                {slug ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                        <code style={{ background: 'rgba(0,0,0,0.5)', padding: '15px 25px', borderRadius: '10px', color: '#ff4d6d', fontSize: '1.1rem' }}>
                            {window.location.origin}/love/{slug}
                        </code>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/love/${slug}`);
                                alert("Link copied!");
                            }}
                            style={{
                                background: 'linear-gradient(45deg, #ff4d6d, #8B0000)',
                                color: 'white',
                                padding: '12px 20px',
                                borderRadius: '10px',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontWeight: 'bold'
                            }}
                        >
                            <LinkIcon size={18} /> Copy Link
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


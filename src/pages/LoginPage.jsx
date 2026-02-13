import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../services/supabase';

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { signIn, signUp } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Check if we are on register route
    React.useEffect(() => {
        if (location.pathname === '/register') {
            setIsLogin(false);
        } else {
            setIsLogin(true);
        }
    }, [location.pathname]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error } = await signIn(email, password);
                if (error) throw error;
                navigate('/admin');
            } else {
                // Register flow
                const { data, error: authError } = await signUp(email, password, username);
                if (authError) throw authError;

                if (data?.user) {
                    // Create profile entry
                    const slug = username.toLowerCase().replace(/\s+/g, '-');
                    const { error: profileError } = await supabase
                        .from('profiles')
                        .insert([{ id: data.user.id, username, slug }]);

                    if (profileError) {
                        console.error("Profile creation error:", profileError);
                        // Optional: handle cleanup or just warn
                    }
                    alert('Registration successful! Please check your email for verification if enabled, or login.');
                    setIsLogin(true);
                    navigate('/login');
                }
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                    background: 'rgba(20, 20, 20, 0.8)',
                    padding: '40px',
                    borderRadius: '15px',
                    width: '100%',
                    maxWidth: '400px',
                    boxShadow: '0 8px 32px 0 rgba(139, 0, 0, 0.37)'
                }}
            >
                <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#ff4d6d' }}>
                    {isLogin ? 'Welcome Back' : 'Start Your Journey'}
                </h2>

                {error && <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Your Name (or Couple Name)"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#222', color: 'white' }}
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#222', color: 'white' }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#222', color: 'white' }}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '12px',
                            background: '#8B0000',
                            color: 'white',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            marginTop: '10px',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Login' : 'create Account')}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: '#ccc' }}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <span
                        onClick={() => {
                            setIsLogin(!isLogin);
                            navigate(isLogin ? '/register' : '/login');
                        }}
                        style={{ color: '#ff4d6d', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        {isLogin ? 'Register' : 'Login'}
                    </span>
                </p>
            </motion.div>
        </div>
    );
};

export default LoginPage;

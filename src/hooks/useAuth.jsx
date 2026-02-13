import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../services/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!supabase) {
            setLoading(false);
            return;
        }

        // Check active sessions and sets the user
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setLoading(false);
        };
        getSession();

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signUp = async (email, password, username) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username,
                }
            }
        });
        return { data, error };
    };

    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { data, error };
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        return { error };
    };

    if (!supabase) {
        return (
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#ff4d6d', textAlign: 'center', padding: '20px' }}>
                <h1>Configuration Required</h1>
                <p>Please check your <code>.env</code> file.</p>
                <p>Missing <code>VITE_SUPABASE_URL</code> or <code>VITE_SUPABASE_ANON_KEY</code>.</p>
                <p>See <code>SETUP.md</code> for instructions.</p>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, signUp, signIn, signOut, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

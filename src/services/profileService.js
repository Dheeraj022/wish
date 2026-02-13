import { supabase } from './supabase';

export const getProfile = async (userId) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    return { data, error };
};

export const getProfileBySlug = async (slug) => {
    // If slug is a UUID, we can try to fetch by ID as fallback or main strategy if we didn't implement friendly slugs fully yet
    // But plan said slug. Let's try to find by slug first.
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error && !data) {
        // Fallback: Check if slug is UUID
        const { data: byId, error: errorId } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', slug)
            .single();
        if (byId) return { data: byId, error: null };
        return { data: null, error };
    }
    return { data, error };
};

export const createProfile = async (userId, username) => {
    const slug = username.toLowerCase().replace(/\s+/g, '-') + '-' + Math.floor(Math.random() * 1000); // Add random number to ensure uniqueness
    const { data, error } = await supabase
        .from('profiles')
        .upsert([{ id: userId, username, slug }])
        .select()
        .single();
    return { data, error };
};

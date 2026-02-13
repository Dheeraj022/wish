import { supabase } from './supabase';

export const getMemories = async (userId) => {
    const { data, error } = await supabase
        .from('love_memories')
        .select('*')
        .eq('user_id', userId)
        .order('year', { ascending: true });
    return { data, error };
};

export const createMemory = async (userId, imageUrl, year, message) => {
    const { data, error } = await supabase
        .from('love_memories')
        .insert([{ user_id: userId, image_url: imageUrl, year, message }]);
    return { data, error };
};

export const deleteMemory = async (id) => {
    const { error } = await supabase
        .from('love_memories')
        .delete()
        .eq('id', id);
    return { error };
};

export const updateMemory = async (id, updates) => {
    const { data, error } = await supabase
        .from('love_memories')
        .update(updates)
        .eq('id', id);
    return { data, error };
};

export const uploadImage = async (file, userId) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
        .from('love-images')
        .upload(fileName, file);

    if (uploadError) {
        return { error: uploadError };
    }

    const { data: { publicUrl } } = supabase.storage
        .from('love-images')
        .getPublicUrl(fileName);

    return { publicUrl, error: null };
};

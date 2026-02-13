-- Create profiles table safely
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  username TEXT UNIQUE,
  slug TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create love_memories table safely
CREATE TABLE IF NOT EXISTS love_memories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  image_url TEXT NOT NULL,
  year TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE love_memories ENABLE ROW LEVEL SECURITY;

-- Helper to create policy safely
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public profiles are viewable by everyone.') THEN
        CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING ( true );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own profile.') THEN
        CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK ( auth.uid() = id );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own profile.') THEN
        CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING ( auth.uid() = id );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Love memories are viewable by everyone.') THEN
        CREATE POLICY "Love memories are viewable by everyone." ON love_memories FOR SELECT USING ( true );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own memories.') THEN
        CREATE POLICY "Users can insert their own memories." ON love_memories FOR INSERT WITH CHECK ( auth.uid() = user_id );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own memories.') THEN
        CREATE POLICY "Users can update their own memories." ON love_memories FOR UPDATE USING ( auth.uid() = user_id );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own memories.') THEN
        CREATE POLICY "Users can delete their own memories." ON love_memories FOR DELETE USING ( auth.uid() = user_id );
    END IF;
END
$$;

-- Storage Setup
-- Create the storage bucket 'love-images'
INSERT INTO storage.buckets (id, name, public) 
VALUES ('love-images', 'love-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies (Drop first to ensure clean state or use DO block, simpler to drop and recreate for storage policies often)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'love-images' );

DROP POLICY IF EXISTS "Authenticated Uploads" ON storage.objects;
CREATE POLICY "Authenticated Uploads"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'love-images' AND auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Authenticated Updates" ON storage.objects;
CREATE POLICY "Authenticated Updates"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'love-images' AND auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Authenticated Deletes" ON storage.objects;
CREATE POLICY "Authenticated Deletes"
ON storage.objects FOR DELETE
USING ( bucket_id = 'love-images' AND auth.role() = 'authenticated' );



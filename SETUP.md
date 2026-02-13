# 🌹 Our Love Story - Setup Guide

This guide will help you set up the backend for your romantic Valentine's Day website.

## 1. Supabase Setup

### Create a Project
1. Go to [Supabase](https://supabase.com) and create a new project.
2. Once created, go to **Settings > API** and copy:
   - `Project URL`
   - `anon public` key

### Database Schema
1. Go to the **SQL Editor** in your Supabase dashboard.
2. Open the `supabase_schema.sql` file provided in this project root.
3. Copy the content and paste it into the SQL Editor.
4. Click **Run** to create the tables (`profiles`, `love_memories`) and set up security policies.

### Storage Setup
1. Go to **Storage** in the left sidebar.
2. Create a new bucket named `love-images`.
3.  **Public Access**: unexpected behavior for images not loading? Make sure the bucket is Public or you have a policy allowing public read access.
    - The provided SQL script includes a basic policy, but you might need to manually enable "Public" for the bucket settings if images don't load.
4. Go to **Storage > Policies**.
   - Create a policy for `love-images`:
     - **Name**: "Public Access"
     - **Allowed operations**: SELECT
     - **Target roles**: anon, authenticated (or just leave default to all)
   - Create a policy for Uploads:
     - **Name**: "Authenticated Uploads"
     - **Allowed operations**: INSERT, UPDATE, DELETE
     - **Target roles**: authenticated

## 2. Environment Variables

1. Rename `.env` to `.env.local` (optional, but recommended for local dev, vite uses .env by default too).
2. Open `.env` and paste your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
   
## 3. Run the Project

1. Install dependencies (if you haven't):
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open the link (usually http://localhost:5173).

## 4. How to Use

1. **Register**: Create an account with your email and password.
2. **Admin Dashboard**: Once logged in, you will be redirected to the Admin page.
   - Upload up to 5 memorable photos.
   - Add a year and a romantic message for each.
   - You can delete them if you make a mistake.
3. **Share**: Copy your unique link from the dashboard and send it to your partner! 
   - They will see the animated hero section, timeline, and the "Love Game".

❤️ Happy Valentine's Day!

## Troubleshooting

### Node.js Version
This project is configured to work with **Node.js 20.11.0+**. 
If you encounter errors related to `crypto.hash` or Vite compatibility, ensure you are using a compatible Node.js version or that `vite` is downgraded to version 5.x (which is already configured in `package.json`).


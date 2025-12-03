-- Add is_admin column to existing users table (for databases that already exist)
-- This migration is safe to run multiple times

-- Check if column doesn't exist and add it
ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 0 NOT NULL CHECK (is_admin IN (0, 1));

-- Make the first user (you) an admin
-- Change this to your actual username after registration
-- UPDATE users SET is_admin = 1 WHERE username = 'your_username_here';

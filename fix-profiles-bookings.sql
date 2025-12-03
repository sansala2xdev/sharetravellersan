-- Fix profiles table foreign key reference for bookings
-- This allows the bookings table to properly join with profiles

-- First, check if the profiles table has the correct structure
-- The profiles table should have an 'id' column that references auth.users(id)

-- Add missing columns to profiles if they don't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS province TEXT;

-- Verify bookings can be queried
-- Test query:
-- SELECT b.*, s.title as service_title, p.full_name, p.email
-- FROM bookings b
-- LEFT JOIN services s ON b.service_id = s.id
-- LEFT JOIN profiles p ON b.user_id = p.id
-- WHERE b.provider_id = 'YOUR_PROVIDER_ID';

-- If you get an error about profiles not being found, check:
-- 1. Does the profiles table exist?
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'profiles'
) as profiles_exists;

-- 2. Check if profiles has proper foreign key
SELECT 
    conname as constraint_name,
    conrelid::regclass as table_name,
    a.attname as column_name,
    confrelid::regclass as foreign_table_name
FROM pg_constraint c
JOIN pg_attribute a ON a.attnum = ANY(c.conkey) AND a.attrelid = c.conrelid
WHERE conrelid = 'public.profiles'::regclass
AND contype = 'f';

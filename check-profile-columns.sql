-- Complete check and setup for profiles table
-- Run this in Supabase SQL Editor

-- First, let's check what columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles';

-- Add missing columns if they don't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT CHECK (role IN ('regular_user', 'service_provider'));

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS interests TEXT[];

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Now fix RLS policies
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.profiles';
    END LOOP;
END $$;

-- Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create simple policies
CREATE POLICY "profiles_select_policy"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_update_policy"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "profiles_insert_policy"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO anon;

-- Verify setup
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

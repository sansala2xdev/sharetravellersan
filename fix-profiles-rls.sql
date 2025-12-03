-- Fix RLS policies for profiles table
-- Run this in Supabase SQL Editor

-- First, disable RLS temporarily
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

-- Create new policies that allow users to manage their own profile
-- Using simpler policies for both authenticated and anon roles
CREATE POLICY "profiles_select_policy"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_update_policy"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "profiles_insert_policy"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO anon;

-- COMPLETE PROFILES TABLE RESET AND FIX
-- Run this entire script in Supabase SQL Editor

-- Step 1: Completely disable RLS
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL policies (using a more aggressive approach)
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'profiles'
    LOOP
        EXECUTE format('DROP POLICY %I ON %I.%I', pol.policyname, pol.schemaname, pol.tablename);
    END LOOP;
END $$;

-- Step 3: Grant all necessary permissions first (before enabling RLS)
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO anon;
GRANT ALL ON public.profiles TO postgres;

-- Step 4: Create brand new policies with different names
CREATE POLICY "allow_select_own_profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "allow_update_own_profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "allow_insert_own_profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Step 5: Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 6: Test query (replace with your user ID)
-- This should return your profile data
SELECT id, email, full_name, role, interests, onboarding_completed
FROM public.profiles 
WHERE id = 'e8480f29-c4cf-48f7-9ae0-6f40dbdacb26';

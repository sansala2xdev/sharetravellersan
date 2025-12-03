-- ========================================
-- FIX SERVICE PROVIDER ROLE AND PERMISSIONS
-- ========================================
-- Run this if you get 403 error when creating services

-- 1. Check current profile data
SELECT id, email, role, onboarding_completed 
FROM public.profiles 
WHERE id = auth.uid();

-- 2. Update your profile to service_provider role if not already set
-- Replace 'YOUR_EMAIL@example.com' with your actual email
UPDATE public.profiles 
SET 
  role = 'service_provider',
  onboarding_completed = false
WHERE email = 'YOUR_EMAIL@example.com';

-- 3. Verify the update
SELECT id, email, role, onboarding_completed 
FROM public.profiles 
WHERE email = 'YOUR_EMAIL@example.com';

-- ========================================
-- ALTERNATIVE: Grant full permissions temporarily for testing
-- ========================================
-- If you still get errors, temporarily disable RLS for testing:

-- DISABLE RLS (TESTING ONLY - NOT FOR PRODUCTION)
-- ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;

-- To re-enable RLS after testing:
-- ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- ========================================
-- VERIFY RLS POLICIES
-- ========================================
-- Check existing policies on services table
SELECT schemaname, tablename, policyname, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'services';

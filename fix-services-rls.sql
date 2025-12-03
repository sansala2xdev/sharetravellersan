-- ========================================
-- FIX SERVICES TABLE RLS POLICIES
-- ========================================
-- Run this if you get 403 error even though role is service_provider

-- 1. Check your current user and role
SELECT 
  auth.uid() as user_id,
  p.email,
  p.role,
  p.onboarding_completed
FROM public.profiles p
WHERE p.id = auth.uid();

-- 2. Check existing RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'services';

-- 3. Temporarily disable RLS to test (TESTING ONLY)
ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;

-- After testing, re-enable with proper policies:
-- ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- 4. OR: Grant direct permissions (alternative approach)
GRANT ALL ON public.services TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- 5. Recreate policies with proper permissions
DROP POLICY IF EXISTS services_select_policy ON public.services;
DROP POLICY IF EXISTS services_insert_policy ON public.services;
DROP POLICY IF EXISTS services_update_policy ON public.services;
DROP POLICY IF EXISTS services_delete_policy ON public.services;

CREATE POLICY "services_select_policy"
  ON public.services FOR SELECT
  TO authenticated
  USING (true);  -- Allow all authenticated users to view

CREATE POLICY "services_insert_policy"
  ON public.services FOR INSERT
  TO authenticated
  WITH CHECK (provider_id = auth.uid());  -- Can only insert with their own ID

CREATE POLICY "services_update_policy"
  ON public.services FOR UPDATE
  TO authenticated
  USING (provider_id = auth.uid())
  WITH CHECK (provider_id = auth.uid());  -- Can only update their own services

CREATE POLICY "services_delete_policy"
  ON public.services FOR DELETE
  TO authenticated
  USING (provider_id = auth.uid());  -- Can only delete their own services

-- Re-enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- 6. Verify policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies 
WHERE tablename = 'services';

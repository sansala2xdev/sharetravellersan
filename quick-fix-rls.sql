-- ========================================
-- QUICK FIX FOR RLS 403 ERROR
-- ========================================
-- Run this immediately to fix the "violates row-level security policy" error

-- Option 1: Temporarily disable RLS (QUICKEST - for testing)
ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;

-- Option 2: Fix the policies properly (RECOMMENDED - for production)
-- Drop existing policies
DROP POLICY IF EXISTS services_select_policy ON public.services;
DROP POLICY IF EXISTS services_insert_policy ON public.services;
DROP POLICY IF EXISTS services_update_policy ON public.services;
DROP POLICY IF EXISTS services_delete_policy ON public.services;

-- Grant permissions to authenticated role
GRANT ALL ON public.services TO authenticated;

-- Create new policies with proper permissions
CREATE POLICY "Enable insert for authenticated users"
  ON public.services
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable select for all users"
  ON public.services
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable update for service owners"
  ON public.services
  FOR UPDATE
  TO authenticated
  USING (provider_id = auth.uid())
  WITH CHECK (provider_id = auth.uid());

CREATE POLICY "Enable delete for service owners"
  ON public.services
  FOR DELETE
  TO authenticated
  USING (provider_id = auth.uid());

-- Re-enable RLS if you disabled it
-- ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

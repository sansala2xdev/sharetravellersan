-- Reset user onboarding status to test the flow
-- Run this in Supabase SQL Editor and replace YOUR_USER_EMAIL with your actual email

UPDATE public.profiles 
SET 
  role = NULL,
  interests = NULL,
  onboarding_completed = FALSE
WHERE email = 'YOUR_USER_EMAIL';

-- Or to reset ALL users (be careful in production!):
-- UPDATE public.profiles 
-- SET 
--   role = NULL,
--   interests = NULL,
--   onboarding_completed = FALSE;

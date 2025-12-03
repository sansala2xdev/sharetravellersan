-- Step 1: Add role and onboarding fields to profiles table

-- Add role column (regular_user or service_provider)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT CHECK (role IN ('regular_user', 'service_provider'));

-- Add interests column for regular users
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS interests TEXT[];

-- Add onboarding_completed flag
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Add service provider specific fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS business_name TEXT,
ADD COLUMN IF NOT EXISTS service_type TEXT,
ADD COLUMN IF NOT EXISTS service_description TEXT,
ADD COLUMN IF NOT EXISTS service_location TEXT;

COMMENT ON COLUMN public.profiles.role IS 'User role: regular_user or service_provider';
COMMENT ON COLUMN public.profiles.interests IS 'Array of interest IDs for regular users';
COMMENT ON COLUMN public.profiles.onboarding_completed IS 'Whether user has completed onboarding flow';

-- Create a trigger to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, onboarding_completed)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    FALSE
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========================================
-- SERVICES TABLE
-- ========================================

-- Create services table for tour/service listings
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  province TEXT NOT NULL,
  city TEXT NOT NULL,
  district TEXT,
  base_price DECIMAL(10, 2) NOT NULL,
  adult_price DECIMAL(10, 2) NOT NULL,
  child_price DECIMAL(10, 2),
  max_group_size INTEGER NOT NULL,
  duration DECIMAL(5, 2) NOT NULL,
  duration_type TEXT CHECK (duration_type IN ('hours', 'days')) NOT NULL,
  images TEXT[] DEFAULT '{}',
  available_dates DATE[] DEFAULT '{}',
  time_slots JSONB DEFAULT '[]',
  blocked_dates DATE[] DEFAULT '{}',
  status TEXT CHECK (status IN ('active', 'inactive', 'draft')) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_services_provider_id ON public.services(provider_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category);
CREATE INDEX IF NOT EXISTS idx_services_province ON public.services(province);
CREATE INDEX IF NOT EXISTS idx_services_city ON public.services(city);
CREATE INDEX IF NOT EXISTS idx_services_status ON public.services(status);
CREATE INDEX IF NOT EXISTS idx_services_created_at ON public.services(created_at DESC);

-- Add comments
COMMENT ON TABLE public.services IS 'Tours and services provided by service providers';
COMMENT ON COLUMN public.services.provider_id IS 'Reference to the service provider profile';
COMMENT ON COLUMN public.services.time_slots IS 'JSON array of available time slots: [{"start": "09:00", "end": "12:00"}]';
COMMENT ON COLUMN public.services.status IS 'Service status: active, inactive, or draft';

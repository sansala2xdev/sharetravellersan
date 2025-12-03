-- Add role and onboarding fields to profiles table

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

-- Update existing users to have NULL role (they'll select on next login)
-- New users will select role during signup

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

-- ========================================
-- BOOKINGS TABLE
-- ========================================

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  booking_date DATE NOT NULL,
  time_slot JSONB NOT NULL,
  adults INTEGER DEFAULT 1 NOT NULL,
  children INTEGER DEFAULT 0,
  add_ons JSONB DEFAULT '{}',
  total_price DECIMAL(10, 2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')) DEFAULT 'pending',
  special_requests TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_bookings_service_id ON public.bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_date ON public.bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at DESC);

-- Add comments
COMMENT ON TABLE public.bookings IS 'Customer bookings for services';
COMMENT ON COLUMN public.bookings.time_slot IS 'Selected time slot: {"start": "09:00", "end": "12:00"}';
COMMENT ON COLUMN public.bookings.add_ons IS 'Additional services: {"private_guide": true, "photo": false}';
COMMENT ON COLUMN public.bookings.status IS 'Booking status: pending, confirmed, cancelled, or completed';

-- ========================================
-- SERVICE AVAILABILITY TABLE
-- ========================================

-- Create service availability tracking
CREATE TABLE IF NOT EXISTS public.service_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE NOT NULL,
  available_date DATE NOT NULL,
  time_slot JSONB NOT NULL,
  total_slots INTEGER NOT NULL,
  booked_slots INTEGER DEFAULT 0,
  is_blocked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(service_id, available_date, time_slot)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_availability_service_id ON public.service_availability(service_id);
CREATE INDEX IF NOT EXISTS idx_availability_date ON public.service_availability(available_date);
CREATE INDEX IF NOT EXISTS idx_availability_blocked ON public.service_availability(is_blocked);

-- Add comments
COMMENT ON TABLE public.service_availability IS 'Track available slots for services by date and time';
COMMENT ON COLUMN public.service_availability.total_slots IS 'Total number of bookings allowed for this slot';
COMMENT ON COLUMN public.service_availability.booked_slots IS 'Number of slots already booked';
COMMENT ON COLUMN public.service_availability.is_blocked IS 'Whether this slot is blocked by provider';

-- ========================================
-- REVIEWS TABLE
-- ========================================

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(booking_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_reviews_service_id ON public.reviews(service_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at DESC);

-- Add comments
COMMENT ON TABLE public.reviews IS 'Customer reviews and ratings for services';
COMMENT ON COLUMN public.reviews.booking_id IS 'Link to the booking (ensures one review per booking)';

-- ========================================
-- UPDATE TRIGGERS
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers to all tables
DROP TRIGGER IF EXISTS update_services_updated_at ON public.services;
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_availability_updated_at ON public.service_availability;
CREATE TRIGGER update_availability_updated_at
  BEFORE UPDATE ON public.service_availability
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_reviews_updated_at ON public.reviews;
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Services are viewable by everyone" ON public.services;
DROP POLICY IF EXISTS "Service providers can insert their own services" ON public.services;
DROP POLICY IF EXISTS "Service providers can update their own services" ON public.services;
DROP POLICY IF EXISTS "Service providers can delete their own services" ON public.services;
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Availability is viewable by everyone" ON public.service_availability;
DROP POLICY IF EXISTS "Service providers can manage their service availability" ON public.service_availability;
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.reviews;
DROP POLICY IF EXISTS "Users can create reviews for their bookings" ON public.reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON public.reviews;

-- Enable RLS on all tables
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Services policies
CREATE POLICY "Services are viewable by everyone"
  ON public.services FOR SELECT
  USING (status = 'active' OR provider_id = auth.uid());

CREATE POLICY "Service providers can insert their own services"
  ON public.services FOR INSERT
  WITH CHECK (provider_id = auth.uid());

CREATE POLICY "Service providers can update their own services"
  ON public.services FOR UPDATE
  USING (provider_id = auth.uid());

CREATE POLICY "Service providers can delete their own services"
  ON public.services FOR DELETE
  USING (provider_id = auth.uid());

-- Bookings policies
CREATE POLICY "Users can view their own bookings"
  ON public.bookings FOR SELECT
  USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.services 
      WHERE services.id = bookings.service_id 
      AND services.provider_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own bookings"
  ON public.bookings FOR UPDATE
  USING (user_id = auth.uid());

-- Service availability policies
CREATE POLICY "Availability is viewable by everyone"
  ON public.service_availability FOR SELECT
  USING (true);

CREATE POLICY "Service providers can manage their service availability"
  ON public.service_availability FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.services 
      WHERE services.id = service_availability.service_id 
      AND services.provider_id = auth.uid()
    )
  );

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone"
  ON public.reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can create reviews for their bookings"
  ON public.reviews FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    booking_id IN (SELECT id FROM public.bookings WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update their own reviews"
  ON public.reviews FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own reviews"
  ON public.reviews FOR DELETE
  USING (user_id = auth.uid());

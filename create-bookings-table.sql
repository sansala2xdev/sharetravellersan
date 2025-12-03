-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  time_slot TEXT,
  adults INTEGER NOT NULL DEFAULT 1,
  children INTEGER NOT NULL DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  private_guide BOOLEAN DEFAULT false,
  professional_photo BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Providers can view bookings for their services" ON public.bookings;
DROP POLICY IF EXISTS "Authenticated users can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;

-- Create RLS policies for bookings
CREATE POLICY "Users can view their own bookings"
ON public.bookings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Providers can view bookings for their services"
ON public.bookings FOR SELECT
USING (auth.uid() = provider_id);

CREATE POLICY "Authenticated users can create bookings"
ON public.bookings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
ON public.bookings FOR UPDATE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_provider_id ON public.bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_bookings_service_id ON public.bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);

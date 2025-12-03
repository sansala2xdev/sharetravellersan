-- ========================================
-- CHECK AND FIX SERVICES TABLE SCHEMA
-- ========================================

-- 1. Check what columns actually exist in your services table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'services'
ORDER BY ordinal_position;

-- 2. If there's a 'name' column instead of 'title', rename it:
ALTER TABLE public.services 
RENAME COLUMN name TO title;

-- 3. Or if both exist and 'name' is NOT NULL, make it nullable or drop it:
ALTER TABLE public.services 
ALTER COLUMN name DROP NOT NULL;

-- OR drop the name column if title exists:
-- ALTER TABLE public.services DROP COLUMN IF EXISTS name;

-- 4. Verify the table structure matches what we expect:
-- Expected columns: id, provider_id, title, description, category, province, city, district,
-- base_price, adult_price, child_price, max_group_size, duration, duration_type,
-- images, available_dates, time_slots, blocked_dates, status, created_at, updated_at

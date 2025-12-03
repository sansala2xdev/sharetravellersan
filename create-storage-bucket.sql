-- Create storage bucket for service images
INSERT INTO storage.buckets (id, name, public)
VALUES ('service-images', 'service-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for service images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'service-images');

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'service-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'service-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'service-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

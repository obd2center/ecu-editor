/*
  # Create files table and storage setup for bin file uploads

  1. New Tables
    - `ecu_files`
      - `id` (uuid, primary key) - Unique file identifier
      - `file_name` (text) - Original file name
      - `file_size` (bigint) - File size in bytes
      - `file_path` (text) - Storage path
      - `platform` (text) - Detected ECU platform
      - `eeprom_size` (text) - Detected EEPROM size
      - `order_id` (uuid, nullable) - Associated order
      - `status` (text) - Processing status (uploaded, analyzing, processed, error)
      - `metadata` (jsonb) - Additional file metadata
      - `created_at` (timestamptz) - Upload timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Storage
    - Create storage bucket for bin files
    - Set up storage policies for file access

  3. Security
    - Enable RLS on `ecu_files` table
    - Add policies for public upload and read access
    - Configure storage bucket policies
*/

-- Create ecu_files table
CREATE TABLE IF NOT EXISTS ecu_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL,
  file_size bigint NOT NULL,
  file_path text NOT NULL,
  platform text,
  eeprom_size text,
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'uploaded',
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE ecu_files ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access"
  ON ecu_files
  FOR SELECT
  TO anon
  USING (true);

-- Create policy for public insert
CREATE POLICY "Allow public insert"
  ON ecu_files
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy for authenticated update
CREATE POLICY "Allow authenticated update"
  ON ecu_files
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policy for authenticated delete
CREATE POLICY "Allow authenticated delete"
  ON ecu_files
  FOR DELETE
  TO authenticated
  USING (true);

-- Create storage bucket for bin files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'ecu-files',
  'ecu-files',
  true,
  52428800,
  NULL
)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies using DO blocks
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow public uploads'
  ) THEN
    CREATE POLICY "Allow public uploads"
    ON storage.objects FOR INSERT
    TO public
    WITH CHECK (bucket_id = 'ecu-files');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow public downloads'
  ) THEN
    CREATE POLICY "Allow public downloads"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'ecu-files');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow authenticated deletes'
  ) THEN
    CREATE POLICY "Allow authenticated deletes"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'ecu-files');
  END IF;
END $$;

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_ecu_files_platform ON ecu_files(platform);
CREATE INDEX IF NOT EXISTS idx_ecu_files_status ON ecu_files(status);
CREATE INDEX IF NOT EXISTS idx_ecu_files_created_at ON ecu_files(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ecu_files_order_id ON ecu_files(order_id);
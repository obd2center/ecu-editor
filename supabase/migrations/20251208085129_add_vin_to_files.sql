/*
  # Add VIN/Chassis number field to ecu_files table

  1. Changes
    - Add `vin` column to `ecu_files` table to store extracted VIN/chassis numbers
    - Add index for faster VIN lookups
*/

-- Add VIN column to ecu_files table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ecu_files' AND column_name = 'vin'
  ) THEN
    ALTER TABLE ecu_files ADD COLUMN vin text;
  END IF;
END $$;

-- Create index for VIN searches
CREATE INDEX IF NOT EXISTS idx_ecu_files_vin ON ecu_files(vin);
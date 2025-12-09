/*
  # Create orders table for OBD2 Center Limited

  1. New Tables
    - `orders`
      - `id` (uuid, primary key) - Unique order identifier
      - `order_number` (text, unique) - Human-readable order number (e.g., "ORD-001")
      - `customer_name` (text) - Customer name
      - `vehicle_model` (text) - Vehicle model
      - `platform` (text) - ECU platform (e.g., EDC17CP11)
      - `status` (text) - Order status (Pending, Editing, Ready, Completed)
      - `amount` (numeric) - Order amount in USD
      - `created_at` (timestamptz) - Order creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `orders` table
    - Add policy for public read access (for admin dashboard)
    - Add policy for authenticated insert/update operations

  3. Sample Data
    - Insert 3 sample orders for demonstration
*/

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  vehicle_model text NOT NULL,
  platform text NOT NULL,
  status text NOT NULL DEFAULT 'Pending',
  amount numeric NOT NULL DEFAULT 50.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access"
  ON orders
  FOR SELECT
  TO anon
  USING (true);

-- Create policy for authenticated insert
CREATE POLICY "Allow authenticated insert"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policy for authenticated update
CREATE POLICY "Allow authenticated update"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample orders
INSERT INTO orders (order_number, customer_name, vehicle_model, platform, status, amount, created_at)
VALUES
  ('ORD-001', 'John Smith', 'Range Rover Sport 2015', 'EDC17CP42', 'Ready', 50.00, now() - interval '2 days'),
  ('ORD-002', 'Sarah Johnson', 'Jaguar F-PACE 2018', 'EDC17CP55', 'Editing', 50.00, now() - interval '1 day'),
  ('ORD-003', 'Mike Williams', 'Range Rover Evoque 2020', 'MEDC17.9', 'Pending', 50.00, now() - interval '3 hours')
ON CONFLICT (order_number) DO NOTHING;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
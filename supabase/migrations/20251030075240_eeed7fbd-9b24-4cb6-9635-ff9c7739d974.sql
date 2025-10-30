-- Enable realtime updates for kiotviet_products_full table
ALTER PUBLICATION supabase_realtime ADD TABLE kiotviet_products_full;

-- Set replica identity to FULL to capture all column changes
ALTER TABLE kiotviet_products_full REPLICA IDENTITY FULL;
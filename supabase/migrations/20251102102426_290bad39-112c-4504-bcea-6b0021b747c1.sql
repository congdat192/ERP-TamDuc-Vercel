-- Allow anonymous users to view product information for public product lookup page
CREATE POLICY "allow_public_read_products"
ON public.kiotviet_products_full
FOR SELECT
TO anon
USING (true);

-- Add comment to explain the policy
COMMENT ON POLICY "allow_public_read_products" ON public.kiotviet_products_full 
IS 'Allow anonymous users to view product information for public product lookup page at /p/:code';
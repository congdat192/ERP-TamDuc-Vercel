-- Create lens_recommendation_groups table
CREATE TABLE IF NOT EXISTS public.lens_recommendation_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT, -- Emoji or icon name
  color TEXT DEFAULT '#3B82F6', -- Hex color for badge
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create lens_recommendation_products table (Many-to-Many)
CREATE TABLE IF NOT EXISTS public.lens_recommendation_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.lens_recommendation_groups(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.lens_products(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  notes TEXT, -- Internal notes for this product in this group
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(group_id, product_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_recommendation_groups_slug ON public.lens_recommendation_groups(slug);
CREATE INDEX IF NOT EXISTS idx_recommendation_groups_active ON public.lens_recommendation_groups(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_recommendation_products_group ON public.lens_recommendation_products(group_id, display_order);
CREATE INDEX IF NOT EXISTS idx_recommendation_products_product ON public.lens_recommendation_products(product_id);

-- Enable RLS
ALTER TABLE public.lens_recommendation_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lens_recommendation_products ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lens_recommendation_groups
CREATE POLICY "Anyone can view active recommendation groups"
ON public.lens_recommendation_groups
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage recommendation groups"
ON public.lens_recommendation_groups
FOR ALL
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- RLS Policies for lens_recommendation_products
CREATE POLICY "Anyone can view recommendation products"
ON public.lens_recommendation_products
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.lens_recommendation_groups
    WHERE id = group_id AND is_active = true
  )
);

CREATE POLICY "Admins can manage recommendation products"
ON public.lens_recommendation_products
FOR ALL
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER update_lens_recommendation_groups_updated_at
BEFORE UPDATE ON public.lens_recommendation_groups
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
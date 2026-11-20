-- KalaSetu Database Setup for Supabase
-- Run this script in the Supabase SQL Editor

-- 1. Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'seller' CHECK (role IN ('buyer', 'seller')),
  state TEXT,
  craft_specialization TEXT,
  bio TEXT,
  profile_image_url TEXT,
  public_phone TEXT,
  whatsapp_number TEXT,
  show_phone BOOLEAN DEFAULT true,
  show_whatsapp BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  state TEXT NOT NULL,
  category TEXT NOT NULL,
  materials TEXT,
  quantity INTEGER DEFAULT 1,
  image_urls TEXT[] DEFAULT '{}',
  story_text TEXT,
  story_video_url TEXT,
  story_document_url TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 4. Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 5. Policies for products
CREATE POLICY "Products are viewable by everyone."
  ON public.products FOR SELECT
  USING (true);

CREATE POLICY "Sellers can insert their own products."
  ON public.products FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update their own products."
  ON public.products FOR UPDATE
  USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete their own products."
  ON public.products FOR DELETE
  USING (auth.uid() = seller_id);

-- 6. Storage buckets setup (Execute if Supabase storage extensions are enabled)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('stories', 'stories', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public Access Products"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'products');

CREATE POLICY "Authenticated users can upload product media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');

CREATE POLICY "Public Access Stories"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'stories');

CREATE POLICY "Authenticated users can upload story media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'stories' AND auth.role() = 'authenticated');

-- 7. Create custom_orders table
CREATE TABLE IF NOT EXISTS public.custom_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  buyer_name TEXT,
  buyer_email TEXT,
  artisan_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  artisan_name TEXT,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  size TEXT,
  colors TEXT,
  quantity INTEGER DEFAULT 1,
  budget NUMERIC NOT NULL DEFAULT 0,
  agreed_price NUMERIC,
  deadline DATE,
  reference_image_url TEXT,
  status TEXT DEFAULT 'request_received' CHECK (
    status IN (
      'request_received', 
      'accepted', 
      'design_finalized', 
      'in_progress', 
      'quality_check', 
      'ready_for_dispatch', 
      'completed', 
      'rejected'
    )
  ),
  artisan_proposal JSONB,
  status_history JSONB DEFAULT '[]'::jsonb,
  timeline_updates JSONB DEFAULT '[]'::jsonb,
  craftsmanship_hours NUMERIC DEFAULT 25,
  craft_tradition TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.custom_orders(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  buyer_name TEXT,
  artisan_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  photo_urls TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_order_review UNIQUE (order_id)
);

-- 9. Create collections table
CREATE TABLE IF NOT EXISTS public.collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  is_default BOOLEAN DEFAULT false,
  share_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Create collection_items table
CREATE TABLE IF NOT EXISTS public.collection_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID REFERENCES public.collections(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_collection_product UNIQUE (collection_id, product_id)
);

-- 11. Enable Row Level Security (RLS) for new tables
ALTER TABLE public.custom_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_items ENABLE ROW LEVEL SECURITY;

-- 12. Policies for custom_orders
CREATE POLICY "Users can view orders they are involved in"
  ON public.custom_orders FOR SELECT
  USING (auth.uid() = buyer_id OR auth.uid() = artisan_id);

CREATE POLICY "Buyers can insert custom orders"
  ON public.custom_orders FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Parties involved can update custom orders"
  ON public.custom_orders FOR UPDATE
  USING (auth.uid() = buyer_id OR auth.uid() = artisan_id);

-- 13. Policies for reviews
CREATE POLICY "Reviews are viewable by everyone"
  ON public.reviews FOR SELECT
  USING (true);

CREATE POLICY "Buyers can insert reviews for completed orders"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Buyers can update their own reviews"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = buyer_id);

-- 14. Policies for collections
CREATE POLICY "Public collections are viewable by everyone, private by owner"
  ON public.collections FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own collections"
  ON public.collections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own collections"
  ON public.collections FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own collections"
  ON public.collections FOR DELETE
  USING (auth.uid() = user_id);

-- 15. Policies for collection_items
CREATE POLICY "Collection items viewable if collection viewable"
  ON public.collection_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.collections c 
      WHERE c.id = collection_items.collection_id 
      AND (c.is_public = true OR c.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage items in their collections"
  ON public.collection_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.collections c 
      WHERE c.id = collection_items.collection_id 
      AND c.user_id = auth.uid()
    )
  );

-- 16. Additional Storage Buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('orders', 'orders', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('reviews', 'reviews', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access Orders Media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'orders');

CREATE POLICY "Authenticated users can upload order media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'orders' AND auth.role() = 'authenticated');

CREATE POLICY "Public Access Reviews Media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'reviews');

CREATE POLICY "Authenticated users can upload review media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'reviews' AND auth.role() = 'authenticated');

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create detections table for spam detection history
CREATE TABLE public.detections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('text', 'voice', 'image', 'link')),
  content TEXT,
  processed_text TEXT,
  label TEXT NOT NULL CHECK (label IN ('spam', 'not_spam', 'suspicious')),
  score DECIMAL(5,4) NOT NULL CHECK (score >= 0 AND score <= 1),
  reasons TEXT[],
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on detections
ALTER TABLE public.detections ENABLE ROW LEVEL SECURITY;

-- Detections policies
CREATE POLICY "Users can view their own detections"
  ON public.detections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own detections"
  ON public.detections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own detections"
  ON public.detections FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_detections_user_created ON public.detections(user_id, created_at DESC);
CREATE INDEX idx_detections_type ON public.detections(type);
CREATE INDEX idx_detections_label ON public.detections(label);

-- Enable realtime for detections
ALTER PUBLICATION supabase_realtime ADD TABLE public.detections;
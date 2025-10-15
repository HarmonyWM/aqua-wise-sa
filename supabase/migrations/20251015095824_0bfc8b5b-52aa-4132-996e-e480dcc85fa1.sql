-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  location TEXT DEFAULT 'Johannesburg, South Africa',
  user_type TEXT CHECK (user_type IN ('household', 'farmer', 'municipality', 'admin')) DEFAULT 'household',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create water usage records table
CREATE TABLE public.water_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  usage_litres NUMERIC(10, 2) NOT NULL DEFAULT 0,
  cost_estimate NUMERIC(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create leak detection records table
CREATE TABLE public.leak_detections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  flow_rate NUMERIC(10, 2) NOT NULL,
  status TEXT CHECK (status IN ('active', 'fixed', 'investigating')) DEFAULT 'active',
  fixed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create community stats table for leaderboard
CREATE TABLE public.community_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  total_saved_litres NUMERIC(12, 2) DEFAULT 0,
  leaks_fixed INTEGER DEFAULT 0,
  badges JSONB DEFAULT '[]'::jsonb,
  rank INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create technician applications table
CREATE TABLE public.technician_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  experience TEXT,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create approved technicians table
CREATE TABLE public.technicians (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  specialization TEXT,
  rating NUMERIC(3, 2) DEFAULT 5.0,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create sustainability tips table
CREATE TABLE public.sustainability_tips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leak_detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technician_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sustainability_tips ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Water usage policies
CREATE POLICY "Users can view their own water usage"
  ON public.water_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own water usage"
  ON public.water_usage FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Leak detection policies
CREATE POLICY "Users can view their own leaks"
  ON public.leak_detections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own leaks"
  ON public.leak_detections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own leaks"
  ON public.leak_detections FOR UPDATE
  USING (auth.uid() = user_id);

-- Community stats policies
CREATE POLICY "Everyone can view community stats"
  ON public.community_stats FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own stats"
  ON public.community_stats FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats"
  ON public.community_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Technician applications policies
CREATE POLICY "Anyone can submit applications"
  ON public.technician_applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own applications"
  ON public.technician_applications FOR SELECT
  USING (true);

-- Technicians policies (public read for finding technicians)
CREATE POLICY "Everyone can view technicians"
  ON public.technicians FOR SELECT
  USING (true);

-- Sustainability tips policies (public read)
CREATE POLICY "Everyone can view tips"
  ON public.sustainability_tips FOR SELECT
  USING (true);

-- Insert some sample sustainability tips
INSERT INTO public.sustainability_tips (title, content, category) VALUES
  ('Fix Dripping Taps', 'A dripping tap can waste up to 15 litres per day. Check and repair leaks promptly to conserve water and reduce costs.', 'maintenance'),
  ('Harvest Rainwater', 'Install a rainwater harvesting system to collect water for gardening and outdoor use. South Africa receives good seasonal rainfall in many regions.', 'conservation'),
  ('Efficient Irrigation', 'Water your garden early in the morning or late evening to minimize evaporation. Use drip irrigation for maximum efficiency.', 'gardening'),
  ('Shorter Showers', 'Reduce shower time by 2-3 minutes to save up to 30 litres per shower. Consider installing a water-efficient showerhead.', 'daily habits'),
  ('Dual-Flush Toilets', 'Upgrade to dual-flush toilets or place a brick in the cistern to reduce water used per flush.', 'upgrades');

-- Insert some sample technicians
INSERT INTO public.technicians (full_name, email, phone, location, specialization, rating) VALUES
  ('Thabo Mokoena', 'thabo.mokoena@aqua.co.za', '+27 82 555 1234', 'Johannesburg CBD', 'Leak Detection & Repair', 4.8),
  ('Sarah van der Merwe', 'sarah.vdm@watertech.co.za', '+27 83 456 7890', 'Sandton', 'Smart Meter Installation', 4.9),
  ('Mandla Dlamini', 'mandla.d@plumbpro.co.za', '+27 81 234 5678', 'Soweto', 'General Plumbing', 4.7),
  ('Zanele Khumalo', 'zanele@ecowater.co.za', '+27 84 987 6543', 'Alexandra', 'Rainwater Harvesting Systems', 5.0);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_community_stats_updated_at
  BEFORE UPDATE ON public.community_stats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email
  );
  
  INSERT INTO public.community_stats (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile and stats on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
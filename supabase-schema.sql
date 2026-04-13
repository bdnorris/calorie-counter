-- Run this in your Supabase SQL editor

-- Profiles table (one row per user, stores settings)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  daily_calorie_goal INTEGER NOT NULL DEFAULT 2000,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meals table (user's personal meal library)
CREATE TABLE meals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  calorie_type TEXT NOT NULL CHECK (calorie_type IN ('per_gram', 'flat')),
  reference_calories NUMERIC NOT NULL,  -- flat calories, OR calories in the reference serving
  reference_grams NUMERIC,              -- only set for per_gram: grams in the reference serving
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Log entries table (daily food log)
CREATE TABLE log_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  meal_id UUID REFERENCES meals(id) ON DELETE SET NULL,
  meal_name TEXT NOT NULL,              -- snapshot of name at log time, or arbitrary label
  calorie_type TEXT NOT NULL CHECK (calorie_type IN ('per_gram', 'flat', 'arbitrary')),
  grams NUMERIC,                        -- only for per_gram entries
  calories NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (defense in depth — functions also enforce user_id)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE log_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own profile" ON profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users manage own meals" ON meals
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own log entries" ON log_entries
  FOR ALL USING (auth.uid() = user_id);

-- Optional: auto-create profile row when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

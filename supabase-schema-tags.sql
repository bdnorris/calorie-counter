-- Migration: add tags system
-- Run this in the Supabase SQL editor after the initial schema

-- Tags (per user)
CREATE TABLE tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Many-to-many: food items <-> tags
CREATE TABLE meal_tags (
  meal_id UUID REFERENCES meals(id) ON DELETE CASCADE NOT NULL,
  tag_id  UUID REFERENCES tags(id)  ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (meal_id, tag_id)
);

ALTER TABLE tags      ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own tags" ON tags
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own meal tags" ON meal_tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM meals WHERE meals.id = meal_tags.meal_id AND meals.user_id = auth.uid()
    )
  );

/*
  # Initial schema for hapí event management system

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `name` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `events`
      - `id` (uuid, primary key)
      - `creator_id` (uuid, references profiles)
      - `title` (text)
      - `description` (text)
      - `date` (date)
      - `time` (time)
      - `location` (text)
      - `type` (text)
      - `template_id` (text)
      - `max_attendees` (integer)
      - `customization` (jsonb)
      - `media` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `event_programs`
      - `id` (uuid, primary key)
      - `event_id` (uuid, references events)
      - `title` (text)
      - `description` (text)
      - `date_time` (timestamp)
      - `speaker_name` (text)
      - `speaker_bio` (text)
      - `created_at` (timestamp)

    - `event_attendees`
      - `id` (uuid, primary key)
      - `event_id` (uuid, references events)
      - `user_id` (uuid, references profiles)
      - `status` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  date date NOT NULL,
  time time NOT NULL,
  location text NOT NULL,
  type text NOT NULL CHECK (type IN ('wedding', 'birthday', 'seminar')),
  template_id text NOT NULL,
  max_attendees integer NOT NULL DEFAULT 100,
  customization jsonb DEFAULT '{}'::jsonb,
  media jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create event programs table
CREATE TABLE event_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  date_time timestamptz NOT NULL,
  speaker_name text NOT NULL,
  speaker_bio text,
  created_at timestamptz DEFAULT now()
);

-- Create event attendees table
CREATE TABLE event_attendees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
  status text NOT NULL CHECK (status IN ('registered', 'attended', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Events policies
CREATE POLICY "Anyone can view events"
  ON events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their events"
  ON events FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id);

-- Event programs policies
CREATE POLICY "Anyone can view event programs"
  ON event_programs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Event creators can manage programs"
  ON event_programs FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_programs.event_id
      AND events.creator_id = auth.uid()
    )
  );

-- Event attendees policies
CREATE POLICY "Users can view event attendees"
  ON event_attendees FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can register for events"
  ON event_attendees FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their attendance status"
  ON event_attendees FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create functions
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (new.id, new.raw_user_meta_data->>'name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
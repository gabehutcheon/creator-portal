-- Create briefs table
CREATE TABLE IF NOT EXISTS briefs (
  id BIGSERIAL PRIMARY KEY,
  notion_id TEXT UNIQUE,
  title TEXT NOT NULL,
  client TEXT NOT NULL,
  creator_email TEXT NOT NULL,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'pending',
  script TEXT,
  shots TEXT[] DEFAULT '{}',
  air_link TEXT,
  mark_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  bank_name TEXT,
  account_name TEXT,
  bsb TEXT,
  account_number TEXT,
  paypal_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_briefs_creator_email ON briefs(creator_email);
CREATE INDEX IF NOT EXISTS idx_briefs_status ON briefs(status);
CREATE INDEX IF NOT EXISTS idx_briefs_due_date ON briefs(due_date);

-- Enable RLS
ALTER TABLE briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for briefs
CREATE POLICY "Users can view their own briefs" ON briefs
  FOR SELECT USING (creator_email = auth.jwt() ->> 'email');

CREATE POLICY "Admins can do everything" ON briefs
  FOR ALL USING (auth.jwt() ->> 'email' = 'gabe@exposure.com.au');

-- RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
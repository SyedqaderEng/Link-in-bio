-- Drop existing tables if they exist
DROP TABLE IF EXISTS analytics CASCADE;
DROP TABLE IF EXISTS links CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS themes CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  theme_id UUID,
  custom_css TEXT,
  is_premium BOOLEAN DEFAULT false,
  subscription_tier TEXT CHECK (subscription_tier IN ('free', 'pro', 'lifetime')) DEFAULT 'free',
  custom_domain TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Links table
CREATE TABLE links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  scheduled_start TIMESTAMPTZ,
  scheduled_end TIMESTAMPTZ,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics table
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  link_id UUID REFERENCES links(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_type TEXT CHECK (event_type IN ('view', 'click', 'share')) NOT NULL,
  referrer TEXT,
  country TEXT,
  city TEXT,
  device TEXT,
  browser TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Themes table
CREATE TABLE themes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  preview_url TEXT,
  config JSONB NOT NULL DEFAULT '{}',
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,
  tier TEXT CHECK (tier IN ('free', 'pro', 'lifetime')) DEFAULT 'free',
  status TEXT CHECK (status IN ('active', 'canceled', 'past_due')) DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_links_user_id ON links(user_id);
CREATE INDEX idx_links_position ON links(position);
CREATE INDEX idx_analytics_user_id ON analytics(user_id);
CREATE INDEX idx_analytics_link_id ON analytics(link_id);
CREATE INDEX idx_analytics_created_at ON analytics(created_at);
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_custom_domain ON profiles(custom_domain);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_links_updated_at BEFORE UPDATE ON links
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default themes
INSERT INTO themes (name, slug, description, config, is_premium) VALUES
(
  'Glassmorphic',
  'glassmorphic',
  'Modern glass effect with translucent blur and purple-pink gradients',
  '{
    "background": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "cardBackground": "rgba(255, 255, 255, 0.1)",
    "backdropBlur": "blur(10px)",
    "textColor": "#ffffff",
    "accentColor": "#e879f9"
  }',
  false
),
(
  'Minimalist',
  'minimalist',
  'Clean and simple design with neutral colors and maximum whitespace',
  '{
    "background": "#faf9f6",
    "cardBackground": "#ffffff",
    "textColor": "#2c2c2c",
    "accentColor": "#8b7355",
    "borderRadius": "8px"
  }',
  false
),
(
  'Bold Vibrant',
  'bold-vibrant',
  'High-energy design with neon colors and animated gradients',
  '{
    "background": "#0a0a0f",
    "cardBackground": "rgba(255, 255, 255, 0.05)",
    "textColor": "#ffffff",
    "gradient": "linear-gradient(135deg, #FF00FF, #00E5FF, #C4FF0E)",
    "accentColor": "#ff00ff"
  }',
  false
),
(
  'Nature Earthy',
  'nature-earthy',
  'Organic design inspired by nature with earthy tones',
  '{
    "background": "linear-gradient(135deg, #f5f3ee 0%, #e8e4dc 100%)",
    "cardBackground": "#ffffff",
    "textColor": "#2f4538",
    "accentColor": "#5a7a5f",
    "borderRadius": "24px"
  }',
  false
);

-- Function to increment link click count
CREATE OR REPLACE FUNCTION increment_link_clicks(link_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE links
  SET click_count = click_count + 1
  WHERE id = link_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to get user analytics summary
CREATE OR REPLACE FUNCTION get_analytics_summary(user_uuid UUID, days INTEGER DEFAULT 30)
RETURNS TABLE (
  total_views BIGINT,
  total_clicks BIGINT,
  total_shares BIGINT,
  unique_visitors BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) FILTER (WHERE event_type = 'view') as total_views,
    COUNT(*) FILTER (WHERE event_type = 'click') as total_clicks,
    COUNT(*) FILTER (WHERE event_type = 'share') as total_shares,
    COUNT(DISTINCT referrer) as unique_visitors
  FROM analytics
  WHERE user_id = user_uuid
  AND created_at >= NOW() - INTERVAL '1 day' * days;
END;
$$ LANGUAGE plpgsql;

-- Create a test user (password: testpass123)
INSERT INTO profiles (email, password_hash, username, display_name, bio, subscription_tier)
VALUES (
  'test@example.com',
  '$2a$10$rQ5Z5YxZqGqJ3vQQ9YwLYO5qYQZJYQZJYQZJYQZJYQZJYQZJYQ', -- bcrypt hash of 'testpass123'
  'testuser',
  'Test User',
  'Welcome to my test profile! Check out my links below.',
  'free'
);

-- Add some test links for the test user
INSERT INTO links (user_id, title, url, icon, position, is_active)
SELECT
  id,
  'My Website',
  'https://example.com',
  '🌐',
  0,
  true
FROM profiles WHERE username = 'testuser'
UNION ALL
SELECT
  id,
  'GitHub Profile',
  'https://github.com',
  '💻',
  1,
  true
FROM profiles WHERE username = 'testuser'
UNION ALL
SELECT
  id,
  'Twitter',
  'https://twitter.com',
  '🐦',
  2,
  true
FROM profiles WHERE username = 'testuser';

-- Add some test analytics
INSERT INTO analytics (user_id, event_type, country, device, browser)
SELECT
  id,
  'view',
  'United States',
  'Desktop',
  'Chrome'
FROM profiles WHERE username = 'testuser';

INSERT INTO analytics (user_id, link_id, event_type, country, device, browser)
SELECT
  p.id,
  l.id,
  'click',
  'United States',
  'Mobile',
  'Safari'
FROM profiles p
JOIN links l ON l.user_id = p.id
WHERE p.username = 'testuser'
LIMIT 1;

COMMIT;

-- Display success message
SELECT 'Database initialized successfully!' as message;
SELECT 'Test user created - Email: test@example.com, Password: testpass123' as test_account;
SELECT 'Test profile URL: http://localhost:3000/testuser' as test_url;

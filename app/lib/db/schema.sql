-- THE THINKING ARCHITECT (TTA) - Supabase Schema
-- Apr 2026

-- 1. SITE CONFIGURATION (SEO, Global copy, Branding)
CREATE TABLE IF NOT EXISTS site_config (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. SESSIONS (Archive)
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    speaker TEXT,
    description TEXT,
    date TEXT NOT NULL,
    duration TEXT,
    thumbnail_url TEXT,
    video_url TEXT,
    category TEXT CHECK (category IN ('Talks', 'Debates', 'Guest Sessions')),
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. EVENTS (Upcoming & Past)
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    speaker TEXT,
    date TEXT NOT NULL,
    description TEXT,
    link TEXT,
    attendance TEXT,
    is_upcoming BOOLEAN DEFAULT false,
    event_date DATE,
    topics TEXT[] DEFAULT '{}',
    flyer_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. TEAM MEMBERS
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    bio TEXT,
    link TEXT,
    image_url TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. STATS (Community Pulse)
CREATE TABLE IF NOT EXISTS stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    sort_order INT DEFAULT 0
);

-- ROW LEVEL SECURITY (RLS) policies
-- Enable RLS
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;

-- Create Policies (Public: Read, Authenticated: Write)
CREATE POLICY "Public read all site_config" ON site_config FOR SELECT USING (true);
CREATE POLICY "Public read all sessions" ON sessions FOR SELECT USING (true);
CREATE POLICY "Public read all events" ON events FOR SELECT USING (true);
CREATE POLICY "Public read all team_members" ON team_members FOR SELECT USING (true);
CREATE POLICY "Public read all stats" ON stats FOR SELECT USING (true);

-- Admin Write (Requires auth.uid() or Service Role)
-- These allow anyone logged in to editing (TTA small team)
CREATE POLICY "Authenticated write site_config" ON site_config FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write sessions" ON sessions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write events" ON events FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write team_members" ON team_members FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write stats" ON stats FOR ALL USING (auth.role() = 'authenticated');

-- 6. ACTIVITY LOGS (Admin Auditing)
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_email TEXT NOT NULL,
    action TEXT NOT NULL,
    target_name TEXT,
    target_id TEXT
);

-- 7. CONTACT SUBMISSIONS (Inquiries)
CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    organization TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived'))
);

-- Enable RLS
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Admin read all logs" ON activity_logs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write all logs" ON activity_logs FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Public insert submissions" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read all submissions" ON contact_submissions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin update submissions" ON contact_submissions FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete submissions" ON contact_submissions FOR DELETE USING (auth.role() = 'authenticated');

-- 8. NEWSLETTER SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    email TEXT PRIMARY KEY,
    name TEXT,
    source TEXT DEFAULT 'footer',
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public insert subscriptions" ON newsletter_subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read all subscriptions" ON newsletter_subscriptions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete subscriptions" ON newsletter_subscriptions FOR DELETE USING (auth.role() = 'authenticated');

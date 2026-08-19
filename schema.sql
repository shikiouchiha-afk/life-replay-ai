-- Life Replay AI Database Schema
-- Comprehensive schema for the full platform

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  timezone TEXT DEFAULT 'UTC',
  theme TEXT DEFAULT 'dark',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User settings
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Memory settings
  default_importance TEXT DEFAULT 'normal',
  enable_auto_categorization BOOLEAN DEFAULT true,
  enable_auto_associations BOOLEAN DEFAULT true,
  enable_duplicate_detection BOOLEAN DEFAULT true,
  
  -- AI settings
  ai_response_detail TEXT DEFAULT 'detailed',
  enable_ai_citations BOOLEAN DEFAULT true,
  insight_frequency TEXT DEFAULT 'weekly',
  
  -- Notification settings
  enable_email_notifications BOOLEAN DEFAULT true,
  enable_in_app_notifications BOOLEAN DEFAULT true,
  enable_weekly_replay BOOLEAN DEFAULT true,
  enable_monthly_replay BOOLEAN DEFAULT true,
  
  -- Privacy settings
  enable_memory_ai_processing BOOLEAN DEFAULT true,
  enable_connection_discovery BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  
  plan TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'active',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  
  -- Limits
  memory_limit INTEGER DEFAULT 100,
  storage_limit_mb INTEGER DEFAULT 5120,
  ai_search_monthly_limit INTEGER DEFAULT 100,
  
  -- Billing
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  color TEXT,
  icon TEXT,
  is_default BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, slug)
);

-- Topics table
CREATE TABLE IF NOT EXISTS topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  mention_count INTEGER DEFAULT 0,
  last_mentioned TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, slug)
);

-- Entities table (people, companies, locations)
CREATE TABLE IF NOT EXISTS entities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  entity_type TEXT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  mention_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, entity_type, slug)
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'idea',
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  
  start_date DATE,
  target_date DATE,
  progress INTEGER DEFAULT 0,
  
  is_archived BOOLEAN DEFAULT false,
  is_favorite BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Goals table
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  
  target_date DATE,
  progress INTEGER DEFAULT 0,
  
  is_archived BOOLEAN DEFAULT false,
  is_favorite BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Decisions table
CREATE TABLE IF NOT EXISTS decisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  decision TEXT NOT NULL,
  reasoning TEXT,
  expected_outcome TEXT,
  
  status TEXT NOT NULL DEFAULT 'pending',
  actual_outcome TEXT,
  
  decision_date DATE,
  review_date DATE,
  
  is_archived BOOLEAN DEFAULT false,
  is_favorite BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Memories table (core feature)
CREATE TABLE IF NOT EXISTS memories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  raw_content TEXT,
  clean_content TEXT,
  summary TEXT,
  
  memory_type TEXT NOT NULL DEFAULT 'note',
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  
  source_type TEXT DEFAULT 'manual',
  source_url TEXT,
  
  event_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  importance TEXT DEFAULT 'normal',
  
  embedding vector(1536),
  
  is_archived BOOLEAN DEFAULT false,
  is_favorite BOOLEAN DEFAULT false,
  is_private BOOLEAN DEFAULT false,
  
  processing_status TEXT DEFAULT 'pending',
  processing_error TEXT,
  
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Memory topics junction table
CREATE TABLE IF NOT EXISTS memory_topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memory_id UUID NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  confidence NUMERIC DEFAULT 0.5,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(memory_id, topic_id)
);

-- Memory entities junction table
CREATE TABLE IF NOT EXISTS memory_entities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memory_id UUID NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
  entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
  confidence NUMERIC DEFAULT 0.5,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(memory_id, entity_id)
);

-- Memory projects association
CREATE TABLE IF NOT EXISTS memory_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memory_id UUID NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  confidence NUMERIC DEFAULT 0.5,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(memory_id, project_id)
);

-- Memory goals association
CREATE TABLE IF NOT EXISTS memory_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memory_id UUID NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
  goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  confidence NUMERIC DEFAULT 0.5,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(memory_id, goal_id)
);

-- Memory connections (discovered relationships)
CREATE TABLE IF NOT EXISTS memory_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  memory_id_1 UUID NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
  memory_id_2 UUID NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
  
  connection_type TEXT NOT NULL,
  confidence NUMERIC DEFAULT 0.5,
  reason TEXT,
  
  is_approved BOOLEAN,
  is_dismissed BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(memory_id_1, memory_id_2)
);

-- Files table
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memory_id UUID NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
  
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  
  storage_key TEXT NOT NULL UNIQUE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- AI conversations table
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  title TEXT,
  is_saved BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- AI messages table
CREATE TABLE IF NOT EXISTS ai_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
  
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  
  source_memories UUID[] DEFAULT '{}',
  citation_data JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Saved searches table
CREATE TABLE IF NOT EXISTS saved_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  query TEXT NOT NULL,
  filters JSONB DEFAULT '{}',
  
  is_favorite BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Daily replays table
CREATE TABLE IF NOT EXISTS daily_replays (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  replay_date DATE NOT NULL,
  
  main_themes TEXT[],
  key_moments TEXT,
  open_loops TEXT,
  
  memory_count INTEGER DEFAULT 0,
  
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, replay_date)
);

-- Weekly replays table
CREATE TABLE IF NOT EXISTS weekly_replays (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  week_start_date DATE NOT NULL,
  
  main_focus TEXT,
  biggest_progress TEXT,
  important_memories TEXT[],
  projects_moved_forward TEXT[],
  goals_updated TEXT[],
  decisions_made TEXT[],
  new_connections INTEGER DEFAULT 0,
  open_loops TEXT,
  
  memory_count INTEGER DEFAULT 0,
  
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, week_start_date)
);

-- Monthly replays table
CREATE TABLE IF NOT EXISTS monthly_replays (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  month DATE NOT NULL,
  
  summary TEXT,
  statistics JSONB,
  
  memories_captured INTEGER DEFAULT 0,
  projects_started INTEGER DEFAULT 0,
  goals_progressed INTEGER DEFAULT 0,
  decisions_made INTEGER DEFAULT 0,
  connections_found INTEGER DEFAULT 0,
  
  important_topics TEXT[],
  
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, month)
);

-- Integrations table
CREATE TABLE IF NOT EXISTS integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  provider TEXT NOT NULL,
  name TEXT NOT NULL,
  
  is_connected BOOLEAN DEFAULT false,
  
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  
  permissions JSONB DEFAULT '{}',
  last_sync TIMESTAMP WITH TIME ZONE,
  
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, provider)
);

-- Imports table
CREATE TABLE IF NOT EXISTS imports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  source_type TEXT NOT NULL,
  file_name TEXT,
  
  status TEXT NOT NULL DEFAULT 'pending',
  
  total_items INTEGER DEFAULT 0,
  processed_items INTEGER DEFAULT 0,
  error_message TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Processing jobs table (for background processing)
CREATE TABLE IF NOT EXISTS processing_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  job_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  
  status TEXT NOT NULL DEFAULT 'pending',
  
  payload JSONB DEFAULT '{}',
  result JSONB,
  error_message TEXT,
  
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Activity log table
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  action TEXT NOT NULL,
  target_type TEXT,
  target_id UUID,
  
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  message TEXT,
  notification_type TEXT NOT NULL,
  
  action_url TEXT,
  data JSONB DEFAULT '{}',
  
  is_read BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP WITH TIME ZONE
);

-- Usage tracking table
CREATE TABLE IF NOT EXISTS usage_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  metric TEXT NOT NULL,
  value INTEGER DEFAULT 1,
  
  period_start DATE,
  period_end DATE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance

-- Profiles indexes
CREATE INDEX idx_profiles_email ON profiles(email);

-- Memory indexes
CREATE INDEX idx_memories_user_id ON memories(user_id);
CREATE INDEX idx_memories_event_date ON memories(event_date DESC);
CREATE INDEX idx_memories_category_id ON memories(category_id);
CREATE INDEX idx_memories_importance ON memories(importance);
CREATE INDEX idx_memories_is_archived ON memories(is_archived);
CREATE INDEX idx_memories_processing_status ON memories(processing_status);
CREATE INDEX idx_memories_embedding ON memories USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Subscriptions indexes
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);

-- Topics and entities indexes
CREATE INDEX idx_topics_user_id ON topics(user_id);
CREATE INDEX idx_entities_user_id ON entities(user_id);

-- Projects and goals indexes
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_status ON goals(status);

-- Memory connections indexes
CREATE INDEX idx_memory_connections_user_id ON memory_connections(user_id);
CREATE INDEX idx_memory_connections_memory_id_1 ON memory_connections(memory_id_1);
CREATE INDEX idx_memory_connections_memory_id_2 ON memory_connections(memory_id_2);

-- AI conversation indexes
CREATE INDEX idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX idx_ai_messages_conversation_id ON ai_messages(conversation_id);

-- Activity log indexes
CREATE INDEX idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX idx_activity_log_created_at ON activity_log(created_at DESC);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Processing jobs indexes
CREATE INDEX idx_processing_jobs_user_id ON processing_jobs(user_id);
CREATE INDEX idx_processing_jobs_status ON processing_jobs(status);
CREATE INDEX idx_processing_jobs_job_type ON processing_jobs(job_type);

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_replays ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_replays ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_replays ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE imports ENABLE ROW LEVEL SECURITY;
ALTER TABLE processing_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own data
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Users can view their own settings" ON user_settings
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own settings" ON user_settings
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own subscription" ON subscriptions
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can view their own memories" ON memories
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create memories" ON memories
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own memories" ON memories
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own memories" ON memories
  FOR DELETE
  USING (user_id = auth.uid());

-- Additional policies for related tables
CREATE POLICY "Users can view their own categories" ON categories
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create categories" ON categories
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own categories" ON categories
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own projects" ON projects
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create projects" ON projects
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own projects" ON projects
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own goals" ON goals
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create goals" ON goals
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own goals" ON goals
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own AI conversations" ON ai_conversations
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create AI conversations" ON ai_conversations
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Duplicate policies for all junction and dependent tables
CREATE POLICY "Users can view their memory topics" ON memory_topics
  FOR SELECT
  USING (
    memory_id IN (
      SELECT id FROM memories WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their memory entities" ON memory_entities
  FOR SELECT
  USING (
    memory_id IN (
      SELECT id FROM memories WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their memory projects" ON memory_projects
  FOR SELECT
  USING (
    memory_id IN (
      SELECT id FROM memories WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their memory goals" ON memory_goals
  FOR SELECT
  USING (
    memory_id IN (
      SELECT id FROM memories WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their memory connections" ON memory_connections
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can view their files" ON files
  FOR SELECT
  USING (
    memory_id IN (
      SELECT id FROM memories WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their integrations" ON integrations
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can view their activity log" ON activity_log
  FOR SELECT
  USING (user_id = auth.uid());

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  
  INSERT INTO public.user_settings (user_id)
  VALUES (new.id);
  
  INSERT INTO public.subscriptions (user_id, plan)
  VALUES (new.id, 'free');
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to call the function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- LIFE GRAPH EXTENSION TABLES
-- ============================================

-- Journal entries table
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  title TEXT,
  content TEXT NOT NULL,
  
  entry_date DATE NOT NULL,
  entry_time TIME,
  
  mood TEXT,
  energy_level TEXT,
  weather TEXT,
  location TEXT,
  
  tags TEXT[] DEFAULT '{}',
  
  embedding vector(1536),
  
  is_private BOOLEAN DEFAULT false,
  is_favorite BOOLEAN DEFAULT false,
  
  processing_status TEXT DEFAULT 'pending',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Calendar events table
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  description TEXT,
  
  event_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  
  location TEXT,
  event_type TEXT,
  
  is_all_day BOOLEAN DEFAULT false,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern TEXT,
  
  is_private BOOLEAN DEFAULT false,
  is_favorite BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, id, event_date)
);

-- People table (enhanced entity tracking)
CREATE TABLE IF NOT EXISTS people (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  
  relationship TEXT,
  description TEXT,
  
  avatar_url TEXT,
  
  first_met_date DATE,
  last_contact_date DATE,
  
  phone TEXT,
  email TEXT,
  social_profiles JSONB DEFAULT '{}',
  
  importance TEXT DEFAULT 'normal',
  
  mention_count INTEGER DEFAULT 0,
  memory_count INTEGER DEFAULT 0,
  
  metadata JSONB DEFAULT '{}',
  
  is_favorite BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, slug)
);

-- Places table (enhanced location tracking)
CREATE TABLE IF NOT EXISTS places (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  
  description TEXT,
  
  address TEXT,
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  
  place_type TEXT,
  
  visited_count INTEGER DEFAULT 0,
  first_visited DATE,
  last_visited DATE,
  
  photos JSONB DEFAULT '{}',
  
  importance TEXT DEFAULT 'normal',
  
  memory_count INTEGER DEFAULT 0,
  
  metadata JSONB DEFAULT '{}',
  
  is_favorite BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, slug)
);

-- Moments table (major life events)
CREATE TABLE IF NOT EXISTS moments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  description TEXT,
  
  moment_date DATE NOT NULL,
  
  moment_type TEXT NOT NULL,
  emotional_impact TEXT,
  
  related_people TEXT[],
  related_places TEXT[],
  
  photos JSONB DEFAULT '{}',
  
  significance_rating INTEGER,
  
  reflection TEXT,
  
  is_favorite BOOLEAN DEFAULT false,
  is_private BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- AI Insights table
CREATE TABLE IF NOT EXISTS ai_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  insight_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  
  pattern_description TEXT,
  supporting_evidence TEXT[],
  recommendations JSONB DEFAULT '{}',
  
  confidence_score NUMERIC DEFAULT 0.5,
  
  discovered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  is_new BOOLEAN DEFAULT true,
  is_dismissed BOOLEAN DEFAULT false,
  is_favorite BOOLEAN DEFAULT false,
  
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Streaks table
CREATE TABLE IF NOT EXISTS streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  description TEXT,
  
  streak_type TEXT NOT NULL,
  target_entity_id UUID,
  
  current_count INTEGER DEFAULT 0,
  best_count INTEGER DEFAULT 0,
  
  start_date DATE,
  last_recorded_date DATE,
  
  frequency TEXT,
  
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Universal graph connections (for connecting any entity to any other)
CREATE TABLE IF NOT EXISTS graph_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  source_type TEXT NOT NULL,
  source_id UUID NOT NULL,
  
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  
  connection_type TEXT NOT NULL,
  strength NUMERIC DEFAULT 0.5,
  reason TEXT,
  
  is_bidirectional BOOLEAN DEFAULT false,
  is_approved BOOLEAN,
  is_dismissed BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, source_type, source_id, target_type, target_id)
);

-- Year replays table
CREATE TABLE IF NOT EXISTS year_replays (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  year INTEGER NOT NULL,
  
  summary TEXT,
  statistics JSONB,
  
  key_achievements TEXT[],
  biggest_challenges TEXT[],
  important_people TEXT[],
  important_places TEXT[],
  major_moments TEXT[],
  growth_areas TEXT[],
  
  memories_captured INTEGER DEFAULT 0,
  projects_completed INTEGER DEFAULT 0,
  goals_achieved INTEGER DEFAULT 0,
  decisions_made INTEGER DEFAULT 0,
  
  themes TEXT[],
  
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, year)
);

-- Memory to journal connection
CREATE TABLE IF NOT EXISTS memory_journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memory_id UUID NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
  journal_entry_id UUID NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(memory_id, journal_entry_id)
);

-- Memory to calendar event connection
CREATE TABLE IF NOT EXISTS memory_calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memory_id UUID NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
  calendar_event_id UUID NOT NULL REFERENCES calendar_events(id) ON DELETE CASCADE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(memory_id, calendar_event_id)
);

-- Memory to people connection
CREATE TABLE IF NOT EXISTS memory_people (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memory_id UUID NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
  person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  
  confidence NUMERIC DEFAULT 0.5,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(memory_id, person_id)
);

-- Memory to places connection
CREATE TABLE IF NOT EXISTS memory_places (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memory_id UUID NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
  place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  
  confidence NUMERIC DEFAULT 0.5,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(memory_id, place_id)
);

-- Memory to moments connection
CREATE TABLE IF NOT EXISTS memory_moments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memory_id UUID NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
  moment_id UUID NOT NULL REFERENCES moments(id) ON DELETE CASCADE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(memory_id, moment_id)
);

-- Indexes for Life Graph tables

CREATE INDEX idx_journal_entries_user_id ON journal_entries(user_id);
CREATE INDEX idx_journal_entries_entry_date ON journal_entries(entry_date DESC);
CREATE INDEX idx_journal_entries_embedding ON journal_entries USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX idx_calendar_events_user_id ON calendar_events(user_id);
CREATE INDEX idx_calendar_events_event_date ON calendar_events(event_date);

CREATE INDEX idx_people_user_id ON people(user_id);
CREATE INDEX idx_people_slug ON people(user_id, slug);

CREATE INDEX idx_places_user_id ON places(user_id);
CREATE INDEX idx_places_slug ON places(user_id, slug);

CREATE INDEX idx_moments_user_id ON moments(user_id);
CREATE INDEX idx_moments_moment_date ON moments(moment_date DESC);

CREATE INDEX idx_ai_insights_user_id ON ai_insights(user_id);
CREATE INDEX idx_ai_insights_insight_type ON ai_insights(insight_type);

CREATE INDEX idx_streaks_user_id ON streaks(user_id);
CREATE INDEX idx_streaks_is_active ON streaks(is_active);

CREATE INDEX idx_graph_connections_user_id ON graph_connections(user_id);
CREATE INDEX idx_graph_connections_source ON graph_connections(source_type, source_id);
CREATE INDEX idx_graph_connections_target ON graph_connections(target_type, target_id);

CREATE INDEX idx_year_replays_user_id ON year_replays(user_id);
CREATE INDEX idx_year_replays_year ON year_replays(year);

-- Enable RLS for new tables
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE moments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE graph_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE year_replays ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_people ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_moments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for new tables
CREATE POLICY "Users can view their own journal entries" ON journal_entries
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create journal entries" ON journal_entries
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own journal entries" ON journal_entries
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own calendar events" ON calendar_events
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create calendar events" ON calendar_events
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own calendar events" ON calendar_events
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own people" ON people
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create people" ON people
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own people" ON people
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own places" ON places
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create places" ON places
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own places" ON places
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own moments" ON moments
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create moments" ON moments
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own moments" ON moments
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own insights" ON ai_insights
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can view their own streaks" ON streaks
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create streaks" ON streaks
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own streaks" ON streaks
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own graph connections" ON graph_connections
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can view their own year replays" ON year_replays
  FOR SELECT
  USING (user_id = auth.uid());

-- Connection table policies
CREATE POLICY "Users can view their memory to journal connections" ON memory_journal_entries
  FOR SELECT
  USING (
    memory_id IN (
      SELECT id FROM memories WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their memory to calendar connections" ON memory_calendar_events
  FOR SELECT
  USING (
    memory_id IN (
      SELECT id FROM memories WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their memory to people connections" ON memory_people
  FOR SELECT
  USING (
    memory_id IN (
      SELECT id FROM memories WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their memory to places connections" ON memory_places
  FOR SELECT
  USING (
    memory_id IN (
      SELECT id FROM memories WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their memory to moments connections" ON memory_moments
  FOR SELECT
  USING (
    memory_id IN (
      SELECT id FROM memories WHERE user_id = auth.uid()
    )
  );

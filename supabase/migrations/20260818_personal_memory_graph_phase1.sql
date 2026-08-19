-- Phase 1: Personal Memory Graph Foundation
-- Creates the core graph architecture for connecting memories, projects, goals, decisions, and entities
-- Safe: only adds new tables, does not modify existing data

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- GRAPH NODE SYSTEM
-- ============================================

-- Unified node table for all important entities
CREATE TABLE IF NOT EXISTS graph_nodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Node identity
  node_type TEXT NOT NULL,
  source_entity_id UUID NOT NULL,
  source_entity_type TEXT NOT NULL,
  
  -- Node content
  title TEXT NOT NULL,
  summary TEXT,
  description TEXT,
  
  -- Metadata
  importance_score NUMERIC DEFAULT 0.5,
  mention_count INTEGER DEFAULT 0,
  last_mentioned_at TIMESTAMPTZ,
  
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(user_id, source_entity_type, source_entity_id)
);

-- Relationship types: related_to, mentions, belongs_to, evolved_into, supports, contradicts, resulted_in, progressed, blocked, similar_to
CREATE TABLE IF NOT EXISTS graph_edges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  source_node_id UUID NOT NULL REFERENCES graph_nodes(id) ON DELETE CASCADE,
  target_node_id UUID NOT NULL REFERENCES graph_nodes(id) ON DELETE CASCADE,
  
  -- Relationship details
  relationship_type TEXT NOT NULL,
  confidence NUMERIC DEFAULT 0.5,
  
  -- Evidence
  reasoning TEXT,
  supporting_memory_ids UUID[] DEFAULT '{}',
  created_by TEXT DEFAULT 'system',
  
  -- User interaction
  is_approved BOOLEAN,
  is_dismissed BOOLEAN DEFAULT false,
  user_feedback_score NUMERIC DEFAULT 0,
  
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(user_id, source_node_id, target_node_id, relationship_type)
);

-- ============================================
-- HISTORICAL VERSIONING
-- ============================================

-- Track all meaningful changes to important entities
CREATE TABLE IF NOT EXISTS entity_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  
  -- Versioning
  version_number INTEGER NOT NULL,
  change_type TEXT NOT NULL,
  changed_fields TEXT[] DEFAULT '{}',
  
  -- Complete snapshot of the entity at this version
  snapshot JSONB NOT NULL,
  
  -- Time validity
  valid_from TIMESTAMPTZ NOT NULL,
  valid_to TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(user_id, entity_type, entity_id, version_number)
);

-- ============================================
-- PROJECT & GOAL HISTORY EVENTS
-- ============================================

CREATE TABLE IF NOT EXISTS project_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  
  event_type TEXT NOT NULL,
  event_data JSONB NOT NULL DEFAULT '{}',
  event_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Event metadata
  triggered_by TEXT DEFAULT 'user',
  related_memory_id UUID REFERENCES memories(id) ON DELETE SET NULL,
  related_decision_id UUID REFERENCES decisions(id) ON DELETE SET NULL,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS goal_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  
  event_type TEXT NOT NULL,
  event_data JSONB NOT NULL DEFAULT '{}',
  event_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Event metadata
  triggered_by TEXT DEFAULT 'user',
  related_memory_id UUID REFERENCES memories(id) ON DELETE SET NULL,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- DECISION OUTCOME SYSTEM
-- ============================================

ALTER TABLE decisions ADD COLUMN IF NOT EXISTS expected_outcome TEXT;
ALTER TABLE decisions ADD COLUMN IF NOT EXISTS actual_outcome TEXT;
ALTER TABLE decisions ADD COLUMN IF NOT EXISTS review_date DATE;
ALTER TABLE decisions ADD COLUMN IF NOT EXISTS review_status TEXT DEFAULT 'pending';
ALTER TABLE decisions ADD COLUMN IF NOT EXISTS confidence_level TEXT DEFAULT 'moderate';
ALTER TABLE decisions ADD COLUMN IF NOT EXISTS lesson TEXT;
ALTER TABLE decisions ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS decision_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  decision_id UUID NOT NULL REFERENCES decisions(id) ON DELETE CASCADE,
  
  expected_outcome TEXT,
  actual_outcome TEXT,
  
  supporting_events TEXT[],
  ai_suggested_outcome TEXT,
  ai_reasoning TEXT,
  ai_suggested_lesson TEXT,
  
  user_outcome_confirmation TEXT,
  user_lesson TEXT,
  
  reviewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- PERSONAL CONTEXT MODEL
-- ============================================

CREATE TABLE IF NOT EXISTS personal_context (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Explicit preferences
  communication_preferences JSONB DEFAULT '{}',
  working_style TEXT,
  known_constraints TEXT[],
  
  -- Current state
  current_projects UUID[] DEFAULT '{}',
  active_goals UUID[] DEFAULT '{}',
  
  -- Topics & entities
  frequent_topics TEXT[] DEFAULT '{}',
  important_people UUID[] DEFAULT '{}',
  important_places UUID[] DEFAULT '{}',
  important_companies UUID[] DEFAULT '{}',
  
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Inferred context with confidence tracking
CREATE TABLE IF NOT EXISTS context_inferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  inference_type TEXT NOT NULL,
  inference_value TEXT NOT NULL,
  
  confidence NUMERIC DEFAULT 0.5,
  supporting_memory_ids UUID[] DEFAULT '{}',
  reasoning TEXT,
  
  is_enabled BOOLEAN DEFAULT true,
  user_feedback TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(user_id, inference_type, inference_value)
);

-- ============================================
-- MEMORY EVOLUTION TRACKING
-- ============================================

CREATE TABLE IF NOT EXISTS memory_evolution_chains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- The subject being tracked
  subject_type TEXT NOT NULL,
  subject_entity_id UUID NOT NULL,
  subject_name TEXT NOT NULL,
  
  description TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Points in an evolution chain
CREATE TABLE IF NOT EXISTS evolution_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chain_id UUID NOT NULL REFERENCES memory_evolution_chains(id) ON DELETE CASCADE,
  
  event_date TIMESTAMPTZ NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  
  -- Evidence
  source_memory_id UUID REFERENCES memories(id) ON DELETE SET NULL,
  source_project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  source_goal_id UUID REFERENCES goals(id) ON DELETE SET NULL,
  source_decision_id UUID REFERENCES decisions(id) ON DELETE SET NULL,
  
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- FORGOTTEN KNOWLEDGE SYSTEM
-- ============================================

CREATE TABLE IF NOT EXISTS forgotten_ranking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  memory_id UUID NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
  
  -- Ranking factors
  days_since_last_review INTEGER NOT NULL,
  semantic_relevance NUMERIC DEFAULT 0.0,
  importance_score NUMERIC DEFAULT 0.5,
  relationship_to_current_activity NUMERIC DEFAULT 0.0,
  novelty_score NUMERIC DEFAULT 0.0,
  
  -- Composite score
  composite_score NUMERIC DEFAULT 0.0,
  
  -- User interaction
  is_dismissed BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  user_rating INTEGER,
  
  last_presented_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(user_id, memory_id)
);

-- ============================================
-- OPEN LOOPS DETECTION
-- ============================================

CREATE TABLE IF NOT EXISTS open_loops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  loop_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  
  description TEXT,
  detection_reason TEXT,
  confidence NUMERIC DEFAULT 0.5,
  
  -- User interaction
  status TEXT DEFAULT 'open',
  user_action TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(user_id, entity_type, entity_id)
);

-- ============================================
-- MEMORY INBOX
-- ============================================

CREATE TABLE IF NOT EXISTS memory_inbox (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Source
  source_type TEXT NOT NULL,
  source_data JSONB NOT NULL,
  
  -- AI classification
  ai_classification TEXT,
  ai_confidence NUMERIC DEFAULT 0.0,
  ai_reasoning TEXT,
  
  -- User action
  status TEXT DEFAULT 'pending',
  action TEXT,
  action_taken_at TIMESTAMPTZ,
  
  -- If approved, reference the created memory
  created_memory_id UUID REFERENCES memories(id) ON DELETE SET NULL,
  
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INTEGRATION FRAMEWORK
-- ============================================

CREATE TABLE IF NOT EXISTS integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Integration identity
  provider TEXT NOT NULL,
  provider_account_id TEXT,
  
  -- Connection status
  status TEXT DEFAULT 'connected',
  is_active BOOLEAN DEFAULT true,
  
  -- Permissions
  permissions TEXT[] DEFAULT '{}',
  scopes TEXT[] DEFAULT '{}',
  
  -- Sync tracking
  last_sync_at TIMESTAMPTZ,
  last_error TEXT,
  sync_status TEXT DEFAULT 'idle',
  
  -- Credentials (encrypted via Supabase)
  encrypted_credentials JSONB,
  
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(user_id, provider)
);

-- ============================================
-- PERMISSION SCOPES
-- ============================================

CREATE TABLE IF NOT EXISTS permission_grants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Grant target
  target_type TEXT NOT NULL,
  target_id TEXT,
  
  -- Scope
  scope TEXT NOT NULL,
  
  -- Grant details
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  is_revoked BOOLEAN DEFAULT false,
  
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- VAULT SYSTEM (PRIVATE DATA ISOLATION)
-- ============================================

ALTER TABLE memories ADD COLUMN IF NOT EXISTS is_vault BOOLEAN DEFAULT false;

CREATE TABLE IF NOT EXISTS vault_access_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  
  vault_unlocked_at TIMESTAMPTZ,
  vault_locked_at TIMESTAMPTZ,
  
  ip_address TEXT,
  user_agent TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- JOBS & BACKGROUND PROCESSING
-- ============================================

CREATE TABLE IF NOT EXISTS background_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  job_type TEXT NOT NULL,
  job_data JSONB DEFAULT '{}',
  
  status TEXT DEFAULT 'pending',
  progress_percent INTEGER DEFAULT 0,
  
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  last_error TEXT,
  
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_graph_nodes_user_id ON graph_nodes(user_id);
CREATE INDEX IF NOT EXISTS idx_graph_nodes_type ON graph_nodes(node_type);
CREATE INDEX IF NOT EXISTS idx_graph_edges_user_id ON graph_edges(user_id);
CREATE INDEX IF NOT EXISTS idx_graph_edges_source ON graph_edges(source_node_id);
CREATE INDEX IF NOT EXISTS idx_graph_edges_target ON graph_edges(target_node_id);

CREATE INDEX IF NOT EXISTS idx_entity_versions_user_id ON entity_versions(user_id);
CREATE INDEX IF NOT EXISTS idx_entity_versions_entity ON entity_versions(entity_type, entity_id);

CREATE INDEX IF NOT EXISTS idx_project_events_user_id ON project_events(user_id);
CREATE INDEX IF NOT EXISTS idx_project_events_project_id ON project_events(project_id);
CREATE INDEX IF NOT EXISTS idx_project_events_date ON project_events(event_date);

CREATE INDEX IF NOT EXISTS idx_goal_events_user_id ON goal_events(user_id);
CREATE INDEX IF NOT EXISTS idx_goal_events_goal_id ON goal_events(goal_id);

CREATE INDEX IF NOT EXISTS idx_forgotten_ranking_user_id ON forgotten_ranking(user_id);
CREATE INDEX IF NOT EXISTS idx_forgotten_ranking_score ON forgotten_ranking(composite_score DESC);

CREATE INDEX IF NOT EXISTS idx_open_loops_user_id ON open_loops(user_id);
CREATE INDEX IF NOT EXISTS idx_open_loops_type ON open_loops(loop_type);

CREATE INDEX IF NOT EXISTS idx_memory_inbox_user_id ON memory_inbox(user_id);
CREATE INDEX IF NOT EXISTS idx_memory_inbox_status ON memory_inbox(status);

CREATE INDEX IF NOT EXISTS idx_integrations_user_id ON integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_integrations_provider ON integrations(provider);

CREATE INDEX IF NOT EXISTS idx_background_jobs_user_id ON background_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_background_jobs_status ON background_jobs(status);

CREATE INDEX IF NOT EXISTS idx_decision_reviews_user_id ON decision_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_decision_reviews_decision_id ON decision_reviews(decision_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE graph_nodes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own graph nodes"
  ON graph_nodes FOR ALL USING (auth.uid() = user_id);

ALTER TABLE graph_edges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own graph edges"
  ON graph_edges FOR ALL USING (auth.uid() = user_id);

ALTER TABLE entity_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own entity versions"
  ON entity_versions FOR ALL USING (auth.uid() = user_id);

ALTER TABLE project_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own project events"
  ON project_events FOR ALL USING (auth.uid() = user_id);

ALTER TABLE goal_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own goal events"
  ON goal_events FOR ALL USING (auth.uid() = user_id);

ALTER TABLE decision_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own decision reviews"
  ON decision_reviews FOR ALL USING (auth.uid() = user_id);

ALTER TABLE personal_context ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own context"
  ON personal_context FOR ALL USING (auth.uid() = user_id);

ALTER TABLE context_inferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own inferences"
  ON context_inferences FOR ALL USING (auth.uid() = user_id);

ALTER TABLE memory_evolution_chains ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own evolution chains"
  ON memory_evolution_chains FOR ALL USING (auth.uid() = user_id);

ALTER TABLE evolution_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own evolution events"
  ON evolution_events FOR ALL USING (auth.uid() = user_id);

ALTER TABLE forgotten_ranking ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own forgotten ranking"
  ON forgotten_ranking FOR ALL USING (auth.uid() = user_id);

ALTER TABLE open_loops ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own open loops"
  ON open_loops FOR ALL USING (auth.uid() = user_id);

ALTER TABLE memory_inbox ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own inbox"
  ON memory_inbox FOR ALL USING (auth.uid() = user_id);

ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own integrations"
  ON integrations FOR ALL USING (auth.uid() = user_id);

ALTER TABLE permission_grants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own permissions"
  ON permission_grants FOR ALL USING (auth.uid() = user_id);

ALTER TABLE vault_access_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own vault logs"
  ON vault_access_logs FOR ALL USING (auth.uid() = user_id);

ALTER TABLE background_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own jobs"
  ON background_jobs FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to create a new graph node from an entity
CREATE OR REPLACE FUNCTION create_graph_node(
  p_user_id UUID,
  p_node_type TEXT,
  p_source_entity_id UUID,
  p_source_entity_type TEXT,
  p_title TEXT,
  p_summary TEXT DEFAULT NULL,
  p_importance NUMERIC DEFAULT 0.5
)
RETURNS UUID AS $$
DECLARE
  v_node_id UUID;
BEGIN
  INSERT INTO graph_nodes (
    user_id,
    node_type,
    source_entity_id,
    source_entity_type,
    title,
    summary,
    importance_score
  ) VALUES (
    p_user_id,
    p_node_type,
    p_source_entity_id,
    p_source_entity_type,
    p_title,
    p_summary,
    p_importance
  )
  ON CONFLICT (user_id, source_entity_type, source_entity_id) 
  DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    updated_at = NOW()
  RETURNING id INTO v_node_id;
  
  RETURN v_node_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create a graph edge with validation
CREATE OR REPLACE FUNCTION create_graph_edge(
  p_user_id UUID,
  p_source_node_id UUID,
  p_target_node_id UUID,
  p_relationship_type TEXT,
  p_confidence NUMERIC DEFAULT 0.5,
  p_reasoning TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_edge_id UUID;
BEGIN
  IF p_source_node_id = p_target_node_id THEN
    RAISE EXCEPTION 'Cannot create edge between a node and itself';
  END IF;
  
  INSERT INTO graph_edges (
    user_id,
    source_node_id,
    target_node_id,
    relationship_type,
    confidence,
    reasoning
  ) VALUES (
    p_user_id,
    p_source_node_id,
    p_target_node_id,
    p_relationship_type,
    p_confidence,
    p_reasoning
  )
  ON CONFLICT (user_id, source_node_id, target_node_id, relationship_type)
  DO UPDATE SET
    confidence = GREATEST(graph_edges.confidence, EXCLUDED.confidence),
    updated_at = NOW()
  RETURNING id INTO v_edge_id;
  
  RETURN v_edge_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record a project event
CREATE OR REPLACE FUNCTION log_project_event(
  p_user_id UUID,
  p_project_id UUID,
  p_event_type TEXT,
  p_event_data JSONB DEFAULT '{}'::JSONB
)
RETURNS UUID AS $$
DECLARE
  v_event_id UUID;
BEGIN
  INSERT INTO project_events (
    user_id,
    project_id,
    event_type,
    event_data
  ) VALUES (
    p_user_id,
    p_project_id,
    p_event_type,
    p_event_data
  )
  RETURNING id INTO v_event_id;
  
  RETURN v_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record a goal event
CREATE OR REPLACE FUNCTION log_goal_event(
  p_user_id UUID,
  p_goal_id UUID,
  p_event_type TEXT,
  p_event_data JSONB DEFAULT '{}'::JSONB
)
RETURNS UUID AS $$
DECLARE
  v_event_id UUID;
BEGIN
  INSERT INTO goal_events (
    user_id,
    goal_id,
    event_type,
    event_data
  ) VALUES (
    p_user_id,
    p_goal_id,
    p_event_type,
    p_event_data
  )
  RETURNING id INTO v_event_id;
  
  RETURN v_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

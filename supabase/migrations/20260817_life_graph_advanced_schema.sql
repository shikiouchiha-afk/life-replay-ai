-- Life Replay advanced schema extension
-- Safe migration for the current app. This file only creates tables and policies not already covered by the main schema.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS life_areas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#22d3ee',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, name)
);

CREATE TABLE IF NOT EXISTS timeline_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  summary TEXT,
  event_type TEXT NOT NULL DEFAULT 'activity',
  source_table TEXT,
  source_id UUID,
  source_entity_type TEXT,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  target_type TEXT,
  target_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS goal_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_date DATE,
  status TEXT NOT NULL DEFAULT 'pending',
  progress INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS goal_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  progress INTEGER NOT NULL DEFAULT 0,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo',
  priority TEXT NOT NULL DEFAULT 'normal',
  due_date DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT,
  summary TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS decision_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  decision_id UUID NOT NULL REFERENCES decisions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  is_selected BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS decision_reflections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  decision_id UUID NOT NULL REFERENCES decisions(id) ON DELETE CASCADE,
  reflection TEXT NOT NULL,
  mood TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS memory_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  memory_id UUID NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
  related_table TEXT NOT NULL,
  related_id UUID NOT NULL,
  relation_type TEXT NOT NULL DEFAULT 'related',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, memory_id, related_table, related_id, relation_type)
);

CREATE TABLE IF NOT EXISTS memory_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_table TEXT NOT NULL,
  source_id UUID NOT NULL,
  embedding VECTOR(1536),
  model_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, source_table, source_id, model_name)
);

CREATE INDEX IF NOT EXISTS idx_life_areas_user_id ON life_areas(user_id);
CREATE INDEX IF NOT EXISTS idx_timeline_events_user_id ON timeline_events(user_id);
CREATE INDEX IF NOT EXISTS idx_timeline_events_occurred_at ON timeline_events(occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_timeline_events_source ON timeline_events(source_table, source_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON user_activity(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_goal_milestones_goal_id ON goal_milestones(goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_updates_goal_id ON goal_updates(goal_id);
CREATE INDEX IF NOT EXISTS idx_project_tasks_project_id ON project_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_project_updates_project_id ON project_updates(project_id);
CREATE INDEX IF NOT EXISTS idx_decision_options_decision_id ON decision_options(decision_id);
CREATE INDEX IF NOT EXISTS idx_decision_reflections_decision_id ON decision_reflections(decision_id);
CREATE INDEX IF NOT EXISTS idx_memory_links_memory_id ON memory_links(memory_id);
CREATE INDEX IF NOT EXISTS idx_memory_links_related ON memory_links(related_table, related_id);
CREATE INDEX IF NOT EXISTS idx_memory_embeddings_source ON memory_embeddings(source_table, source_id);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_life_areas_updated_at'
  ) THEN
    CREATE TRIGGER update_life_areas_updated_at
    BEFORE UPDATE ON life_areas
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_timeline_events_updated_at'
  ) THEN
    CREATE TRIGGER update_timeline_events_updated_at
    BEFORE UPDATE ON timeline_events
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_activity_updated_at'
  ) THEN
    CREATE TRIGGER update_user_activity_updated_at
    BEFORE UPDATE ON user_activity
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_goal_milestones_updated_at'
  ) THEN
    CREATE TRIGGER update_goal_milestones_updated_at
    BEFORE UPDATE ON goal_milestones
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_goal_updates_updated_at'
  ) THEN
    CREATE TRIGGER update_goal_updates_updated_at
    BEFORE UPDATE ON goal_updates
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_project_tasks_updated_at'
  ) THEN
    CREATE TRIGGER update_project_tasks_updated_at
    BEFORE UPDATE ON project_tasks
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_project_updates_updated_at'
  ) THEN
    CREATE TRIGGER update_project_updates_updated_at
    BEFORE UPDATE ON project_updates
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_decision_options_updated_at'
  ) THEN
    CREATE TRIGGER update_decision_options_updated_at
    BEFORE UPDATE ON decision_options
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_decision_reflections_updated_at'
  ) THEN
    CREATE TRIGGER update_decision_reflections_updated_at
    BEFORE UPDATE ON decision_reflections
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_memory_links_updated_at'
  ) THEN
    CREATE TRIGGER update_memory_links_updated_at
    BEFORE UPDATE ON memory_links
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_memory_embeddings_updated_at'
  ) THEN
    CREATE TRIGGER update_memory_embeddings_updated_at
    BEFORE UPDATE ON memory_embeddings
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

ALTER TABLE life_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE decision_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE decision_reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_embeddings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "life areas read own" ON life_areas FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "life areas write own" ON life_areas FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "life areas update own" ON life_areas FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "life areas delete own" ON life_areas FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "timeline read own" ON timeline_events FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "timeline write own" ON timeline_events FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "timeline update own" ON timeline_events FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "timeline delete own" ON timeline_events FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "activity read own" ON user_activity FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "activity write own" ON user_activity FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "activity update own" ON user_activity FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "activity delete own" ON user_activity FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "goal milestones read own" ON goal_milestones FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "goal milestones write own" ON goal_milestones FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "goal milestones update own" ON goal_milestones FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "goal milestones delete own" ON goal_milestones FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "goal updates read own" ON goal_updates FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "goal updates write own" ON goal_updates FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "goal updates update own" ON goal_updates FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "goal updates delete own" ON goal_updates FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "project tasks read own" ON project_tasks FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "project tasks write own" ON project_tasks FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "project tasks update own" ON project_tasks FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "project tasks delete own" ON project_tasks FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "project updates read own" ON project_updates FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "project updates write own" ON project_updates FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "project updates update own" ON project_updates FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "project updates delete own" ON project_updates FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "decision options read own" ON decision_options FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "decision options write own" ON decision_options FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "decision options update own" ON decision_options FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "decision options delete own" ON decision_options FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "decision reflections read own" ON decision_reflections FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "decision reflections write own" ON decision_reflections FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "decision reflections update own" ON decision_reflections FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "decision reflections delete own" ON decision_reflections FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "memory links read own" ON memory_links FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "memory links write own" ON memory_links FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "memory links update own" ON memory_links FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "memory links delete own" ON memory_links FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "memory embeddings read own" ON memory_embeddings FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "memory embeddings write own" ON memory_embeddings FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "memory embeddings update own" ON memory_embeddings FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "memory embeddings delete own" ON memory_embeddings FOR DELETE USING (user_id = auth.uid());

-- seed a basic activity function for consistent lifecycle tracking
CREATE OR REPLACE FUNCTION public.record_user_activity(
  p_user_id UUID,
  p_action TEXT,
  p_category TEXT DEFAULT 'general',
  p_target_type TEXT DEFAULT NULL,
  p_target_id UUID DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO public.user_activity (user_id, action, category, target_type, target_id, metadata)
  VALUES (p_user_id, p_action, p_category, p_target_type, p_target_id, p_metadata)
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.record_timeline_event(
  p_user_id UUID,
  p_title TEXT,
  p_summary TEXT DEFAULT NULL,
  p_event_type TEXT DEFAULT 'activity',
  p_source_table TEXT DEFAULT NULL,
  p_source_id UUID DEFAULT NULL,
  p_source_entity_type TEXT DEFAULT NULL,
  p_occurred_at TIMESTAMPTZ DEFAULT NOW(),
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO public.timeline_events (
    user_id, title, summary, event_type, source_table, source_id, source_entity_type, occurred_at, metadata
  ) VALUES (
    p_user_id, p_title, p_summary, p_event_type, p_source_table, p_source_id, p_source_entity_type, p_occurred_at, p_metadata
  ) RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

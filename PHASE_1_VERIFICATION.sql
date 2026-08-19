-- PHASE 1 DEPLOYMENT VERIFICATION SCRIPT
-- Run this in Supabase SQL Editor to verify successful deployment

-- ============================================
-- TABLE EXISTENCE CHECKS
-- ============================================

-- Verify all Phase 1 tables exist
SELECT 
  'graph_nodes' as table_name,
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name='graph_nodes') as exists
UNION ALL
SELECT 'graph_edges', EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name='graph_edges')
UNION ALL
SELECT 'entity_versions', EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name='entity_versions')
UNION ALL
SELECT 'project_events', EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name='project_events')
UNION ALL
SELECT 'goal_events', EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name='goal_events')
UNION ALL
SELECT 'decision_reviews', EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name='decision_reviews')
UNION ALL
SELECT 'personal_context', EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name='personal_context')
UNION ALL
SELECT 'context_inferences', EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name='context_inferences')
UNION ALL
SELECT 'memory_evolution_chains', EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name='memory_evolution_chains')
UNION ALL
SELECT 'evolution_events', EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name='evolution_events')
UNION ALL
SELECT 'forgotten_ranking', EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name='forgotten_ranking')
UNION ALL
SELECT 'open_loops', EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name='open_loops')
UNION ALL
SELECT 'memory_inbox', EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name='memory_inbox')
UNION ALL
SELECT 'integrations', EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name='integrations')
UNION ALL
SELECT 'permission_grants', EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name='permission_grants')
UNION ALL
SELECT 'vault_access_logs', EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name='vault_access_logs')
UNION ALL
SELECT 'background_jobs', EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name='background_jobs');

-- ============================================
-- RLS POLICY VERIFICATION
-- ============================================

-- Check that RLS is enabled on critical tables
SELECT 
  tablename,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = t.tablename) as policy_count
FROM (
  SELECT 'graph_nodes' as tablename
  UNION ALL SELECT 'graph_edges'
  UNION ALL SELECT 'entity_versions'
  UNION ALL SELECT 'open_loops'
  UNION ALL SELECT 'forgotten_ranking'
) t
ORDER BY tablename;

-- ============================================
-- INDEX VERIFICATION
-- ============================================

-- List all indexes for graph tables
SELECT 
  schemaname,
  tablename,
  indexname
FROM pg_indexes
WHERE tablename IN (
  'graph_nodes',
  'graph_edges', 
  'entity_versions',
  'open_loops',
  'forgotten_ranking'
)
ORDER BY tablename, indexname;

-- ============================================
-- STORAGE CHECKS
-- ============================================

-- Current table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE tablename IN (
  'graph_nodes',
  'graph_edges',
  'entity_versions',
  'project_events',
  'goal_events',
  'decision_reviews',
  'open_loops',
  'forgotten_ranking'
)
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- ============================================
-- FUNCTION VERIFICATION
-- ============================================

-- Check that helper functions exist
SELECT 
  routinename,
  routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
AND (
  routine_name = 'create_graph_node'
  OR routine_name = 'create_graph_edge'
  OR routine_name = 'log_project_event'
  OR routine_name = 'log_goal_event'
)
ORDER BY routinename;

-- ============================================
-- COLUMN VERIFICATION
-- ============================================

-- Check graph_nodes columns
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'graph_nodes'
ORDER BY ordinal_position;

-- Check graph_edges columns
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'graph_edges'
ORDER BY ordinal_position;

-- ============================================
-- DATA INTEGRITY TESTS
-- ============================================

-- Test: Can we insert into graph_nodes? (as service_role)
-- Note: Run this with service_role key or authenticated user
-- INSERT INTO graph_nodes (
--   user_id, node_type, source_entity_id, source_entity_type, title
-- ) VALUES (
--   '00000000-0000-0000-0000-000000000000',
--   'test_node',
--   '00000000-0000-0000-0000-000000000001',
--   'test',
--   'Test Node'
-- ) RETURNING id;

-- Test: Verify RLS prevents cross-user access
-- SELECT COUNT(*) FROM graph_nodes WHERE user_id != auth.uid();
-- Expected: 0 (if user is authenticated)

-- ============================================
-- PERFORMANCE BASELINE
-- ============================================

-- Check analyze status for query planner
ANALYZE graph_nodes;
ANALYZE graph_edges;
ANALYZE entity_versions;
ANALYZE forgotten_ranking;
ANALYZE open_loops;

-- Query plan for common operations
EXPLAIN ANALYZE
  SELECT id, title, importance_score
  FROM graph_nodes
  WHERE user_id = auth.uid()
  AND node_type = 'memory'
  ORDER BY importance_score DESC
  LIMIT 10;

-- ============================================
-- MONITORING SETUP
-- ============================================

-- View current connections
SELECT usename, count(*)
FROM pg_stat_activity
GROUP BY usename;

-- Slow queries (if pg_stat_statements enabled)
SELECT query, calls, mean_time
FROM pg_stat_statements
WHERE query LIKE '%graph%'
ORDER BY mean_time DESC
LIMIT 10;

-- ============================================
-- POST-DEPLOYMENT CHECKLIST
-- ============================================

-- All Phase 1 tables created: _____ 
-- RLS policies enabled: _____
-- Helper functions deployed: _____
-- Indexes created: _____
-- No errors in function definitions: _____
-- Test queries execute successfully: _____
-- Performance baseline established: _____

-- ============================================
-- CLEANUP (if needed)
-- ============================================

-- DON'T RUN unless you need to reset
-- DROP TABLE IF EXISTS graph_edges CASCADE;
-- DROP TABLE IF EXISTS graph_nodes CASCADE;
-- DROP TABLE IF EXISTS entity_versions CASCADE;
-- DROP TABLE IF EXISTS project_events CASCADE;
-- DROP TABLE IF EXISTS goal_events CASCADE;
-- DROP TABLE IF EXISTS decision_reviews CASCADE;
-- DROP TABLE IF EXISTS personal_context CASCADE;
-- DROP TABLE IF EXISTS context_inferences CASCADE;
-- DROP TABLE IF EXISTS memory_evolution_chains CASCADE;
-- DROP TABLE IF EXISTS evolution_events CASCADE;
-- DROP TABLE IF EXISTS forgotten_ranking CASCADE;
-- DROP TABLE IF EXISTS open_loops CASCADE;
-- DROP TABLE IF EXISTS memory_inbox CASCADE;
-- DROP TABLE IF EXISTS integrations CASCADE;
-- DROP TABLE IF EXISTS permission_grants CASCADE;
-- DROP TABLE IF EXISTS vault_access_logs CASCADE;
-- DROP TABLE IF EXISTS background_jobs CASCADE;

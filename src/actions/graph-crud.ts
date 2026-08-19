'use server';

import { getSupabaseClient, requireSupabaseClient } from '@/lib/db/supabase';

// ============================================
// GRAPH NODE OPERATIONS
// ============================================

export async function createGraphNodeAction(
  nodeType: string,
  sourceEntityId: string,
  sourceEntityType: string,
  title: string,
  summary?: string,
  importance?: number
) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Supabase not configured', data: null };
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'Not authenticated', data: null };
  }

  try {
    const { data, error } = await supabase
      .from('graph_nodes')
      .insert({
        user_id: user.id,
        node_type: nodeType,
        source_entity_id: sourceEntityId,
        source_entity_type: sourceEntityType,
        title,
        summary: summary || null,
        importance_score: importance || 0.5,
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data, error: null };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to create graph node',
      data: null,
    };
  }
}

export async function updateGraphNodeAction(
  nodeId: string,
  updates: {
    title?: string;
    summary?: string;
    importance_score?: number;
  }
) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Supabase not configured', data: null };
  }

  try {
    const { data, error } = await supabase
      .from('graph_nodes')
      .update(updates)
      .eq('id', nodeId)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data, error: null };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to update graph node',
      data: null,
    };
  }
}

export async function deleteGraphNodeAction(nodeId: string) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    const { error } = await supabase
      .from('graph_nodes')
      .delete()
      .eq('id', nodeId);

    if (error) throw error;

    return { success: true, error: null };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to delete graph node',
    };
  }
}

// ============================================
// GRAPH EDGE OPERATIONS
// ============================================

export async function createGraphEdgeAction(
  sourceNodeId: string,
  targetNodeId: string,
  relationshipType: string,
  confidence?: number,
  reasoning?: string,
  supportingMemoryIds?: string[]
) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Supabase not configured', data: null };
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'Not authenticated', data: null };
  }

  if (sourceNodeId === targetNodeId) {
    return {
      success: false,
      error: 'Cannot create edge between a node and itself',
      data: null,
    };
  }

  try {
    const { data, error } = await supabase
      .from('graph_edges')
      .insert({
        user_id: user.id,
        source_node_id: sourceNodeId,
        target_node_id: targetNodeId,
        relationship_type: relationshipType,
        confidence: confidence || 0.5,
        reasoning: reasoning || null,
        supporting_memory_ids: supportingMemoryIds || [],
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data, error: null };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to create graph edge',
      data: null,
    };
  }
}

export async function updateGraphEdgeAction(
  edgeId: string,
  updates: {
    confidence?: number;
    reasoning?: string;
    is_approved?: boolean;
    user_feedback_score?: number;
  }
) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Supabase not configured', data: null };
  }

  try {
    const { data, error } = await supabase
      .from('graph_edges')
      .update(updates)
      .eq('id', edgeId)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data, error: null };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to update graph edge',
      data: null,
    };
  }
}

export async function approveGraphEdgeAction(edgeId: string) {
  return updateGraphEdgeAction(edgeId, { is_approved: true });
}

export async function dismissGraphEdgeAction(edgeId: string) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    const { error } = await supabase
      .from('graph_edges')
      .update({ is_dismissed: true })
      .eq('id', edgeId);

    if (error) throw error;

    return { success: true, error: null };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to dismiss edge',
    };
  }
}

// ============================================
// ENTITY VERSIONING
// ============================================

export async function recordEntityVersion(
  entityType: string,
  entityId: string,
  changeType: string,
  changedFields: string[],
  snapshot: Record<string, unknown>,
  validFrom?: string
) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Supabase not configured', data: null };
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'Not authenticated', data: null };
  }

  try {
    // Get current version number
    const { data: lastVersion, error: versionError } = await supabase
      .from('entity_versions')
      .select('version_number')
      .eq('user_id', user.id)
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('version_number', { ascending: false })
      .limit(1)
      .single();

    const nextVersionNumber = (lastVersion?.version_number || 0) + 1;

    // Close previous version if exists
    if (lastVersion) {
      await supabase
        .from('entity_versions')
        .update({ valid_to: new Date().toISOString() })
        .eq('version_number', lastVersion.version_number)
        .eq('entity_type', entityType)
        .eq('entity_id', entityId);
    }

    // Create new version
    const { data, error } = await supabase
      .from('entity_versions')
      .insert({
        user_id: user.id,
        entity_type: entityType,
        entity_id: entityId,
        version_number: nextVersionNumber,
        change_type: changeType,
        changed_fields: changedFields,
        snapshot,
        valid_from: validFrom || new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data, error: null };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to record version',
      data: null,
    };
  }
}

// ============================================
// MEMORY EVOLUTION CHAINS
// ============================================

export async function createEvolutionChainAction(
  subjectType: string,
  subjectEntityId: string,
  subjectName: string,
  description?: string
) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Supabase not configured', data: null };
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'Not authenticated', data: null };
  }

  try {
    const { data, error } = await supabase
      .from('memory_evolution_chains')
      .insert({
        user_id: user.id,
        subject_type: subjectType,
        subject_entity_id: subjectEntityId,
        subject_name: subjectName,
        description: description || null,
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data, error: null };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to create evolution chain',
      data: null,
    };
  }
}

export async function addEvolutionEventAction(
  chainId: string,
  eventDate: string,
  title: string,
  summary?: string,
  sourceMemoryId?: string,
  sourceProjectId?: string,
  sourceGoalId?: string,
  sourceDecisionId?: string
) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Supabase not configured', data: null };
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'Not authenticated', data: null };
  }

  try {
    const { data, error } = await supabase
      .from('evolution_events')
      .insert({
        user_id: user.id,
        chain_id: chainId,
        event_date: eventDate,
        title,
        summary: summary || null,
        source_memory_id: sourceMemoryId || null,
        source_project_id: sourceProjectId || null,
        source_goal_id: sourceGoalId || null,
        source_decision_id: sourceDecisionId || null,
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data, error: null };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to add evolution event',
      data: null,
    };
  }
}

// ============================================
// FORGOTTEN MEMORY RANKING
// ============================================

export async function updateForgottenRankingAction(memoryId: string) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Supabase not configured', data: null };
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'Not authenticated', data: null };
  }

  try {
    // Placeholder calculation - in production, use ML scoring
    const compositeScore = Math.random() * 0.5 + 0.5;

    const { data, error } = await supabase
      .from('forgotten_ranking')
      .upsert({
        user_id: user.id,
        memory_id: memoryId,
        days_since_last_review: 7,
        semantic_relevance: 0.5,
        importance_score: 0.5,
        relationship_to_current_activity: 0.3,
        novelty_score: 0.2,
        composite_score: compositeScore,
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data, error: null };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to update ranking',
      data: null,
    };
  }
}

// ============================================
// OPEN LOOPS DETECTION
// ============================================

export async function createOpenLoopAction(
  loopType: string,
  entityType: string,
  entityId: string,
  description?: string,
  detectionReason?: string
) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Supabase not configured', data: null };
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'Not authenticated', data: null };
  }

  try {
    const { data, error } = await supabase
      .from('open_loops')
      .insert({
        user_id: user.id,
        loop_type: loopType,
        entity_type: entityType,
        entity_id: entityId,
        description: description || null,
        detection_reason: detectionReason || 'Manual creation',
        status: 'open',
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data, error: null };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to create open loop',
      data: null,
    };
  }
}

export async function closeOpenLoopAction(loopId: string, resolution?: string) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Supabase not configured', data: null };
  }

  try {
    const { data, error } = await supabase
      .from('open_loops')
      .update({
        status: 'closed',
        user_action: resolution || 'Resolved',
      })
      .eq('id', loopId)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data, error: null };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to close loop',
      data: null,
    };
  }
}

// ============================================
// DECISION REVIEWS
// ============================================

export async function createDecisionReviewAction(
  decisionId: string,
  expectedOutcome: string,
  actualOutcome: string,
  userLesson?: string,
  supportingEvents?: string[]
) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Supabase not configured', data: null };
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'Not authenticated', data: null };
  }

  try {
    // Create review
    const { data: reviewData, error: reviewError } = await supabase
      .from('decision_reviews')
      .insert({
        user_id: user.id,
        decision_id: decisionId,
        expected_outcome: expectedOutcome,
        actual_outcome: actualOutcome,
        user_lesson: userLesson || null,
        supporting_events: supportingEvents || [],
      })
      .select()
      .single();

    if (reviewError) throw reviewError;

    // Update decision with review data
    await supabase
      .from('decisions')
      .update({
        expected_outcome: expectedOutcome,
        actual_outcome: actualOutcome,
        lesson: userLesson || null,
        review_status: 'completed',
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', decisionId);

    return { success: true, data: reviewData, error: null };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to create review',
      data: null,
    };
  }
}

// ============================================
// PROJECT & GOAL EVENTS
// ============================================

export async function logProjectEventAction(
  projectId: string,
  eventType: string,
  eventData?: Record<string, unknown>,
  relatedMemoryId?: string,
  relatedDecisionId?: string
) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Supabase not configured', data: null };
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'Not authenticated', data: null };
  }

  try {
    const { data, error } = await supabase
      .from('project_events')
      .insert({
        user_id: user.id,
        project_id: projectId,
        event_type: eventType,
        event_data: eventData || {},
        related_memory_id: relatedMemoryId || null,
        related_decision_id: relatedDecisionId || null,
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data, error: null };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to log event',
      data: null,
    };
  }
}

export async function logGoalEventAction(
  goalId: string,
  eventType: string,
  eventData?: Record<string, unknown>,
  relatedMemoryId?: string
) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Supabase not configured', data: null };
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'Not authenticated', data: null };
  }

  try {
    const { data, error } = await supabase
      .from('goal_events')
      .insert({
        user_id: user.id,
        goal_id: goalId,
        event_type: eventType,
        event_data: eventData || {},
        related_memory_id: relatedMemoryId || null,
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data, error: null };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to log event',
      data: null,
    };
  }
}

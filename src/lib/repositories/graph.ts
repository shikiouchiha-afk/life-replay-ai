'use server';

import { getSupabaseClient } from '@/lib/db/supabase';

// ============================================
// GRAPH NODE & EDGE TYPES
// ============================================

export type GraphNode = {
  id: string;
  user_id: string;
  node_type: string;
  source_entity_id: string;
  source_entity_type: string;
  title: string;
  summary?: string | null;
  importance_score: number;
  mention_count: number;
  last_mentioned_at?: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type GraphEdge = {
  id: string;
  user_id: string;
  source_node_id: string;
  target_node_id: string;
  relationship_type: string;
  confidence: number;
  reasoning?: string | null;
  supporting_memory_ids?: string[];
  created_by: string;
  is_approved?: boolean | null;
  is_dismissed: boolean;
  user_feedback_score: number;
  created_at: string;
  updated_at: string;
};

export type EntityVersion = {
  id: string;
  user_id: string;
  entity_type: string;
  entity_id: string;
  version_number: number;
  change_type: string;
  changed_fields: string[];
  snapshot: Record<string, unknown>;
  valid_from: string;
  valid_to?: string | null;
  created_at: string;
};

export type EvolutionChain = {
  id: string;
  user_id: string;
  subject_type: string;
  subject_entity_id: string;
  subject_name: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
};

export type EvolutionEvent = {
  id: string;
  user_id: string;
  chain_id: string;
  event_date: string;
  title: string;
  summary?: string | null;
  source_memory_id?: string | null;
  source_project_id?: string | null;
  source_goal_id?: string | null;
  source_decision_id?: string | null;
  created_at: string;
};

export type ForgottenMemory = {
  id: string;
  user_id: string;
  memory_id: string;
  days_since_last_review: number;
  semantic_relevance: number;
  importance_score: number;
  relationship_to_current_activity: number;
  novelty_score: number;
  composite_score: number;
  is_dismissed: boolean;
  user_rating?: number | null;
  last_presented_at?: string | null;
  memory?: {
    title: string;
    summary?: string | null;
  };
  created_at: string;
};

export type OpenLoop = {
  id: string;
  user_id: string;
  loop_type: string;
  entity_type: string;
  entity_id: string;
  description?: string | null;
  detection_reason: string;
  confidence: number;
  status: string;
  created_at: string;
};

// ============================================
// GRAPH CREATION & MANAGEMENT
// ============================================

export async function createGraphNode(
  nodeType: string,
  sourceEntityId: string,
  sourceEntityType: string,
  title: string,
  summary?: string,
  importance?: number
) {
  const supabase = getSupabaseClient();
  if (!supabase) return { data: null, error: 'Supabase not configured' };

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return { data: null, error: 'Not authenticated' };

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
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Failed to create node' };
  }
}

export async function createGraphEdge(
  sourceNodeId: string,
  targetNodeId: string,
  relationshipType: string,
  confidence?: number,
  reasoning?: string,
  supportingMemoryIds?: string[]
) {
  const supabase = getSupabaseClient();
  if (!supabase) return { data: null, error: 'Supabase not configured' };

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return { data: null, error: 'Not authenticated' };

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
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Failed to create edge' };
  }
}

// ============================================
// GRAPH RETRIEVAL
// ============================================

export async function getGraphNodes(limit = 50) {
  const supabase = getSupabaseClient();
  if (!supabase) return { data: [] as GraphNode[], error: 'Supabase not configured' };

  try {
    const { data, error } = await supabase
      .from('graph_nodes')
      .select('*')
      .order('importance_score', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { data: (data || []) as GraphNode[], error: null };
  } catch (err) {
    return { data: [], error: err instanceof Error ? err.message : 'Failed to fetch nodes' };
  }
}

export async function getGraphNodesByType(nodeType: string, limit = 50) {
  const supabase = getSupabaseClient();
  if (!supabase) return { data: [] as GraphNode[], error: 'Supabase not configured' };

  try {
    const { data, error } = await supabase
      .from('graph_nodes')
      .select('*')
      .eq('node_type', nodeType)
      .order('importance_score', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { data: (data || []) as GraphNode[], error: null };
  } catch (err) {
    return { data: [], error: err instanceof Error ? err.message : 'Failed to fetch nodes' };
  }
}

export async function getGraphEdgesForNode(nodeId: string, limit = 100) {
  const supabase = getSupabaseClient();
  if (!supabase) return { data: [] as GraphEdge[], error: 'Supabase not configured' };

  try {
    const { data, error } = await supabase
      .from('graph_edges')
      .select('*')
      .or(`source_node_id.eq.${nodeId},target_node_id.eq.${nodeId}`)
      .eq('is_dismissed', false)
      .order('confidence', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { data: (data || []) as GraphEdge[], error: null };
  } catch (err) {
    return { data: [], error: err instanceof Error ? err.message : 'Failed to fetch edges' };
  }
}

// ============================================
// MEMORY EVOLUTION
// ============================================

export async function getEvolutionChains(limit = 20) {
  const supabase = getSupabaseClient();
  if (!supabase) return { data: [] as EvolutionChain[], error: 'Supabase not configured' };

  try {
    const { data, error } = await supabase
      .from('memory_evolution_chains')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { data: (data || []) as EvolutionChain[], error: null };
  } catch (err) {
    return { data: [], error: err instanceof Error ? err.message : 'Failed to fetch chains' };
  }
}

export async function getEvolutionEvents(chainId: string) {
  const supabase = getSupabaseClient();
  if (!supabase) return { data: [] as EvolutionEvent[], error: 'Supabase not configured' };

  try {
    const { data, error } = await supabase
      .from('evolution_events')
      .select('*')
      .eq('chain_id', chainId)
      .order('event_date', { ascending: true });

    if (error) throw error;
    return { data: (data || []) as EvolutionEvent[], error: null };
  } catch (err) {
    return { data: [], error: err instanceof Error ? err.message : 'Failed to fetch events' };
  }
}

// ============================================
// FORGOTTEN KNOWLEDGE
// ============================================

export async function getForgottenMemories(limit = 20) {
  const supabase = getSupabaseClient();
  if (!supabase) return { data: [] as ForgottenMemory[], error: 'Supabase not configured' };

  try {
    const { data, error } = await supabase
      .from('forgotten_ranking')
      .select(`
        *,
        memories (
          id,
          title,
          summary
        )
      `)
      .eq('is_dismissed', false)
      .order('composite_score', { ascending: false })
      .limit(limit);

    if (error) throw error;

    const formatted = data?.map((item: any) => ({
      ...item,
      memory: item.memories,
    })) || [];

    return { data: formatted as ForgottenMemory[], error: null };
  } catch (err) {
    return { data: [], error: err instanceof Error ? err.message : 'Failed to fetch forgotten' };
  }
}

export async function dismissForgottenMemory(memoryId: string) {
  const supabase = getSupabaseClient();
  if (!supabase) return { error: 'Supabase not configured' };

  try {
    const { error } = await supabase
      .from('forgotten_ranking')
      .update({ is_dismissed: true })
      .eq('memory_id', memoryId);

    if (error) throw error;
    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to dismiss' };
  }
}

// ============================================
// OPEN LOOPS
// ============================================

export async function getOpenLoops(limit = 20) {
  const supabase = getSupabaseClient();
  if (!supabase) return { data: [] as OpenLoop[], error: 'Supabase not configured' };

  try {
    const { data, error } = await supabase
      .from('open_loops')
      .select('*')
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { data: (data || []) as OpenLoop[], error: null };
  } catch (err) {
    return { data: [], error: err instanceof Error ? err.message : 'Failed to fetch loops' };
  }
}

export async function updateOpenLoopStatus(loopId: string, status: string) {
  const supabase = getSupabaseClient();
  if (!supabase) return { error: 'Supabase not configured' };

  try {
    const { error } = await supabase
      .from('open_loops')
      .update({ status })
      .eq('id', loopId);

    if (error) throw error;
    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to update loop' };
  }
}

// ============================================
// PERSONAL CONTEXT
// ============================================

export async function getPersonalContext() {
  const supabase = getSupabaseClient();
  if (!supabase) return { data: null, error: 'Supabase not configured' };

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return { data: null, error: 'Not authenticated' };

  try {
    const { data, error } = await supabase
      .from('personal_context')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Failed to fetch context' };
  }
}

export async function getContextInferences() {
  const supabase = getSupabaseClient();
  if (!supabase) return { data: [], error: 'Supabase not configured' };

  try {
    const { data, error } = await supabase
      .from('context_inferences')
      .select('*')
      .eq('is_enabled', true)
      .order('confidence', { ascending: false });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (err) {
    return { data: [], error: err instanceof Error ? err.message : 'Failed to fetch inferences' };
  }
}

// ============================================
// PROJECT & GOAL HISTORY
// ============================================

export async function getProjectEvents(projectId: string) {
  const supabase = getSupabaseClient();
  if (!supabase) return { data: [], error: 'Supabase not configured' };

  try {
    const { data, error } = await supabase
      .from('project_events')
      .select('*')
      .eq('project_id', projectId)
      .order('event_date', { ascending: false });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (err) {
    return { data: [], error: err instanceof Error ? err.message : 'Failed to fetch events' };
  }
}

export async function getGoalEvents(goalId: string) {
  const supabase = getSupabaseClient();
  if (!supabase) return { data: [], error: 'Supabase not configured' };

  try {
    const { data, error } = await supabase
      .from('goal_events')
      .select('*')
      .eq('goal_id', goalId)
      .order('event_date', { ascending: false });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (err) {
    return { data: [], error: err instanceof Error ? err.message : 'Failed to fetch events' };
  }
}

// ============================================
// DECISION OUTCOMES
// ============================================

export async function getDecisionReviews(limit = 20) {
  const supabase = getSupabaseClient();
  if (!supabase) return { data: [], error: 'Supabase not configured' };

  try {
    const { data, error } = await supabase
      .from('decision_reviews')
      .select(`
        *,
        decisions (
          id,
          title,
          decision,
          reasoning,
          expected_outcome
        )
      `)
      .order('reviewed_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (err) {
    return { data: [], error: err instanceof Error ? err.message : 'Failed to fetch reviews' };
  }
}

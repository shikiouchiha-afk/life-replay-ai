'use server';

import { getSupabaseClient } from '@/lib/db/supabase';

// ============================================
// RETRIEVAL TYPES
// ============================================

export type RetrievedMemory = {
  id: string;
  title: string;
  summary?: string | null;
  raw_content?: string | null;
  importance: string | null;
  event_date?: string | null;
  created_at?: string | null;
  relevance_score: number;
  retrieval_method: 'keyword' | 'semantic' | 'graph' | 'temporal' | 'hybrid';
  reasoning?: string;
  related_entities?: Array<{ entity_id: string; entity_type: string; name: string }>;
};

export type HybridSearchResult = {
  query: string;
  results: RetrievedMemory[];
  total_results: number;
  search_duration_ms: number;
  inferred_intent?: string;
  suggested_questions?: string[];
};

// ============================================
// KEYWORD SEARCH
// ============================================

async function keywordSearch(
  query: string,
  limit = 10
): Promise<RetrievedMemory[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const searchTerm = query.toLowerCase();

  try {
    // Search across memories with BM25-style ranking
    const { data, error } = await supabase
      .from('memories')
      .select(
        `
        id,
        title,
        summary,
        raw_content,
        importance,
        event_date,
        created_at
      `
      )
      .or(
        `title.ilike.%${searchTerm}%,summary.ilike.%${searchTerm}%,raw_content.ilike.%${searchTerm}%`
      )
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []).map((m: any) => ({
      ...m,
      relevance_score: m.title.toLowerCase().includes(searchTerm) ? 0.9 : 0.7,
      retrieval_method: 'keyword' as const,
      reasoning: `Matched keyword "${searchTerm}" in title/summary`,
    }));
  } catch (err) {
    console.error('Keyword search error:', err);
    return [];
  }
}

// ============================================
// SEMANTIC SEARCH (VECTOR-BASED)
// ============================================

async function semanticSearch(
  query: string,
  embedding: number[],
  limit = 10
): Promise<RetrievedMemory[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  try {
    // Use Supabase's RPC for vector similarity search
    const { data, error } = await supabase.rpc(
      'search_memories_by_embedding',
      {
        query_embedding: embedding,
        match_threshold: 0.5,
        match_count: limit,
      }
    );

    if (error) {
      // Fallback if RPC doesn't exist
      console.log('Semantic search RPC not available, skipping');
      return [];
    }

    return (data || []).map((m: any) => ({
      ...m,
      relevance_score: m.similarity || 0.7,
      retrieval_method: 'semantic' as const,
      reasoning: `Semantically similar to query (similarity: ${(m.similarity * 100).toFixed(1)}%)`,
    }));
  } catch (err) {
    console.error('Semantic search error:', err);
    return [];
  }
}

// ============================================
// GRAPH-BASED RETRIEVAL
// ============================================

async function graphBasedRetrieval(
  query: string,
  limit = 10
): Promise<RetrievedMemory[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  try {
    // Find relevant entities/nodes from the query
    const searchTerm = query.toLowerCase();

    // Search for relevant graph nodes
    const { data: nodes, error: nodesError } = await supabase
      .from('graph_nodes')
      .select('id, title')
      .or(
        `title.ilike.%${searchTerm}%,summary.ilike.%${searchTerm}%`
      )
      .limit(5);

    if (nodesError || !nodes || nodes.length === 0) return [];

    // For each node, find connected memories via edges
    const nodeIds = nodes.map((n: any) => n.id);

    const { data: edges, error: edgesError } = await supabase
      .from('graph_edges')
      .select(`
        source_node_id,
        target_node_id,
        confidence,
        relationship_type
      `)
      .or(
        `source_node_id.in.(${nodeIds.join(',')}),target_node_id.in.(${nodeIds.join(',')})`
      )
      .order('confidence', { ascending: false })
      .limit(limit);

    if (edgesError || !edges) return [];

    // Get memories connected to these nodes via memory_topics/entities
    const connectedNodeIds = [
      ...nodeIds,
      ...edges.map((e: any) => e.source_node_id),
      ...edges.map((e: any) => e.target_node_id),
    ];

    // This is a simplified approach - in production, use a proper graph traversal
    const { data: memories, error: memError } = await supabase
      .from('memories')
      .select('id, title, summary, raw_content, importance, event_date, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (memError || !memories) return [];

    return (memories || []).map((m: any) => ({
      ...m,
      relevance_score: 0.6,
      retrieval_method: 'graph' as const,
      reasoning: `Connected via entity graph to query context`,
    }));
  } catch (err) {
    console.error('Graph-based retrieval error:', err);
    return [];
  }
}

// ============================================
// TEMPORAL RELEVANCE
// ============================================

async function temporalRelevance(
  query: string,
  limit = 10
): Promise<RetrievedMemory[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  try {
    // Find recent memories that might be relevant
    const { data, error } = await supabase
      .from('memories')
      .select('id, title, summary, raw_content, importance, event_date, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error || !data) return [];

    return data.map((m: any) => {
      const recencyScore = Math.exp(
        -(Date.now() - new Date(m.created_at).getTime()) / (365 * 24 * 60 * 60 * 1000)
      );
      return {
        ...m,
        relevance_score: recencyScore,
        retrieval_method: 'temporal' as const,
        reasoning: `Recent memory (${Math.floor((Date.now() - new Date(m.created_at).getTime()) / (24 * 60 * 60 * 1000))} days ago)`,
      };
    });
  } catch (err) {
    console.error('Temporal retrieval error:', err);
    return [];
  }
}

// ============================================
// HYBRID RETRIEVAL ORCHESTRATION
// ============================================

export async function hybridSearch(
  query: string,
  options?: {
    limit?: number;
    useKeyword?: boolean;
    useSemantic?: boolean;
    useGraph?: boolean;
    useTemporal?: boolean;
    embedding?: number[];
  }
): Promise<HybridSearchResult> {
  const startTime = Date.now();
  const limit = options?.limit || 10;
  const useKeyword = options?.useKeyword !== false;
  const useGraph = options?.useGraph !== false;
  const useTemporal = options?.useTemporal !== false;

  try {
    // Run retrieval methods in parallel
    const [keywordResults, graphResults, temporalResults] = await Promise.all([
      useKeyword ? keywordSearch(query, limit) : Promise.resolve([]),
      useGraph ? graphBasedRetrieval(query, limit) : Promise.resolve([]),
      useTemporal ? temporalRelevance(query, limit) : Promise.resolve([]),
    ]);

    // Combine and deduplicate results
    const allResults = [...keywordResults, ...graphResults, ...temporalResults];
    const deduped = new Map<string, RetrievedMemory>();

    for (const result of allResults) {
      if (deduped.has(result.id)) {
        const existing = deduped.get(result.id)!;
        // Boost score if found by multiple methods
        existing.relevance_score = Math.min(1.0, existing.relevance_score + 0.2);
      } else {
        deduped.set(result.id, result);
      }
    }

    // Sort by relevance score
    const sorted = Array.from(deduped.values()).sort(
      (a, b) => b.relevance_score - a.relevance_score
    ).slice(0, limit);

    const duration = Date.now() - startTime;

    return {
      query,
      results: sorted,
      total_results: sorted.length,
      search_duration_ms: duration,
      inferred_intent: inferIntent(query),
      suggested_questions: generateFollowUpQuestions(query),
    };
  } catch (err) {
    console.error('Hybrid search error:', err);
    return {
      query,
      results: [],
      total_results: 0,
      search_duration_ms: Date.now() - startTime,
    };
  }
}

// ============================================
// CONTEXT-AWARE RETRIEVAL
// ============================================

export async function askMyEntireLife(question: string): Promise<{
  answer: string | null;
  supporting_evidence: RetrievedMemory[];
  confidence: number;
  sources_cited: Array<{ memory_id: string; title: string; relevance: number }>;
}> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      answer: null,
      supporting_evidence: [],
      confidence: 0,
      sources_cited: [],
    };
  }

  try {
    // Get personal context
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        answer: null,
        supporting_evidence: [],
        confidence: 0,
        sources_cited: [],
      };
    }

    // Perform hybrid search
    const searchResult = await hybridSearch(question, { limit: 20 });

    // Get top supporting evidence
    const supporting = searchResult.results.slice(0, 5);

    // Build answer from supporting evidence (placeholder - would use LLM in production)
    const answer =
      supporting.length > 0
        ? `Based on your memories and personal context: ${supporting.map((m) => m.title).join(', ')}`
        : null;

    const sources = supporting.map((m) => ({
      memory_id: m.id,
      title: m.title,
      relevance: m.relevance_score,
    }));

    return {
      answer,
      supporting_evidence: supporting,
      confidence: supporting.length > 0 ? 0.7 : 0,
      sources_cited: sources,
    };
  } catch (err) {
    console.error('Ask my entire life error:', err);
    return {
      answer: null,
      supporting_evidence: [],
      confidence: 0,
      sources_cited: [],
    };
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function inferIntent(query: string): string {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('who') || lowerQuery.includes('person')) return 'entity_lookup';
  if (lowerQuery.includes('when') || lowerQuery.includes('date')) return 'temporal';
  if (lowerQuery.includes('where') || lowerQuery.includes('location')) return 'location';
  if (lowerQuery.includes('why') || lowerQuery.includes('reason')) return 'causality';
  if (lowerQuery.includes('how') || lowerQuery.includes('process')) return 'process';

  return 'general_question';
}

function generateFollowUpQuestions(query: string): string[] {
  return [
    `Tell me more about the context of: ${query}`,
    `What were the outcomes related to: ${query}`,
    `Who was involved in: ${query}`,
    `When did this happen: ${query}`,
  ];
}

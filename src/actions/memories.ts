'use server';

import { requireSupabaseClient, supabase } from '@/lib/db/supabase';
import {
  Memory,
  MemoryInsert,
  MemoryUpdate,
  MemoryWithRelations,
} from '@/types/database';
import { MemoryImportance, MemoryType, ProcessingJobType } from '@/types/database';

/**
 * Create a new memory
 */
export async function createMemory(data: MemoryInsert) {
  try {
    const client = supabase ?? requireSupabaseClient();
    const { data: memory, error } = await client
      .from('memories')
      .insert([data])
      .select()
      .single();

    if (error) throw error;

    // Queue processing job
    if (memory) {
      await queueProcessingJob({
        job_type: ProcessingJobType.EMBEDDING,
        target_id: memory.id,
        user_id: memory.user_id,
        payload: {
          memory_id: memory.id,
          content: memory.raw_content || memory.clean_content,
        },
      });
    }

    return { success: true, data: memory };
  } catch (error) {
    console.error('Error creating memory:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Update a memory
 */
export async function updateMemory(id: string, data: MemoryUpdate) {
  try {
    const client = supabase ?? requireSupabaseClient();
    const { data: memory, error } = await client
      .from('memories')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data: memory };
  } catch (error) {
    console.error('Error updating memory:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get a single memory with all relations
 */
export async function getMemoryWithRelations(
  id: string
): Promise<MemoryWithRelations | null> {
  try {
    const client = supabase ?? requireSupabaseClient();
    const { data: memory, error: memoryError } = await client
      .from('memories')
      .select('*')
      .eq('id', id)
      .single();

    if (memoryError) throw memoryError;
    if (!memory) return null;

    const { data: category } = await client
      .from('categories')
      .select('*')
      .eq('id', memory.category_id)
      .single();

    const { data: topics } = await client
      .from('memory_topics')
      .select('topic_id, topics(*)')
      .eq('memory_id', id);

    const { data: entities } = await client
      .from('memory_entities')
      .select('entity_id, entities(*)')
      .eq('memory_id', id);

    const { data: projects } = await client
      .from('memory_projects')
      .select('project_id, projects(*)')
      .eq('memory_id', id);

    const { data: goals } = await client
      .from('memory_goals')
      .select('goal_id, goals(*)')
      .eq('memory_id', id);

    const { data: connections } = await client
      .from('memory_connections')
      .select('*')
      .or(`memory_id_1.eq.${id},memory_id_2.eq.${id}`);

    const { data: files } = await client
      .from('files')
      .select('*')
      .eq('memory_id', id);

    return {
      ...memory,
      category: category || null,
      topics: topics?.map((t: any) => t.topics) || [],
      entities: entities?.map((e: any) => e.entities) || [],
      projects: projects?.map((p: any) => p.projects) || [],
      goals: goals?.map((g: any) => g.goals) || [],
      connections: connections || [],
      files: files || [],
    };
  } catch (error) {
    console.error('Error fetching memory with relations:', error);
    return null;
  }
}

/**
 * Get user's memories (paginated)
 */
export async function getUserMemories(
  userId: string,
  page: number = 1,
  limit: number = 20
) {
  try {
    const client = supabase ?? requireSupabaseClient();
    const offset = (page - 1) * limit;

    const { data: memories, error, count } = await client
      .from('memories')
      .select(
        `
        id,
        title,
        summary,
        memory_type,
        importance,
        event_date,
        is_favorite,
        categories(name, color),
        memory_topics(topics(name)),
        created_at
      `,
        { count: 'exact' }
      )
      .eq('user_id', userId)
      .eq('is_archived', false)
      .order('event_date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      success: true,
      data: memories,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    };
  } catch (error) {
    console.error('Error fetching user memories:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: [],
      pagination: { page, limit, total: 0, pages: 0 },
    };
  }
}

/**
 * Search memories using semantic search
 */
export async function searchMemories(
  userId: string,
  query: string,
  filters: {
    category?: string;
    importance?: MemoryImportance;
    memoryType?: MemoryType;
    dateFrom?: string;
    dateTo?: string;
  } = {}
) {
  try {
    const client = supabase ?? requireSupabaseClient();
    let qb = client
      .from('memories')
      .select(`id, title, summary, memory_type, importance, event_date, created_at`)
      .eq('user_id', userId)
      .eq('is_archived', false);

    if (filters.category) {
      qb = qb.eq('category_id', filters.category);
    }

    if (filters.importance) {
      qb = qb.eq('importance', filters.importance);
    }

    if (filters.memoryType) {
      qb = qb.eq('memory_type', filters.memoryType);
    }

    if (filters.dateFrom) {
      qb = qb.gte('event_date', filters.dateFrom);
    }

    if (filters.dateTo) {
      qb = qb.lte('event_date', filters.dateTo);
    }

    const { data: memories, error } = await qb.order('event_date', {
      ascending: false,
    });

    if (error) throw error;

    // TODO: Implement actual semantic search with embeddings
    // For now, do keyword matching
    const results = memories.filter(
      (m) =>
        m.title.toLowerCase().includes(query.toLowerCase()) ||
        (m.summary && m.summary.toLowerCase().includes(query.toLowerCase()))
    );

    return {
      success: true,
      data: results,
      count: results.length,
    };
  } catch (error) {
    console.error('Error searching memories:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: [],
      count: 0,
    };
  }
}

/**
 * Archive a memory
 */
export async function archiveMemory(id: string) {
  return updateMemory(id, { is_archived: true });
}

/**
 * Delete a memory
 */
export async function deleteMemory(id: string) {
  try {
    const client = supabase ?? requireSupabaseClient();
    // Delete related files first
    await client.from('files').delete().eq('memory_id', id);

    // Delete related connections
    await client
      .from('memory_connections')
      .delete()
      .or(`memory_id_1.eq.${id},memory_id_2.eq.${id}`);

    // Delete memory
    const { error } = await client.from('memories').delete().eq('id', id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error deleting memory:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Toggle favorite status
 */
export async function toggleMemoryFavorite(id: string, isFavorite: boolean) {
  return updateMemory(id, { is_favorite: !isFavorite });
}

/**
 * Get memory count by importance
 */
export async function getMemoryStats(userId: string) {
  try {
    const client = supabase ?? requireSupabaseClient();
    const { data: byImportance } = await client
      .from('memories')
      .select('importance', { count: 'exact' })
      .eq('user_id', userId)
      .eq('is_archived', false);

    const { data: byType } = await client
      .from('memories')
      .select('memory_type', { count: 'exact' })
      .eq('user_id', userId)
      .eq('is_archived', false);

    const { count: totalCount } = await client
      .from('memories')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .eq('is_archived', false);

    return {
      success: true,
      data: {
        total: totalCount || 0,
        byImportance: groupByField(byImportance || [], 'importance'),
        byType: groupByField(byType || [], 'memory_type'),
      },
    };
  } catch (error) {
    console.error('Error fetching memory stats:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: { total: 0, byImportance: {}, byType: {} },
    };
  }
}

/**
 * Queue a processing job
 */
export async function queueProcessingJob(payload: {
  job_type: ProcessingJobType;
  target_id: string;
  user_id: string;
  payload: any;
}) {
  try {
    const client = supabase ?? requireSupabaseClient();
    const { error } = await client.from('processing_jobs').insert([
      {
        job_type: payload.job_type,
        target_id: payload.target_id,
        user_id: payload.user_id,
        status: 'pending',
        payload: payload.payload,
      },
    ]);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error queueing processing job:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Helper function to group data by field
function groupByField(
  items: any[],
  field: string
): Record<string, number> {
  return items.reduce(
    (acc, item) => {
      const key = item[field];
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
}

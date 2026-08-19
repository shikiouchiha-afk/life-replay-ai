import { getSupabaseClient, isSupabaseConfigured } from '@/lib/db/supabase';

export type DashboardStats = {
  configured: boolean;
  isAuthenticated: boolean;
  totalMemories: number;
  totalGoals: number;
  totalProjects: number;
  totalDecisions: number;
  totalJournalEntries: number;
  upcomingEvents: number;
  totalActivity: number;
  totalGraphNodes?: number;
  totalOpenLoops?: number;
  totalForgottenMemories?: number;
  totalEvolutionChains?: number;
  recentMemories: Array<{ id: string; title: string; created_at: string | null; importance: string | null }>;
  recentGoals: Array<{ id: string; title: string; progress: number | null; status: string | null }>;
  upcomingCalendar: Array<{ id: string; title: string; event_date: string | null; start_time: string | null }>;
  recentTimeline: Array<{ id: string; title: string; event_type: string | null; occurred_at: string | null; source_table: string | null; summary: string | null }>;
  recentGraphEdges?: Array<{ id: string; relationship_type: string; confidence: number }>;
  priorityOpenLoops?: Array<{ id: string; description: string | null; loop_type: string }>;
  message?: string;
};

export type MemoryRecord = {
  id: string;
  title: string;
  summary?: string | null;
  raw_content?: string | null;
  event_date?: string | null;
  importance?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type GoalRecord = {
  id: string;
  title: string;
  description?: string | null;
  status?: string | null;
  progress?: number | null;
  target_date?: string | null;
  created_at?: string | null;
};

export type ProjectRecord = {
  id: string;
  name: string;
  description?: string | null;
  status?: string | null;
  progress?: number | null;
  target_date?: string | null;
  created_at?: string | null;
};

export type DecisionRecord = {
  id: string;
  title: string;
  reasoning?: string | null;
  status?: string | null;
  decision_date?: string | null;
  created_at?: string | null;
};

export type JournalRecord = {
  id: string;
  title?: string | null;
  content: string;
  entry_date?: string | null;
  mood?: string | null;
  created_at?: string | null;
};

export type CalendarRecord = {
  id: string;
  title: string;
  description?: string | null;
  event_date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  created_at?: string | null;
};

export type TimelineRecord = {
  id: string;
  title: string;
  event_type?: string | null;
  occurred_at?: string | null;
  source_table?: string | null;
  summary?: string | null;
};

async function getUserId() {
  const client = getSupabaseClient();
  if (!client) return null;

  const {
    data: { user },
    error,
  } = await client.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user.id;
}

async function safeSelect<T>(table: string, columns = '*', limit?: number) {
  const client = getSupabaseClient();
  if (!client) {
    return { data: [] as T[], count: 0, error: new Error('Supabase is not configured.') };
  }

  const query = client.from(table).select(columns, { count: 'exact' });
  const paginated = limit ? query.limit(limit) : query;
  const { data, count, error } = await paginated;

  return {
    data: (data ?? []) as T[],
    count: count ?? (Array.isArray(data) ? data.length : 0),
    error,
  };
}

export async function getDashboardStats(): Promise<DashboardStats> {
  if (!isSupabaseConfigured) {
    return {
      configured: false,
      isAuthenticated: false,
      totalMemories: 0,
      totalGoals: 0,
      totalProjects: 0,
      totalDecisions: 0,
      totalJournalEntries: 0,
      upcomingEvents: 0,
      totalActivity: 0,
      recentMemories: [],
      recentGoals: [],
      upcomingCalendar: [],
      recentTimeline: [],
      message: 'Supabase credentials are not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to .env.local to enable live data.',
    };
  }

  const userId = await getUserId();
  if (!userId) {
    return {
      configured: true,
      isAuthenticated: false,
      totalMemories: 0,
      totalGoals: 0,
      totalProjects: 0,
      totalDecisions: 0,
      totalJournalEntries: 0,
      upcomingEvents: 0,
      totalActivity: 0,
      recentMemories: [],
      recentGoals: [],
      upcomingCalendar: [],
      recentTimeline: [],
      message: 'Authenticate to load your real life metrics.',
    };
  }

  const [memories, goals, projects, decisions, journal, events, activity, graphNodes, openLoops, forgottenMemories, evolutionChains, recentEdges, priorityLoops] = await Promise.all([
    safeSelect<MemoryRecord>('memories', 'id,title,created_at,importance', 5),
    safeSelect<GoalRecord>('goals', 'id,title,progress,status', 5),
    safeSelect<ProjectRecord>('projects', 'id,name,progress,status', 5),
    safeSelect<DecisionRecord>('decisions', 'id,title,status,created_at', 5),
    safeSelect<JournalRecord>('journal_entries', 'id,title,content,entry_date,mood', 5),
    safeSelect<CalendarRecord>('calendar_events', 'id,title,event_date,start_time', 5),
    safeSelect<{ id: string; action: string; created_at: string }>('user_activity', 'id,action,created_at', 5),
    getGraphNodeCount(),
    getOpenLoopsCount(),
    getForgottenMemoriesCount(),
    getEvolutionChainsCount(),
    getRecentGraphEdges(3),
    getPriorityOpenLoops(3),
  ]);

  const upcoming = events.data.filter((item) => {
    if (!item.event_date) return false;
    return new Date(item.event_date).getTime() >= Date.now() - 86400000;
  });

  return {
    configured: true,
    isAuthenticated: true,
    totalMemories: memories.count ?? memories.data.length,
    totalGoals: goals.count ?? goals.data.length,
    totalProjects: projects.count ?? projects.data.length,
    totalDecisions: decisions.count ?? decisions.data.length,
    totalJournalEntries: journal.count ?? journal.data.length,
    upcomingEvents: upcoming.length,
    totalActivity: activity.count ?? activity.data.length,
    totalGraphNodes: graphNodes.count,
    totalOpenLoops: openLoops.count,
    totalForgottenMemories: forgottenMemories.count,
    totalEvolutionChains: evolutionChains.count,
    recentMemories: memories.data.map((item) => ({
      id: item.id,
      title: item.title,
      created_at: item.created_at ?? null,
      importance: item.importance ?? null,
    })),
    recentGoals: goals.data.map((item) => ({
      id: item.id,
      title: item.title,
      progress: item.progress ?? null,
      status: item.status ?? null,
    })),
    upcomingCalendar: events.data.map((item) => ({
      id: item.id,
      title: item.title,
      event_date: item.event_date ?? null,
      start_time: item.start_time ?? null,
    })),
    recentTimeline: activity.data.map((item) => ({
      id: item.id,
      title: item.action,
      event_type: 'activity',
      occurred_at: item.created_at,
      source_table: 'user_activity',
      summary: item.action,
    })),
    recentGraphEdges: recentEdges.data,
    priorityOpenLoops: priorityLoops.data,
  };
}

export async function getMemoryLibrary(limit = 20) {
  const client = getSupabaseClient();
  if (!client) {
    return { data: [] as MemoryRecord[], error: new Error('Supabase is not configured.') };
  }

  const { data, error } = await client
    .from('memories')
    .select('id,title,summary,raw_content,event_date,importance,created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  return { data: (data ?? []) as MemoryRecord[], error };
}

export async function getGoalList(limit = 20) {
  const client = getSupabaseClient();
  if (!client) {
    return { data: [] as GoalRecord[], error: new Error('Supabase is not configured.') };
  }

  const { data, error } = await client
    .from('goals')
    .select('id,title,description,status,progress,target_date,created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  return { data: (data ?? []) as GoalRecord[], error };
}

export async function getProjectList(limit = 20) {
  const client = getSupabaseClient();
  if (!client) {
    return { data: [] as ProjectRecord[], error: new Error('Supabase is not configured.') };
  }

  const { data, error } = await client
    .from('projects')
    .select('id,name,description,status,progress,target_date,created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  return { data: (data ?? []) as ProjectRecord[], error };
}

export async function getDecisionList(limit = 20) {
  const client = getSupabaseClient();
  if (!client) {
    return { data: [] as DecisionRecord[], error: new Error('Supabase is not configured.') };
  }

  const { data, error } = await client
    .from('decisions')
    .select('id,title,reasoning,status,decision_date,created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  return { data: (data ?? []) as DecisionRecord[], error };
}

export async function getJournalEntries(limit = 20) {
  const client = getSupabaseClient();
  if (!client) {
    return { data: [] as JournalRecord[], error: new Error('Supabase is not configured.') };
  }

  const { data, error } = await client
    .from('journal_entries')
    .select('id,title,content,entry_date,mood,created_at')
    .order('entry_date', { ascending: false })
    .limit(limit);

  return { data: (data ?? []) as JournalRecord[], error };
}

export async function getCalendarEvents(limit = 20) {
  const client = getSupabaseClient();
  if (!client) {
    return { data: [] as CalendarRecord[], error: new Error('Supabase is not configured.') };
  }

  const { data, error } = await client
    .from('calendar_events')
    .select('id,title,description,event_date,start_time,end_time,created_at')
    .order('event_date', { ascending: true })
    .limit(limit);

  return { data: (data ?? []) as CalendarRecord[], error };
}

export async function getTimelineEntries(limit = 20) {
  const client = getSupabaseClient();
  if (!client) {
    return { data: [] as TimelineRecord[], error: new Error('Supabase is not configured.') };
  }

  const { data, error } = await client
    .from('timeline_events')
    .select('id,title,event_type,occurred_at,source_table,summary')
    .order('occurred_at', { ascending: false })
    .limit(limit);

  return { data: (data ?? []) as TimelineRecord[], error };
}

export async function searchUserHistory(question: string) {
  const client = getSupabaseClient();
  if (!client) {
    return { data: [] as MemoryRecord[], error: new Error('Supabase is not configured.') };
  }

  const { data, error } = await client
    .from('memories')
    .select('id,title,summary,created_at,importance')
    .or(`title.ilike.%${question}%,summary.ilike.%${question}%`)
    .limit(10);

  return { data: (data ?? []) as MemoryRecord[], error };
}

export function subscribeToUserActivity(onUpdate: (payload: unknown) => void) {
  const client = getSupabaseClient();
  if (!client) return null;

  return client
    .channel('user-activity')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'user_activity' }, (payload) => {
      onUpdate(payload);
    })
    .subscribe();
}

// ============================================
// GRAPH RETRIEVAL FUNCTIONS
// ============================================

export async function getGraphNodeCount() {
  const client = getSupabaseClient();
  if (!client) {
    return { count: 0, error: new Error('Supabase is not configured.') };
  }

  const { count, error } = await client
    .from('graph_nodes')
    .select('*', { count: 'exact', head: true });

  return { count: count ?? 0, error };
}

export async function getOpenLoopsCount() {
  const client = getSupabaseClient();
  if (!client) {
    return { count: 0, error: new Error('Supabase is not configured.') };
  }

  const { count, error } = await client
    .from('open_loops')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'open');

  return { count: count ?? 0, error };
}

export async function getForgottenMemoriesCount() {
  const client = getSupabaseClient();
  if (!client) {
    return { count: 0, error: new Error('Supabase is not configured.') };
  }

  const { count, error } = await client
    .from('forgotten_ranking')
    .select('*', { count: 'exact', head: true })
    .eq('is_dismissed', false);

  return { count: count ?? 0, error };
}

export async function getEvolutionChainsCount() {
  const client = getSupabaseClient();
  if (!client) {
    return { count: 0, error: new Error('Supabase is not configured.') };
  }

  const { count, error } = await client
    .from('memory_evolution_chains')
    .select('*', { count: 'exact', head: true });

  return { count: count ?? 0, error };
}

export async function getRecentGraphEdges(limit = 5) {
  const client = getSupabaseClient();
  if (!client) {
    return {
      data: [] as Array<{ id: string; relationship_type: string; confidence: number }>,
      error: new Error('Supabase is not configured.'),
    };
  }

  const { data, error } = await client
    .from('graph_edges')
    .select('id,relationship_type,confidence')
    .eq('is_dismissed', false)
    .order('updated_at', { ascending: false })
    .limit(limit);

  return { data: (data ?? []) as Array<{ id: string; relationship_type: string; confidence: number }>, error };
}

export async function getPriorityOpenLoops(limit = 5) {
  const client = getSupabaseClient();
  if (!client) {
    return {
      data: [] as Array<{ id: string; description: string | null; loop_type: string }>,
      error: new Error('Supabase is not configured.'),
    };
  }

  const { data, error } = await client
    .from('open_loops')
    .select('id,description,loop_type')
    .eq('status', 'open')
    .order('created_at', { ascending: false })
    .limit(limit);

  return { data: (data ?? []) as Array<{ id: string; description: string | null; loop_type: string }>, error };
}

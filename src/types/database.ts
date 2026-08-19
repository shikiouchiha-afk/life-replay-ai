import { Database } from '@/types/supabase.generated';

// Type aliases for common database types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type UserSettings = Database['public']['Tables']['user_settings']['Row'];
export type Subscription = Database['public']['Tables']['subscriptions']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type Topic = Database['public']['Tables']['topics']['Row'];
export type Entity = Database['public']['Tables']['entities']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];
export type Goal = Database['public']['Tables']['goals']['Row'];
export type Decision = Database['public']['Tables']['decisions']['Row'];
export type Memory = Database['public']['Tables']['memories']['Row'];
export type MemoryTopic = Database['public']['Tables']['memory_topics']['Row'];
export type MemoryEntity = Database['public']['Tables']['memory_entities']['Row'];
export type MemoryProject = Database['public']['Tables']['memory_projects']['Row'];
export type MemoryGoal = Database['public']['Tables']['memory_goals']['Row'];
export type MemoryConnection = Database['public']['Tables']['memory_connections']['Row'];
export type File = Database['public']['Tables']['files']['Row'];
export type AIConversation = Database['public']['Tables']['ai_conversations']['Row'];
export type AIMessage = Database['public']['Tables']['ai_messages']['Row'];
export type SavedSearch = Database['public']['Tables']['saved_searches']['Row'];
export type DailyReplay = Database['public']['Tables']['daily_replays']['Row'];
export type WeeklyReplay = Database['public']['Tables']['weekly_replays']['Row'];
export type MonthlyReplay = Database['public']['Tables']['monthly_replays']['Row'];
export type Integration = Database['public']['Tables']['integrations']['Row'];
export type Import = Database['public']['Tables']['imports']['Row'];
export type ProcessingJob = Database['public']['Tables']['processing_jobs']['Row'];
export type ActivityLog = Database['public']['Tables']['activity_log']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];
export type UsageTracking = Database['public']['Tables']['usage_tracking']['Row'];

// Insert types
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type UserSettingsInsert = Database['public']['Tables']['user_settings']['Insert'];
export type SubscriptionInsert = Database['public']['Tables']['subscriptions']['Insert'];
export type MemoryInsert = Database['public']['Tables']['memories']['Insert'];
export type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
export type GoalInsert = Database['public']['Tables']['goals']['Insert'];
export type CategoryInsert = Database['public']['Tables']['categories']['Insert'];

// Update types
export type MemoryUpdate = Database['public']['Tables']['memories']['Update'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
export type ProjectUpdate = Database['public']['Tables']['projects']['Update'];
export type GoalUpdate = Database['public']['Tables']['goals']['Update'];
export type SubscriptionUpdate = Database['public']['Tables']['subscriptions']['Update'];

// Enums
export enum MemoryType {
  NOTE = 'note',
  IDEA = 'idea',
  GOAL = 'goal',
  DECISION = 'decision',
  PROJECT_UPDATE = 'project_update',
  JOURNAL = 'journal',
  LINK = 'link',
  IMAGE = 'image',
  PDF = 'pdf',
  VOICE = 'voice',
}

export enum MemoryImportance {
  NORMAL = 'normal',
  IMPORTANT = 'important',
  CRITICAL = 'critical',
}

export enum ProjectStatus {
  IDEA = 'idea',
  PLANNING = 'planning',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
}

export enum GoalStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
}

export enum DecisionStatus {
  PENDING = 'pending',
  GOOD = 'good',
  MIXED = 'mixed',
  BAD = 'bad',
  UNKNOWN = 'unknown',
}

export enum SubscriptionPlan {
  FREE = 'free',
  PRO = 'pro',
  ULTRA = 'ultra',
}

export enum ProcessingJobType {
  EMBEDDING = 'embedding',
  CATEGORIZATION = 'categorization',
  ENTITY_EXTRACTION = 'entity_extraction',
  CONNECTION_DISCOVERY = 'connection_discovery',
  DAILY_REPLAY = 'daily_replay',
  WEEKLY_REPLAY = 'weekly_replay',
  MONTHLY_REPLAY = 'monthly_replay',
  FILE_PARSING = 'file_parsing',
  IMPORT = 'import',
}

export enum ProcessingJobStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum ConnectionType {
  SIMILAR_IDEA = 'similar_idea',
  REPEATING_GOAL = 'repeating_goal',
  RECURRING_PROBLEM = 'recurring_problem',
  PERSON_CONNECTION = 'person_connection',
  PROJECT_EVOLUTION = 'project_evolution',
  OPPOSITE_VIEWPOINT = 'opposite_viewpoint',
  DECISION_OUTCOME = 'decision_outcome',
  UNFINISHED_THOUGHT = 'unfinished_thought',
  PATTERN_RECURRENCE = 'pattern_recurrence',
}

export enum EntityType {
  PERSON = 'person',
  COMPANY = 'company',
  LOCATION = 'location',
}

// Response types
export interface MemoryWithRelations extends Memory {
  category?: Category | null;
  topics?: Topic[];
  entities?: Entity[];
  projects?: Project[];
  goals?: Goal[];
  connections?: MemoryConnection[];
  files?: File[];
}

export interface ProjectWithMemories extends Project {
  category?: Category | null;
  memories?: Memory[];
  goals?: Goal[];
}

export interface SearchResult {
  memory: Memory;
  relevance: number;
  excerpt?: string;
}

export interface ProcessingResult {
  title: string;
  summary: string;
  category: string;
  topics: string[];
  entities: Array<{
    type: EntityType;
    name: string;
    confidence: number;
  }>;
  importance: MemoryImportance;
  memory_type: MemoryType;
}

export interface AIResponseWithCitations {
  content: string;
  sources: Array<{
    id: string;
    title: string;
    date: string;
  }>;
}

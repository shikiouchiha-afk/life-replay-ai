// Core user and authentication types
export type User = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserProfile = {
  id: string;
  userId: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  theme: 'dark' | 'light' | 'system';
  timezone?: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
};

// Memory types
export type MemoryType = 'idea' | 'project' | 'goal' | 'decision' | 'note' | 'journal' | 'learning';

export type MemoryImportance = 'normal' | 'important' | 'critical';

export type MemorySource = 'manual' | 'import' | 'integration' | 'voice' | 'capture';

export type Memory = {
  id: string;
  userId: string;
  title: string;
  rawContent: string;
  cleanContent: string;
  summary?: string;
  memoryType: MemoryType;
  importance: MemoryImportance;
  source: MemorySource;
  sourceUrl?: string;
  eventDate: Date;
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;
  isFavorite: boolean;
  isPrivate: boolean;
  embedding?: number[];
  metadata: Record<string, unknown>;
};

// Memory processing
export type ProcessedMemory = {
  title: string;
  summary: string;
  category: string;
  topics: string[];
  entities: string[];
  projects: string[];
  goals: string[];
  dates: Date[];
  emotions?: string[];
  actionItems: string[];
  decisions: string[];
  importance: MemoryImportance;
  memoryType: MemoryType;
  confidence: Record<string, number>;
};

// Connection types
export type ConnectionType = 
  | 'similar_idea'
  | 'repeating_goal'
  | 'recurring_problem'
  | 'person_connection'
  | 'project_evolution'
  | 'opposite_viewpoint'
  | 'decision_outcome'
  | 'unfinished_thought'
  | 'pattern_recurrence';

export type MemoryConnection = {
  id: string;
  userId: string;
  memoryAId: string;
  memoryBId: string;
  type: ConnectionType;
  reason: string;
  confidence: number;
  daysBetween: number;
  userFeedback?: 'useful' | 'not_related' | 'merge' | null;
  createdAt: Date;
  updatedAt: Date;
};

// Project types
export type ProjectStatus = 'idea' | 'planning' | 'active' | 'paused' | 'completed' | 'abandoned';

export type Project = {
  id: string;
  userId: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  startDate: Date;
  targetDate?: Date;
  category?: string;
  progress?: number;
  relatedMemories: string[];
  goals: string[];
  decisions: string[];
  createdAt: Date;
  updatedAt: Date;
};

// Goal types
export type Goal = {
  id: string;
  userId: string;
  title: string;
  description?: string;
  targetDate?: Date;
  status: 'active' | 'completed' | 'paused' | 'abandoned';
  progress: number;
  category?: string;
  relatedMemories: string[];
  milestones: string[];
  createdAt: Date;
  updatedAt: Date;
};

// Decision types
export type DecisionOutcome = 'good' | 'mixed' | 'bad' | 'unknown';

export type Decision = {
  id: string;
  userId: string;
  title: string;
  description: string;
  options: string[];
  chosenOption: string;
  reasoning: string;
  expectedOutcome?: string;
  status: 'pending' | 'completed' | 'unknown';
  outcome?: DecisionOutcome;
  reviewDate?: Date;
  relatedMemories: string[];
  createdAt: Date;
  updatedAt: Date;
};

// Replay types
export type DailyReplay = {
  id: string;
  userId: string;
  date: Date;
  memoriesCaptured: number;
  themes: string[];
  keyMoments: string[];
  openLoops: string[];
  aiSummary: string;
  createdAt: Date;
};

export type WeeklyReplay = {
  id: string;
  userId: string;
  weekStart: Date;
  weekEnd: Date;
  mainFocus: string;
  biggestProgress: string;
  importantMemories: string[];
  projectsForwarded: string[];
  goalsUpdated: string[];
  decisionsRecorded: string[];
  newConnections: number;
  openLoops: string[];
  aiSummary: string;
  createdAt: Date;
};

export type MonthlyReplay = {
  id: string;
  userId: string;
  month: Date;
  memoriesCount: number;
  projectsStarted: number;
  goalsProgressed: number;
  decisionsRecorded: number;
  connectionsFound: number;
  topicsCovered: string[];
  aiSummary: string;
  highlights: string[];
  exportUrl?: string;
  createdAt: Date;
};

// Subscription types
export type SubscriptionPlan = 'free' | 'pro' | 'ultra';

export type Subscription = {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  status: 'active' | 'canceled' | 'expired' | 'past_due';
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  canceledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type Usage = {
  id: string;
  userId: string;
  period: Date;
  memoriesCreated: number;
  aiSearches: number;
  aiQueries: number;
  filesStored: number;
  storageBytes: number;
  connectionsGenerated: number;
  createdAt: Date;
};

// AI types
export type AIConversation = {
  id: string;
  userId: string;
  title: string;
  messages: AIMessage[];
  createdAt: Date;
  updatedAt: Date;
};

export type AIMessage = {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  citedMemories?: string[];
  createdAt: Date;
};

// Search types
export type SearchQuery = {
  q: string;
  type?: MemoryType;
  dateRange?: {
    start: Date;
    end: Date;
  };
  importance?: MemoryImportance;
  project?: string;
  topic?: string;
  person?: string;
};

export type SearchResult = {
  memory: Memory;
  relevance: number;
  highlights?: string[];
  reasoning?: string;
};

// File types
export type FileUpload = {
  id: string;
  userId: string;
  memoryId?: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  storageUrl: string;
  createdAt: Date;
};

// Settings types
export type NotificationPreferences = {
  emailNotifications: boolean;
  inAppNotifications: boolean;
  weeklyReplay: boolean;
  monthlyReplay: boolean;
  connectionAlerts: boolean;
};

export type PrivacySettings = {
  allowAnalytics: boolean;
  allowDataExport: boolean;
  autoDeleteAfterDays?: number;
  encryptStorage: boolean;
};

// API Response types
export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T> = ApiResponse<{
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}>;

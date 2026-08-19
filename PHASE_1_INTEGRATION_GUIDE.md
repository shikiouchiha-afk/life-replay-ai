# PHASE 1: Personal Memory Graph Foundation — Integration Guide

## Overview

Phase 1 establishes the core infrastructure for transforming Life Replay from a timeline app into a **Personal Intelligence Layer**. This foundation enables:

- **Graph-based connections** between all entities (memories, projects, goals, decisions, people, places, companies)
- **Historical versioning** to track how projects, goals, and decisions evolve over time
- **Memory evolution chains** to follow how ideas, relationships, and projects develop
- **Forgotten knowledge system** to surface memories you haven't reviewed recently
- **Open loops detection** to identify unresolved tasks and decisions
- **Context-aware retrieval** through a hybrid search system combining keyword, semantic, graph-based, and temporal matching

## What's Included

### 1. Database Migration
**File:** `supabase/migrations/20260818_personal_memory_graph_phase1.sql`

Creates 20+ new tables with full RLS security:

#### Graph System
- `graph_nodes` - Unified nodes for memories, projects, goals, decisions, entities
- `graph_edges` - Relationships between nodes (related_to, mentions, supports, contradicts, resulted_in, etc.)

#### Historical Tracking
- `entity_versions` - Complete snapshots of entity changes over time
- `project_events` - Chronological log of project changes
- `goal_events` - Chronological log of goal changes
- `project_tasks` - Subtasks within projects with status tracking
- `goal_milestones` - Milestones within goals

#### Decision Intelligence
- `decision_reviews` - Formal outcome reviews for decisions
- Enhanced `decisions` table with: expected_outcome, actual_outcome, lesson, review_date, confidence_level

#### Memory Evolution
- `memory_evolution_chains` - Track evolution of ideas/people/companies
- `evolution_events` - Individual events in an evolution chain

#### Intelligent Retrieval
- `forgotten_ranking` - Surfaces memories based on recency, importance, relevance
- `open_loops` - Tracks unresolved tasks, decisions, and commitments

#### Context & Personalization
- `personal_context` - User's explicit preferences, current projects, working style
- `context_inferences` - AI-inferred context about user behavior and preferences

#### Infrastructure
- `integrations` - Manages external API connections
- `permission_grants` - Fine-grained access control
- `vault_access_logs` - Audit trail for sensitive data
- `background_jobs` - Async job queue for processing
- `memory_inbox` - Staging area for imported memories

### 2. Repository Layer
**File:** `src/lib/repositories/graph.ts`

TypeScript-safe functions for querying the graph:

```typescript
// Node operations
getGraphNodes(limit)
getGraphNodesByType(nodeType, limit)
getGraphEdgesForNode(nodeId, limit)

// Evolution tracking
getEvolutionChains(limit)
getEvolutionEvents(chainId)

// Forgotten knowledge
getForgottenMemories(limit)
dismissForgottenMemory(memoryId)

// Open loops
getOpenLoops(limit)
updateOpenLoopStatus(loopId, status)

// Decision outcomes
getDecisionReviews(limit)

// Personal context
getPersonalContext()
getContextInferences()
```

### 3. Server Actions (CRUD)
**File:** `src/actions/graph-crud.ts`

Server-side mutations with full authentication:

```typescript
// Graph operations
createGraphNodeAction()
updateGraphNodeAction()
deleteGraphNodeAction()
createGraphEdgeAction()
updateGraphEdgeAction()
approveGraphEdgeAction()
dismissGraphEdgeAction()

// Versioning
recordEntityVersion()

// Evolution
createEvolutionChainAction()
addEvolutionEventAction()

// Decision reviews
createDecisionReviewAction()

// Project & goal history
logProjectEventAction()
logGoalEventAction()

// Open loops
createOpenLoopAction()
closeOpenLoopAction()

// Forgotten ranking
updateForgottenRankingAction()
```

### 4. Hybrid Retrieval Pipeline
**File:** `src/lib/retrieval/hybrid-search.ts`

Powers "Ask My Entire Life" with multi-method search:

```typescript
// Four retrieval methods (run in parallel):
- keywordSearch()      // BM25-style text matching
- semanticSearch()     // Vector similarity (when embedding available)
- graphBasedRetrieval() // Connected entities through graph edges
- temporalRelevance()  // Recent memories weighted by recency

// Orchestration
hybridSearch(query, options)  // Returns combined + deduped results

// High-level Q&A
askMyEntireLife(question)     // Returns answer + sources + confidence
```

### 5. Enhanced Dashboard
**File:** `src/lib/repositories/life-data.ts`

Updated DashboardStats now includes:

```typescript
totalGraphNodes?       // Number of connected entities
totalOpenLoops?        // Unresolved tasks and decisions
totalForgottenMemories? // Memories needing review
totalEvolutionChains?   // Tracked evolution lines
recentGraphEdges?       // Recently discovered connections
priorityOpenLoops?      // High-priority unresolved items
```

## Deployment Steps

### Step 1: Deploy Migration to Supabase

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Copy the entire contents of `supabase/migrations/20260818_personal_memory_graph_phase1.sql`
4. Paste into a new SQL query
5. Click **Run**
6. Verify: All tables and policies should be created (green checkmarks)

**Verification:**
```sql
-- Verify tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('graph_nodes', 'graph_edges', 'entity_versions', 'open_loops', 'forgotten_ranking');
```

### Step 2: Update Application

All code changes are already in place:

- ✅ New migration file created
- ✅ Repository layer implemented
- ✅ Server actions implemented
- ✅ Hybrid retrieval system ready
- ✅ Dashboard stats updated
- ✅ TypeScript types all defined
- ✅ Build verified (no errors)

### Step 3: Test RLS Security

Verify only users can access their own data:

```typescript
// From src/actions/auth.ts - test in browser console:
const supabase = getSupabaseClient();

// Sign in as User A
await supabase.auth.signInWithPassword({email: 'user-a@example.com', password: '...'});
const userANodes = await supabase.from('graph_nodes').select('*');

// Switch to User B session
// Try to access User A's nodes - should return empty
const userBAttempt = await supabase.from('graph_nodes')
  .select('*')
  .eq('user_id', 'USER_A_ID');
  // Result: empty array (RLS prevents access)
```

## Usage Examples

### Create a Graph Connection

```typescript
// User discovers that "Project X" (project) is related to "Company Y" (entity)
import { createGraphNodeAction, createGraphEdgeAction } from '@/actions/graph-crud';

// 1. Create nodes if they don't exist
const projectNode = await createGraphNodeAction(
  'project',
  projectId,
  'projects',
  'Project X',
  'Important client project'
);

const entityNode = await createGraphNodeAction(
  'entity',
  companyId,
  'entities',
  'Company Y',
  'Strategic partner'
);

// 2. Create relationship
await createGraphEdgeAction(
  projectNode.data.id,
  entityNode.data.id,
  'belongs_to',
  0.95,
  'Project is being delivered to this company'
);
```

### Track Decision Outcomes

```typescript
import { createDecisionReviewAction } from '@/actions/graph-crud';

// Review a decision made 3 months ago
await createDecisionReviewAction(
  decisionId,
  'Launch product in Q4',  // expected_outcome
  'Launched successfully, exceeded sales targets',  // actual_outcome
  'Invest in early customer feedback loops for future launches'  // lesson
);
```

### Discover Forgotten Memories

```typescript
import { getForgottenMemories, dismissForgottenMemory } from '@/lib/repositories/graph';

// In dashboard component
const { data: forgotten } = await getForgottenMemories(10);

// Display them and let user dismiss or resurface
forgotten.forEach(mem => {
  if (userDismisses) {
    await dismissForgottenMemory(mem.memory_id);
  }
});
```

### Use Hybrid Search

```typescript
import { askMyEntireLife, hybridSearch } from '@/lib/retrieval/hybrid-search';

// Simple retrieval with all methods
const results = await hybridSearch('Tell me about my Q3 projects');
// Returns: keyword matches + temporal matches + graph connections

// High-level Q&A
const answer = await askMyEntireLife('What have I learned from my failed projects?');
// Returns: {answer, supporting_evidence[], sources_cited[], confidence}
```

## Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│           User-Facing Features (Phase 2+)           │
│  Ask My Entire Life | Time Machine | Life Map etc.  │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────┴──────────────────────────────────┐
│       Hybrid Retrieval Pipeline (Phase 1)           │
│  ┌──────────┬──────────┬──────────┬──────────────┐  │
│  │ Keyword  │Semantic  │  Graph   │  Temporal    │  │
│  │ Search   │ Search   │ Based    │  Relevance   │  │
│  └────┬─────┴────┬─────┴────┬─────┴──────┬───────┘  │
│       │ Results combine + deduplicate + rank       │
└───────┼──────────────────────────────────┼──────────┘
        │                                  │
┌───────┴──────────────────────────────────┴──────────┐
│       Repository Layer (TypeScript Types)           │
│  graph.ts | life-data.ts | graph-crud.ts            │
│  ↓                                                   │
│  ✅ Full RLS enforcement via Supabase client         │
└───────┬──────────────────────────────────┬──────────┘
        │                                  │
┌───────┴──────────────────────────────────┴──────────┐
│         Supabase Database (PostgreSQL)               │
│  ┌─────────────┬──────────────┬──────────────────┐   │
│  │   Graph     │   Historical │   Intelligent    │   │
│  │ System      │   Versioning │   Retrieval      │   │
│  │             │              │   Infrastructure │   │
│  │ ∘ Nodes     │ ∘ Versions   │ ∘ Forgotten      │   │
│  │ ∘ Edges     │ ∘ Proj Events│ ∘ Open Loops     │   │
│  │ ∘ Entities  │ ∘ Goal Events│ ∘ Context        │   │
│  └─────────────┴──────────────┴──────────────────┘   │
│  Row Level Security: Each user sees only their data  │
└─────────────────────────────────────────────────────┘
```

## Performance Considerations

### Indexes
All critical paths have indexes:
- `graph_nodes(user_id, node_type)`
- `graph_edges(user_id, source_node_id, target_node_id)`
- `forgotten_ranking(user_id, composite_score DESC)`
- `open_loops(user_id, loop_type, status)`

### Query Optimization
1. **Parallel fetching**: Dashboard stats runs 13 queries in parallel
2. **Selective columns**: Only fetch needed fields
3. **Proper pagination**: All retrieval functions accept `limit` parameter
4. **RLS at database level**: Security checks happen at query execution, not application

### Scaling
Ready for:
- ✅ Millions of memories per user (indexed by user_id)
- ✅ Complex graph traversal (efficient tree queries)
- ✅ Real-time subscriptions (via Supabase channels)
- ✅ Semantic search (pgvector extension available)

## Security

### Row Level Security (RLS)
Every table has policies enforcing:
```sql
user_id = auth.uid()
```

Prevents:
- ❌ User A seeing User B's memories
- ❌ User A seeing User B's graph connections
- ❌ Cross-user data leakage

### Sensitive Data
- `vault_access_logs` tracks when vault is accessed
- `permission_grants` enables future share capabilities
- Encrypted credentials for integrations ready (use Supabase's built-in encryption)

### Server-Side Validation
All CRUD actions:
1. Check authentication
2. Verify user_id ownership
3. Validate input types
4. Return errors gracefully

## Testing Checklist

- [ ] Migration deployed successfully
- [ ] All 20+ tables created in Supabase
- [ ] RLS policies enabled on all tables
- [ ] Graph nodes can be created
- [ ] Graph edges properly validate (no self-edges)
- [ ] Entity versioning creates version chains
- [ ] Forgotten memories retrieve correctly
- [ ] Open loops track status
- [ ] Hybrid search returns combined results
- [ ] Dashboard stats include graph metrics
- [ ] Build passes TypeScript checks
- [ ] Production build succeeds

## Next Phase Preview

**PHASE 2: Intelligence Layer**
- Semantic embedding generation for all memories
- AI-powered connection suggestions
- Advanced "Ask My Entire Life" with LLM integration
- Source citation system
- Conversation context persistence

**PHASE 3: Life Systems**
- Decision outcome prediction
- Goal milestone generation
- Project health monitoring
- Open loop automation detection

**PHASE 4: Experience**
- Life Map visualization
- Time Machine (replay your year)
- Intelligence reports (monthly insights)
- Playback mode for life review

**PHASE 5: Ecosystem**
- Memory Inbox (email/Slack/etc import)
- Integration framework (Slack, Gmail, Calendar, etc.)
- Share & collaborate (with permission system)
- Public API foundation

## Support

**Files to Reference:**
- Schema: `schema.sql`
- Migration: `supabase/migrations/20260818_personal_memory_graph_phase1.sql`
- Repository: `src/lib/repositories/graph.ts`
- Server Actions: `src/actions/graph-crud.ts`
- Retrieval: `src/lib/retrieval/hybrid-search.ts`
- Dashboard: `src/lib/repositories/life-data.ts`

**Database Tools:**
- Supabase Dashboard: https://app.supabase.com
- SQL Editor for direct queries
- Authentication tab to verify users
- Real-time settings for subscriptions

---

**Status:** ✅ Phase 1 Foundation Complete | Awaiting Supabase Migration Deployment

Built with: Next.js 16.3.1 | TypeScript Strict Mode | Supabase | Postgres | Tailwind v4

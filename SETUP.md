# Life Replay AI - Setup Guide

## Quick Start

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn
- A Supabase account (free tier works)
- OpenAI API key (for AI features)
- Stripe account (for billing)

### 1. Clone & Install

```bash
cd c:\Users\zaki\Desktop\life-replay-ai
npm install
```

### 2. Setup Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings → API
3. Copy your Project URL and Anon Key
4. Create a `.env.local` file (copy from `.env.example`)
5. Paste your Supabase credentials

### 3. Initialize Database Schema

```bash
# Option A: Using Supabase Dashboard
1. Go to SQL Editor in your Supabase project
2. Create a new query
3. Copy & paste the contents of `schema.sql`
4. Click "Run"

# Option B: Using Supabase CLI
npm install -g supabase
supabase link --project-id your_project_id
supabase db push
```

### 4. Setup Environment Variables

Create `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://hcpznqtgtrrlazaqckka.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your-key-here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI (for AI features)
AI_API_KEY=your_openai_key
AI_MODEL=gpt-4-turbo
EMBEDDING_MODEL=text-embedding-3-small

# Stripe (for billing)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Auth
JWT_SECRET=your_secure_random_string_here

# URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Architecture Overview

### Directory Structure

```
/app                          # Next.js App Router
  /(auth)                      # Auth pages
  /(marketing)                 # Public pages
  /(dashboard)                 # Protected dashboard
  /api                         # API routes & webhooks
  
/components
  /ui                          # Reusable UI components
  /layout                      # Layout components
  /memory                      # Memory-specific components
  /replay                      # Replay feature components
  /search                      # Search components
  
/lib
  /db                          # Database utilities
  /ai                          # AI provider abstraction
  /auth                        # Auth utilities
  /billing                     # Stripe utilities
  /embeddings                  # Embedding utilities
  
/hooks                         # React hooks
/types                         # TypeScript definitions
/actions                       # Server actions
/services                      # Business logic services
```

### Core Concepts

#### Memory
The core unit of Life Replay AI. Users capture and organize memories through:
- Text input
- Files (images, PDFs, documents)
- URLs/web snippets
- Voice notes (future)

#### Processing Pipeline
Every memory goes through:
1. Content validation
2. AI summarization
3. Category detection
4. Entity extraction
5. Embedding generation
6. Connection discovery

#### Search
Combines:
- Semantic search (using embeddings)
- Keyword search
- Metadata filters (date, category, importance)
- Hybrid ranking

#### Authentication
Built on Supabase Auth with:
- Email/password
- Magic links
- Google OAuth (ready)
- Apple OAuth (ready)
- Row-level security for data isolation

#### Billing
Stripe integration with:
- Free, Pro, and Ultra plans
- Subscription management
- Usage tracking
- Upgrade flows

## Development Workflow

### Making Database Changes

Use migrations for all changes:

```bash
# Create a new migration
supabase migration new add_new_table

# Edit the migration file in supabase/migrations/
# Then push to database
supabase db push
```

### Testing Features

#### Test Memory Creation
```bash
curl -X POST http://localhost:3000/api/memories \
  -H "Content-Type: application/json" \
  -d '{"title": "Test", "raw_content": "Test content"}'
```

#### Test Authentication
Navigate to http://localhost:3000/auth/signup

#### Test Search
Navigate to http://localhost:3000/search

## Important Security Notes

### Row-Level Security (RLS)
All tables have RLS enabled. Users can only see their own data.

**Never**:
- Expose `SUPABASE_SERVICE_ROLE_KEY` to the frontend
- Trust `userId` from the client
- Skip authorization checks on server actions

### Billing Verification
Always verify subscription status server-side:

```typescript
// ✓ Correct
const subscription = await getSubscription(userId);
if (subscription.plan !== 'pro') return unauthorized();

// ✗ Wrong
const plan = req.headers['x-user-plan']; // Client sends this!
```

## Common Tasks

### Reset Database
```bash
# WARNING: This deletes all data!
supabase db reset
```

### View Database
```bash
supabase start  # Starts local database
open http://localhost:5432  # View in UI
```

### Test Stripe Locally
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# Use test cards from: https://stripe.com/docs/testing
```

## Troubleshooting

### "Missing Supabase URL"
- Check .env.local file exists
- Verify NEXT_PUBLIC_SUPABASE_URL is set
- Restart dev server after changing .env

### RLS Errors
- Ensure you're authenticated (have valid session)
- Check that the user_id matches the authenticated user
- Verify RLS policies are created (see schema.sql)

### Build Fails
```bash
npm run build  # Full build
npm run lint   # Check linting
npm run type-check  # TypeScript only
```

## Next Steps

1. ✅ Project setup complete
2. 🔄 Implement authentication (in progress)
3. 🔄 Build onboarding flow
4. 🔄 Create memory capture UI
5. 🔄 Implement semantic search
6. 🔄 Build AI conversation feature
7. 🔄 Setup billing

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [TypeScript](https://www.typescriptlang.org)

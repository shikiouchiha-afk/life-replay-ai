# Life Replay AI

**Your life has a search bar.**

Life Replay AI is a premium SaaS platform that transforms your digital memories into searchable intelligence. Save important moments, automatically organize them with AI, and rediscover connections in your personal history.

## ✨ Project Status

### Phase 1: Foundation (✅ Complete)
- [x] Project initialization with Next.js 16 & TypeScript
- [x] Luxury dark design system & Tailwind configuration
- [x] Comprehensive database schema (30+ tables)
- [x] Row-level security and data isolation
- [x] Authentication system (signup/login/password reset)
- [x] Dashboard layout and navigation
- [x] Premium UI component library

### Phase 2: Core Features (🔄 In Progress)
- [ ] Memory capture and processing pipeline
- [ ] AI summarization and categorization
- [ ] Semantic search with embeddings
- [ ] Replay mode (timeline visualization)
- [ ] Ask Life Replay AI (RAG-powered Q&A)

### Phase 3: Advanced Features (📋 Planned)
- [ ] Stripe billing integration
- [ ] Onboarding flow
- [ ] Memory connections engine
- [ ] Projects, goals, and decisions tracking
- [ ] Life Map visualization
- [ ] Weekly/monthly replays
- [ ] Import system (Notion, Gmail, etc.)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free tier)
- OpenAI API key (for AI features)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env.local

# 3. Add your Supabase credentials to .env.local
# NEXT_PUBLIC_SUPABASE_URL=https://hcpznqtgtrrlazaqckka.supabase.co
# NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
# SUPABASE_SERVICE_ROLE_KEY=...

# 4. Setup database (run schema.sql in Supabase SQL Editor)

# 5. Start development server
npm run dev

# 6. Open http://localhost:3000
```

For detailed setup instructions, see [SETUP.md](./SETUP.md)

## 📁 Project Structure

```
life-replay-ai/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (auth)/         # Auth pages (signup, login)
│   │   ├── (marketing)/    # Public pages
│   │   └── (dashboard)/    # Protected dashboard
│   ├── components/
│   │   ├── ui/             # Reusable UI components
│   │   ├── layout/         # Layout components
│   │   └── memory/         # Memory-specific components
│   ├── lib/
│   │   ├── db/             # Database utilities
│   │   ├── ai/             # AI abstractions
│   │   └── auth/           # Auth utilities
│   ├── actions/            # Server actions
│   ├── types/              # TypeScript definitions
│   └── hooks/              # React hooks
├── schema.sql              # Database schema
├── .env.example            # Environment template
└── SETUP.md                # Detailed setup guide
```

## 🎨 Design System

### Visual Direction
- **Colors**: Obsidian black, midnight graphite, icy accents
- **Spacing**: Consistent, premium spacing (uses CSS variables)
- **Typography**: Clean, readable sans-serif
- **Radius**: 16-24px for premium feel
- **Animations**: Smooth, subtle (150-350ms)

### Component Library
- `Button` - Primary, outline, ghost variants
- `Card` - Premium elevated cards with depth
- `Input` - Form inputs with error states
- `Label` - Form labels
- `Badge` - Status and category indicators
- `Loading` - Loading states

## 🔐 Authentication

The system includes full authentication with:
- Email/password signup and login
- Password reset via email
- Session management
- OAuth-ready architecture (Google, Apple)
- Row-level security (RLS) for data isolation
- Server-side authorization checks

**Current Pages:**
- `/auth/signup` - Create account
- `/auth/login` - Sign in
- `/dashboard` - Main dashboard (protected)

## 💾 Database

### Key Features
- 30+ tables with relational design
- Row-level security policies
- pgvector support for semantic search
- Comprehensive indexes for performance
- Automatic audit logs

### Core Tables
- `profiles` - User profiles
- `memories` - Core memory storage with embeddings
- `categories` - Memory organization
- `topics`, `entities` - Auto-extracted information
- `projects`, `goals`, `decisions` - Life tracking
- `memory_connections` - Discovered relationships
- `subscriptions` - Billing information
- `processing_jobs` - Background job queue

## 🤖 AI Integration

The system uses an abstraction layer for AI operations:
- Memory summarization
- Category and topic extraction
- Entity recognition
- Connection discovery
- Question answering with citations
- Replay generation

**Supports** OpenAI and can be extended for other providers.

## 🧪 Testing Build

```bash
# Build for production
npm run build

# Run TypeScript check
npm run type-check

# Run linting
npm run lint

# Start production server
npm run start
```

## 📝 Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://hcpznqtgtrrlazaqckka.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI
AI_API_KEY=your-openai-key
AI_MODEL=gpt-4-turbo
EMBEDDING_MODEL=text-embedding-3-small

# Stripe (future)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Auth
JWT_SECRET=your-secure-random-key

# URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 🛠️ Key Technologies

- **Frontend**: Next.js 16, React 19, TypeScript
- **Database**: Supabase, PostgreSQL, pgvector
- **Styling**: Tailwind CSS with custom design tokens
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: Custom validation with Zod
- **AI**: OpenAI API (abstracted)
- **Storage**: Supabase Storage
- **Deployment**: Vercel-ready

## 📚 API Reference

### Memory Actions
```typescript
createMemory(data) → { success, data }
updateMemory(id, data) → { success, data }
getMemoryWithRelations(id) → MemoryWithRelations | null
getUserMemories(userId, page, limit) → { success, data, pagination }
searchMemories(userId, query, filters) → { success, data, count }
deleteMemory(id) → { success }
```

### Auth Actions
```typescript
signUpWithEmail(email, password, fullName) → { success, user, session }
signInWithEmail(email, password) → { success, user, session }
signOut() → { success }
sendPasswordResetEmail(email) → { success }
updateProfile(userId, data) → { success, data }
```

## 🔒 Security

### Key Principles
1. **RLS Enforcement**: All tables protected with row-level security
2. **Server-Side Auth**: Never trust client-side auth state
3. **Signed URLs**: File uploads use signed URLs
4. **Webhook Verification**: Stripe webhooks are verified
5. **Rate Limiting**: API endpoints are rate-limited
6. **Input Validation**: All inputs validated with Zod

### Best Practices
- Never expose `SUPABASE_SERVICE_ROLE_KEY`
- Always verify subscription server-side
- Validate file uploads (type, size, content)
- Use CSRF tokens for state-changing operations
- Log sensitive operations to audit log

## 📈 Metrics & Analytics

The system tracks:
- User actions (memory creation, searches, etc.)
- Usage metrics (AI requests, embeddings, storage)
- Error rates for processing jobs
- Subscription metrics (MRR, churn, etc.)

All data is logged without storing private memory content.

## 🚧 Known Limitations

**Phase 1 Limitations:**
- Semantic search not yet implemented (keyword matching only)
- AI processing pipeline queued but not executing
- No file uploads/image handling yet
- OAuth providers not connected
- Billing system not active
- Mobile UI not optimized

**Coming Soon:**
- Full AI processing pipeline
- Semantic embeddings and search
- Replay mode visualization
- Memory connections engine
- Billing with Stripe
- Mobile app (iOS/Android)

## 🤝 Contributing

Development workflow:
1. Create feature branches from `main`
2. Write tests for new features
3. Ensure TypeScript passes (`npm run type-check`)
4. Test build locally (`npm run build`)
5. Submit PR with description

## 📄 License

Copyright © 2026 Life Replay AI. All rights reserved.

## 🙋 Support

For setup help, see [SETUP.md](./SETUP.md)

For issues or questions about the architecture, refer to the inline comments in key files:
- `schema.sql` - Database design
- `src/actions/memories.ts` - Memory operations
- `src/app/(dashboard)/dashboard/page.tsx` - Dashboard structure

---

**Built with attention to detail, privacy-first architecture, and premium UX.**

Your memories, intelligently organized. 🚀

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

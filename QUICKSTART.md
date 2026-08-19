# Life Replay AI - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Verify Installation
```bash
cd c:\Users\zaki\Desktop\life-replay-ai
npm --version  # Should be 10.x or higher
node --version # Should be 18.x or higher
```

### Step 2: Start Development Server
```bash
npm run dev
```

You should see:
```
✓ Ready in 733ms
- Local: http://localhost:3000
```

### Step 3: Open in Browser
- Visit http://localhost:3000
- You'll see the landing page
- Click "Sign Up" to create an account

### Step 4: Create Test Account
- Email: `test@example.com`
- Password: `password123`
- Name: `Test User`
- Click "Create Account"

### Step 5: Explore Dashboard
- You'll be logged in automatically
- Click "Sign In" to get to the dashboard
- Explore all navigation pages
- All pages are fully styled and responsive

---

## 📱 Testing Checklist

### Pages to Test
- [ ] Landing page: http://localhost:3000
- [ ] Signup: http://localhost:3000/auth/signup
- [ ] Login: http://localhost:3000/auth/login
- [ ] Dashboard Home: http://localhost:3000/dashboard
- [ ] Memories: http://localhost:3000/dashboard/memories
- [ ] Replay: http://localhost:3000/dashboard/replay
- [ ] Ask Life Replay: http://localhost:3000/dashboard/ask
- [ ] Life Map: http://localhost:3000/dashboard/life-map
- [ ] Projects: http://localhost:3000/dashboard/projects
- [ ] Decisions: http://localhost:3000/dashboard/decisions
- [ ] Goals: http://localhost:3000/dashboard/goals

### Features Ready
- ✅ All navigation links working
- ✅ All pages styled with premium UI
- ✅ Responsive on mobile/tablet/desktop
- ✅ Dark theme applied throughout
- ✅ Authentication structure in place

### Features Not Yet Active
- ❌ Actual memory capture (coming soon)
- ❌ AI processing (coming soon)
- ❌ Database operations (coming soon, requires Supabase setup)
- ❌ Billing (coming Phase 3)

---

## ⚙️ Configuration

### Without Supabase (Current State)
The app currently works without Supabase credentials for the UI. To fully enable backend features, you need to:

### With Supabase (Full Setup)
1. Create account at https://supabase.com
2. Create new project
3. Copy Project URL and Anon Key
4. Update `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://hcpznqtgtrrlazaqckka.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your-key-here
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```
5. Run schema.sql in Supabase SQL Editor
6. Restart dev server: `npm run dev`

---

## 📁 Project Location
```
C:\Users\zaki\Desktop\life-replay-ai\
```

---

## 🛑 Stopping the Server
In the terminal where dev server is running:
```
Press Ctrl+C
```

---

## 🔨 Common Commands

```bash
# Start development
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Check for errors
npm run type-check

# Run linter
npm run lint

# Clean build cache
rm -r .next
npm run build
```

---

## 🐛 Troubleshooting

### "Port 3000 already in use"
```bash
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with the number)
taskkill /PID <PID> /F

# Or use a different port
npm run dev -- -p 3001
```

### Build fails
```bash
# Clear cache and rebuild
npm run build
```

### TypeScript errors
```bash
npm run type-check
```

### Module not found errors
```bash
# Verify imports use correct capitalization:
# ✓ import { Button } from '@/components/ui/Button'
# ✗ import { Button } from '@/components/ui/button'
```

---

## 📊 What's Next

### Phase 2 (Core Features)
1. Memory capture modal
2. AI processing pipeline
3. Semantic search
4. Replay visualizations
5. Q&A system

### Phase 3 (Advanced)
1. Stripe billing
2. Social features
3. Import system
4. Mobile apps
5. Desktop app

---

## 📚 Documentation

- **[README.md](./README.md)** - Full project overview
- **[SETUP.md](./SETUP.md)** - Detailed setup guide
- **[BUILD_SUMMARY.md](./BUILD_SUMMARY.md)** - What was built

---

## 💡 Tips

1. **Hot Reload**: The dev server automatically refreshes when you edit files
2. **TypeScript**: Errors show in the browser and terminal
3. **Mobile Testing**: Use Firefox/Chrome DevTools to test responsive design
4. **Dark Mode**: Built-in, always on
5. **Offline Ready**: Many pages work offline with local state

---

## 🎨 Customizing Design

All design tokens are in:
- `src/app/globals.css` - CSS variables
- `tailwind.config.ts` - Tailwind configuration

Change colors by editing CSS custom properties.

---

## 🤝 Need Help?

1. Check [SETUP.md](./SETUP.md) for detailed guides
2. Review [README.md](./README.md) for architecture
3. Look at existing components in `src/components/ui/`
4. Check server actions in `src/actions/`

---

**Happy building! 🚀**

Your life has a search bar.

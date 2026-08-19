// Configuration for Life Replay AI
// All environment variables are validated at build time

export const config = {
  app: {
    name: 'Life Replay AI',
    tagline: 'Your life has a search bar.',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  },

  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL?.trim(),
    publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim(),
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim(),
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },

  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },

  ai: {
    provider: process.env.AI_PROVIDER || 'openai', // 'openai' | 'anthropic'
    apiKey: process.env.AI_API_KEY,
    model: process.env.AI_MODEL || 'gpt-4-turbo',
    embeddingModel: process.env.EMBEDDING_MODEL || 'text-embedding-3-small',
  },

  auth: {
    jwtSecret: process.env.JWT_SECRET,
    sessionTimeout: 24 * 60 * 60, // 24 hours in seconds
    resetTokenExpiry: 1 * 60 * 60, // 1 hour in seconds
  },

  features: {
    enableVoiceCapture: (process.env.NEXT_PUBLIC_ENABLE_VOICE || 'false') === 'true',
    enableIntegrations: (process.env.NEXT_PUBLIC_ENABLE_INTEGRATIONS || 'false') === 'true',
    enableAdvancedAnalytics: (process.env.NEXT_PUBLIC_ENABLE_ANALYTICS || 'false') === 'true',
  },

  storage: {
    maxUploadSize: 50 * 1024 * 1024, // 50MB
    maxMemoryFiles: 100,
    buckets: {
      memories: 'memory-files',
      images: 'memory-images',
      avatars: 'avatars',
      exports: 'exports',
      imports: 'imports',
    },
  },

  pricing: {
    free: {
      memoriesPerMonth: 20,
      aiSearchesPerMonth: 5,
      storageGB: 1,
      retentionDays: 7,
    },
    pro: {
      memoriesPerMonth: null, // unlimited
      aiSearchesPerMonth: null, // unlimited
      storageGB: 100,
      retentionDays: null, // unlimited
      monthlyPrice: 1499, // cents
      yearlyPrice: 14990, // cents
    },
    ultra: {
      memoriesPerMonth: null, // unlimited
      aiSearchesPerMonth: null, // unlimited
      storageGB: 1000,
      retentionDays: null, // unlimited
      monthlyPrice: 2999, // cents
      yearlyPrice: 29990, // cents
    },
  },
};

// Validate required environment variables
export function validateConfig() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  ];

  const missing = required.filter((env) => !process.env[env] && !(env === 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY' && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY));
  if (missing.length > 0) {
    console.warn(`Missing environment variables: ${missing.join(', ')}`);
  }
}

export default config;

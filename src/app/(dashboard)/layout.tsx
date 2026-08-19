'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/db/supabase';
import { signOut } from '@/actions/auth';
import { Sidebar, SidebarProvider } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/Button';
import { Plus, Settings, Menu, X, LogOut } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    await signOut();
    router.replace('/login');
  };

  useEffect(() => {
    // Check if Supabase is configured
    if (!isSupabaseConfigured) {
      setShowWarning(true);
      setIsAuthenticated(false);
      return;
    }

    // Check authentication status
    const client = getSupabaseClient();
    if (!client) {
      setIsAuthenticated(false);
      return;
    }

    let active = true;

    const checkAuth = async () => {
      const {
        data: { user },
      } = await client.auth.getUser();

      if (active) {
        if (!user) {
          // Redirect to login if not authenticated
          router.replace('/login');
        } else {
          setIsAuthenticated(true);
        }
      }
    };

    checkAuth();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((event, session) => {
      if (active) {
        if (!session) {
          router.replace('/login');
        }
      }
    });

    return () => {
      active = false;
      subscription?.unsubscribe();
    };
  }, [router]);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950">
        <div className="text-slate-400">Checking authentication...</div>
      </div>
    );
  }

  // Show warning if Supabase not configured
  if (showWarning) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950 px-4">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold text-white">Configuration Required</h1>
          <p className="text-slate-400">
            Supabase credentials are not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to your .env.local file to enable authentication and data access.
          </p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }


  return (
    <SidebarProvider>
      <div className="h-screen flex bg-slate-950">
        {/* Sidebar */}
        <Sidebar open={sidebarOpen} onToggle={setSidebarOpen} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Navigation */}
          <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
            <div className="flex items-center justify-between h-16 px-4 lg:px-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 hover:bg-slate-800 rounded-lg lg:hidden"
                >
                  {sidebarOpen ? (
                    <X className="w-5 h-5 text-slate-300" />
                  ) : (
                    <Menu className="w-5 h-5 text-slate-300" />
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Quick Capture
                </Button>
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setShowMenu(!showMenu)}
                  >
                    <Settings className="w-5 h-5" />
                  </Button>
                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg m-1"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 lg:p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

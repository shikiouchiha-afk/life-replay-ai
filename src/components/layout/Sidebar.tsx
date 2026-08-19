
'use client';

import { useState, useContext, createContext, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Heart,
  Zap,
  Brain,
  User,
  ChevronDown,
  Search,
  Plus,
  Settings,
  LogOut,
  Menu,
  X,
  BookOpen,
  Calendar,
  RotateCcw,
  Star,
  Briefcase,
  Target,
  CheckCircle,
  MessageCircle,
  Network,
  Users,
  MapPin,
  Lightbulb,
  BarChart3,
  TrendingUp,
  CreditCard,
  Plug,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface SidebarContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
}

interface NavSection {
  title: string;
  icon: React.ReactNode;
  items: NavItem[];
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Home',
    icon: <Home className="w-4 h-4" />,
    items: [
      {
        label: 'Today',
        href: '/dashboard',
        icon: <Home className="w-4 h-4" />,
      },
      {
        label: 'Search',
        href: '/dashboard/search',
        icon: <Search className="w-4 h-4" />,
      },
    ],
  },
  {
    title: 'Memory',
    icon: <Heart className="w-4 h-4" />,
    items: [
      {
        label: 'Memories',
        href: '/dashboard/memories',
        icon: <Heart className="w-4 h-4" />,
      },
      {
        label: 'Journal',
        href: '/dashboard/journal',
        icon: <BookOpen className="w-4 h-4" />,
      },
      {
        label: 'Calendar',
        href: '/dashboard/calendar',
        icon: <Calendar className="w-4 h-4" />,
      },
      {
        label: 'Replay',
        href: '/dashboard/replay',
        icon: <RotateCcw className="w-4 h-4" />,
      },
      {
        label: 'Moments',
        href: '/dashboard/moments',
        icon: <Star className="w-4 h-4" />,
      },
    ],
  },
  {
    title: 'Build',
    icon: <Zap className="w-4 h-4" />,
    items: [
      {
        label: 'Projects',
        href: '/dashboard/projects',
        icon: <Briefcase className="w-4 h-4" />,
      },
      {
        label: 'Goals',
        href: '/dashboard/goals',
        icon: <Target className="w-4 h-4" />,
      },
      {
        label: 'Decisions',
        href: '/dashboard/decisions',
        icon: <CheckCircle className="w-4 h-4" />,
      },
    ],
  },
  {
    title: 'Intelligence',
    icon: <Brain className="w-4 h-4" />,
    items: [
      {
        label: 'Ask Life Replay',
        href: '/dashboard/ask',
        icon: <MessageCircle className="w-4 h-4" />,
      },
      {
        label: 'Life Map',
        href: '/dashboard/life-map',
        icon: <Network className="w-4 h-4" />,
      },
      {
        label: 'People',
        href: '/dashboard/people',
        icon: <Users className="w-4 h-4" />,
      },
      {
        label: 'Places',
        href: '/dashboard/places',
        icon: <MapPin className="w-4 h-4" />,
      },
      {
        label: 'Insights',
        href: '/dashboard/insights',
        icon: <Lightbulb className="w-4 h-4" />,
      },
      {
        label: 'Analytics',
        href: '/dashboard/analytics',
        icon: <BarChart3 className="w-4 h-4" />,
      },
      {
        label: 'Predictions',
        href: '/dashboard/predictions',
        icon: <TrendingUp className="w-4 h-4" />,
      },
    ],
  },
  {
    title: 'Account',
    icon: <User className="w-4 h-4" />,
    items: [
      {
        label: 'Profile',
        href: '/dashboard/profile',
        icon: <User className="w-4 h-4" />,
      },
      {
        label: 'Settings',
        href: '/dashboard/settings',
        icon: <Settings className="w-4 h-4" />,
      },
      {
        label: 'Billing',
        href: '/dashboard/billing',
        icon: <CreditCard className="w-4 h-4" />,
      },
      {
        label: 'Integrations',
        href: '/dashboard/integrations',
        icon: <Plug className="w-4 h-4" />,
      },
    ],
  },
];

function SidebarSection({ section }: { section: NavSection }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const pathname = usePathname();
  const { isOpen } = useSidebar();

  const isActiveSection = section.items.some((item) =>
    pathname === item.href || pathname.startsWith(item.href + '/')
  );

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-300 uppercase tracking-wider transition-colors"
      >
        {section.icon}
        {isOpen && (
          <>
            <span className="flex-1 text-left">{section.title}</span>
            <ChevronDown
              className={`w-3 h-3 transition-transform ${
                isExpanded ? '' : '-rotate-90'
              }`}
            />
          </>
        )}
      </button>

      {isExpanded && (
        <div className="space-y-1">
          {section.items.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href}>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border-l-2 border-cyan-500'
                      : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  {item.icon}
                  {isOpen && <span>{item.label}</span>}
                </button>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface SidebarProps {
  open?: boolean;
  onToggle?: (open: boolean) => void;
}

export function Sidebar({ open, onToggle }: SidebarProps) {
  const context = useSidebar();
  const pathname = usePathname();
  const isOpen = open ?? context.isOpen;
  const setIsOpen = onToggle ?? context.setIsOpen;

  // Only show sidebar on dashboard routes
  if (!pathname.startsWith('/dashboard')) {
    return null;
  }

  return (
    <>
      {/* Mobile toggle */}
      <div className="fixed top-0 left-0 right-0 z-40 md:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-cyan-400" />
          <span className="text-sm font-semibold text-white">Life Replay</span>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          {isOpen ? (
            <X className="w-5 h-5 text-slate-400" />
          ) : (
            <Menu className="w-5 h-5 text-slate-400" />
          )}
        </button>
      </div>

      {/* Sidebar overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-r border-slate-800 z-35 transition-all duration-300 ${
          isOpen ? 'w-64 md:w-80' : 'w-20 md:w-20'
        } overflow-y-auto pt-20 md:pt-0`}
      >
        {/* Logo */}
        <div className="hidden md:flex items-center gap-2 px-4 py-6 border-b border-slate-800">
          <div className="flex-1">
            {isOpen && (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <Brain className="w-5 h-5 text-cyan-400" />
                  <span className="font-bold text-white">Life Replay</span>
                </div>
                <p className="text-xs text-slate-500">Your life operating system</p>
              </>
            )}
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isOpen ? (
              <X className="w-4 h-4 text-slate-400" />
            ) : (
              <Menu className="w-4 h-4 text-slate-400" />
            )}
          </button>
        </div>

        {/* Quick capture button */}
        {isOpen && (
          <div className="p-4 border-b border-slate-800">
            <Button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700">
              <Plus className="w-4 h-4" />
              Add Memory
            </Button>
          </div>
        )}

        {/* Navigation sections */}
        <nav className="px-3 py-4 space-y-6">
          {NAV_SECTIONS.map((section) => (
            <SidebarSection key={section.title} section={section} />
          ))}
        </nav>

        {/* Bottom section */}
        {isOpen && (
          <div className="border-t border-slate-800 p-4 mt-auto space-y-2">
            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-slate-300 hover:bg-slate-800/50 rounded-lg transition-colors">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        )}
      </aside>

      {/* Main content offset */}
      <div className={`transition-all duration-300 ${isOpen ? 'md:ml-80' : 'md:ml-20'}`}>
        <div className="h-20 md:h-0" />
      </div>
    </>
  );
}

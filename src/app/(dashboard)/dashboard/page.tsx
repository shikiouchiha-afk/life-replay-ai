'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Lightbulb,
  Heart,
  Target,
  Briefcase,
  Calendar,
  AlertCircle,
  Flame,
  Clock,
  TrendingUp,
  Zap,
  Plus,
} from 'lucide-react';

export default function DashboardPage() {
  const todaysMemories = 3;
  const activeGoals = 2;
  const activeProjects = 2;
  const upcomingEvents = 1;
  const unresolvedDecisions = 2;
  const streakDays = 12;

  const quickActions = [
    { label: 'Capture', icon: Plus },
    { label: 'Search', icon: TrendingUp },
    { label: 'Insights', icon: Lightbulb },
    { label: 'Goals', icon: Target },
    { label: 'Journal', icon: Heart },
    { label: 'Calendar', icon: Calendar },
  ];

  return (
    <main className="space-y-8">
      {/* Hero Section */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Good morning, Creator
        </h1>
        <p className="text-slate-300">
          Here's your life overview for today
        </p>
      </div>

      {/* AI Briefing Card */}
      <Card className="border-slate-700 bg-gradient-to-r from-slate-800/50 via-slate-800/30 to-slate-800/50 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg">
              <Lightbulb className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">
                Today's AI Briefing
              </h3>
              <p className="text-slate-300 mb-4">
                You've been focused on the Life Replay launch. 3 new ideas captured,
                2 decisions pending review, and your project is 65% complete. You're
                on a 12-day capture streak! 🔥
              </p>
              <div className="flex gap-3">
                <Button variant="outline" size="sm">
                  Full Insights
                </Button>
                <Button variant="ghost" size="sm">
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <button
                key={idx}
                className="group relative overflow-hidden rounded-lg p-4 bg-gradient-to-br from-cyan-900/30 to-blue-900/30 hover:from-cyan-800/50 hover:to-blue-800/50 transition-all duration-300 transform hover:-translate-y-1 border border-slate-700 hover:border-cyan-600/50"
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="relative flex flex-col items-center justify-center text-center">
                  <Icon className="w-6 h-6 text-cyan-400 mb-2" />
                  <span className="text-xs font-semibold text-white leading-tight">
                    {action.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Captures */}
          <Card className="border-slate-700 bg-slate-800/50">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  <h3 className="font-semibold text-white">Today's Memories</h3>
                </div>
                <span className="text-2xl font-bold text-cyan-400">
                  {todaysMemories}
                </span>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer">
                  <p className="text-sm font-medium text-white">
                    Life Replay Architecture Breakthrough
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    2:43 PM · Software · Important
                  </p>
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer">
                  <p className="text-sm font-medium text-white">
                    Meeting with Design Team
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    1:15 PM · Work · Normal
                  </p>
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer">
                  <p className="text-sm font-medium text-white">
                    New insight on user behavior
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    10:30 AM · Research · Normal
                  </p>
                </div>
              </div>
              <Button variant="ghost" className="w-full mt-4 text-cyan-400 hover:text-cyan-300">
                View All Today's Memories
              </Button>
            </div>
          </Card>

          {/* Active Goals & Projects */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Goals */}
            <Card className="border-slate-700 bg-slate-800/50">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold text-white">Active Goals</h3>
                  </div>
                  <span className="text-2xl font-bold text-blue-400">
                    {activeGoals}
                  </span>
                </div>
                <div className="space-y-3">
                  {[
                    { title: 'Launch Life Replay', progress: 65 },
                    { title: 'Learn Rust', progress: 20 },
                  ].map((goal, idx) => (
                    <div key={idx}>
                      <p className="text-sm text-slate-300 mb-2">{goal.title}</p>
                      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{goal.progress}%</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Projects */}
            <Card className="border-slate-700 bg-slate-800/50">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-emerald-500" />
                    <h3 className="font-semibold text-white">Active Projects</h3>
                  </div>
                  <span className="text-2xl font-bold text-emerald-400">
                    {activeProjects}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                    <p className="text-sm font-medium text-white">
                      Life Replay AI Platform
                    </p>
                    <span className="text-xs text-emerald-400 font-semibold">
                      Active
                    </span>
                  </div>
                  <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                    <p className="text-sm font-medium text-white">
                      AI Productivity Tool
                    </p>
                    <span className="text-xs text-amber-400 font-semibold">
                      Planning
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Upcoming & Decisions */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Upcoming Events */}
            <Card className="border-slate-700 bg-slate-800/50">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-500" />
                    <h3 className="font-semibold text-white">Upcoming</h3>
                  </div>
                  <span className="text-2xl font-bold text-purple-400">
                    {upcomingEvents}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                    <p className="text-sm text-white">Team Sync Meeting</p>
                    <p className="text-xs text-slate-500">Tomorrow at 10:00 AM</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Pending Decisions */}
            <Card className="border-slate-700 bg-slate-800/50">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                    <h3 className="font-semibold text-white">Pending Review</h3>
                  </div>
                  <span className="text-2xl font-bold text-orange-400">
                    {unresolvedDecisions}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                    <p className="text-sm text-white">Should I switch to Next.js 16?</p>
                    <p className="text-xs text-slate-500">Pending since Aug 15</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Streak Card */}
          <Card className="border-slate-700 bg-gradient-to-br from-orange-900/20 to-red-900/20 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center gap-3">
                <Flame className="w-8 h-8 text-orange-500" />
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">
                    Capture Streak
                  </p>
                  <p className="text-3xl font-bold text-orange-400">{streakDays}</p>
                  <p className="text-xs text-slate-400 mt-1">days in a row</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Discoveries */}
          <Card className="border-slate-700 bg-slate-800/50">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                <h3 className="font-semibold text-white">Discoveries</h3>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                  <p className="text-xs text-slate-300">
                    📊 Your most productive hours are 6-9 AM
                  </p>
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                  <p className="text-xs text-slate-300">
                    🤝 You mention "team" 4x more than average
                  </p>
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                  <p className="text-xs text-slate-300">
                    💡 Connected 7 ideas about automation
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* This Week Summary */}
          <Card className="border-slate-700 bg-slate-800/50">
            <div className="p-6">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                This Week
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Memories Captured</span>
                  <span className="text-white font-semibold">23</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Insights Found</span>
                  <span className="text-white font-semibold">5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Connections Made</span>
                  <span className="text-cyan-400 font-semibold">7</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}

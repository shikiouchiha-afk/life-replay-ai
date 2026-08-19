'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  BarChart3,
  LineChart as LineChartIcon,
  TrendingUp,
  Calendar,
  Heart,
  Brain,
} from 'lucide-react';
import { getDashboardStats } from '@/lib/repositories/life-data';

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof getDashboardStats>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('Month');

  useEffect(() => {
    let active = true;

    getDashboardStats()
      .then((result) => {
        if (active) setStats(result);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-slate-400 mt-2">Visual insights into your life</p>
        </div>
        <Card className="border-slate-700 bg-slate-800/50 p-6 text-slate-400">Loading analytics...</Card>
      </div>
    );
  }

  if (!stats || !stats.configured) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-slate-400 mt-2">Visual insights into your life</p>
        </div>
        <Card className="border-dashed border-slate-700 bg-slate-800/30 p-10 text-center text-slate-400">
          {stats?.message || 'Analytics require Supabase configuration.'}
        </Card>
      </div>
    );
  }

  const analyticsStats = [
    {
      icon: Heart,
      label: 'Memories Captured',
      value: stats.totalMemories.toString(),
      change: 'total',
    },
    {
      icon: Brain,
      label: 'Goals Tracked',
      value: stats.totalGoals.toString(),
      change: 'active',
    },
    {
      icon: TrendingUp,
      label: 'Projects',
      value: stats.totalProjects.toString(),
      change: 'in progress',
    },
    {
      icon: Calendar,
      label: 'Life Events',
      value: stats.upcomingEvents.toString(),
      change: 'upcoming',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="text-slate-400 mt-2">Visual insights into your life</p>
      </div>

      {/* Time period selector */}
      <div className="flex gap-2">
        {['Week', 'Month', 'Quarter', 'Year'].map((p) => (
          <Button
            key={p}
            variant={period === p ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setPeriod(p)}
          >
            {p}
          </Button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        {analyticsStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="border-slate-700 bg-slate-800/50">
              <div className="p-6">
                <Icon className="w-5 h-5 text-cyan-400 mb-3" />
                <p className="text-slate-400 text-sm mb-2">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-2">{stat.change}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Summary Card */}
      <Card className="border-slate-700 bg-slate-800/50">
        <div className="p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <LineChartIcon className="w-5 h-5 text-blue-500" />
            Life Activity Summary
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-400 mb-2">Total Activity Events</p>
              <p className="text-2xl font-bold text-cyan-400">{stats.totalActivity}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-2">Journal Entries</p>
              <p className="text-2xl font-bold text-emerald-400">{stats.totalJournalEntries}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-2">Total Decisions</p>
              <p className="text-2xl font-bold text-amber-400">{stats.totalDecisions}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

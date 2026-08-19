'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Lightbulb, TrendingUp, BarChart3, X } from 'lucide-react';
import { getDashboardStats } from '@/lib/repositories/life-data';

type Insight = {
  id: string;
  type: 'Pattern' | 'Connection' | 'Growth' | 'Social';
  title: string;
  description: string;
  confidence: number;
  relatedMemories: number;
};

export default function InsightsPage() {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof getDashboardStats>> | null>(null);
  const [dismissedInsights, setDismissedInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

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

  const generateInsights = (): Insight[] => {
    if (!stats || !stats.configured) return [];

    const insights: Insight[] = [];

    if (stats.totalMemories > 10) {
      insights.push({
        id: '1',
        type: 'Pattern',
        title: `You've captured ${stats.totalMemories} memories`,
        description: 'Building a rich personal knowledge base with diverse life events and reflections.',
        confidence: 0.95,
        relatedMemories: stats.totalMemories,
      });
    }

    if (stats.totalGoals > 0) {
      insights.push({
        id: '2',
        type: 'Growth',
        title: `You're actively tracking ${stats.totalGoals} goals`,
        description: 'Setting clear objectives and measuring progress towards your aspirations.',
        confidence: 0.9,
        relatedMemories: stats.totalGoals,
      });
    }

    if (stats.totalProjects > 0) {
      insights.push({
        id: '3',
        type: 'Connection',
        title: `You have ${stats.totalProjects} projects in progress`,
        description: 'Multiple initiatives reflect your diverse interests and commitments.',
        confidence: 0.88,
        relatedMemories: stats.totalProjects,
      });
    }

    if (stats.totalJournalEntries > 0) {
      insights.push({
        id: '4',
        type: 'Social',
        title: `You've journaled ${stats.totalJournalEntries} times`,
        description: 'Regular reflection practice shows commitment to self-awareness and growth.',
        confidence: 0.92,
        relatedMemories: stats.totalJournalEntries,
      });
    }

    return insights;
  };

  const insights = generateInsights();

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">AI Insights</h1>
          <p className="text-slate-400 mt-2">Patterns and discoveries from your life data</p>
        </div>
        <Card className="border-slate-700 bg-slate-800/50 p-6 text-slate-400">Loading insights...</Card>
      </div>
    );
  }

  if (!stats || !stats.configured) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">AI Insights</h1>
          <p className="text-slate-400 mt-2">Patterns and discoveries from your life data</p>
        </div>
        <Card className="border-dashed border-slate-700 bg-slate-800/30 p-10 text-center text-slate-400">
          {stats?.message || 'Insights require Supabase configuration.'}
        </Card>
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">AI Insights</h1>
          <p className="text-slate-400 mt-2">Patterns and discoveries from your life data</p>
        </div>
        <Card className="border-dashed border-slate-700 bg-slate-800/30 p-10 text-center text-slate-400">
          Start capturing memories, goals, and reflections to unlock personalized insights.
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">AI Insights</h1>
        <p className="text-slate-400 mt-2">
          Patterns and discoveries from your life data
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {['All', 'Patterns', 'Growth', 'Connection', 'Social'].map((tab) => (
          <Button
            key={tab}
            variant={tab === 'All' ? 'primary' : 'outline'}
            size="sm"
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Insights Grid */}
      <div className="space-y-4">
        {insights
          .filter((i) => !dismissedInsights.includes(i.id))
          .map((insight) => (
            <Card
              key={insight.id}
              className="border-slate-700 bg-slate-800/50 hover:bg-slate-800/70 transition-all"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-lg">
                      <Lightbulb className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-slate-700 text-xs font-semibold text-slate-300 rounded">
                          {insight.type}
                        </span>
                        <span className="text-xs text-slate-500">
                          {(insight.confidence * 100).toFixed(0)}% confident
                        </span>
                      </div>
                      <h3 className="font-semibold text-white">{insight.title}</h3>
                      <p className="text-slate-400 text-sm mt-1">
                        {insight.description}
                      </p>
                      <p className="text-xs text-slate-500 mt-3">
                        Based on {insight.relatedMemories} record{insight.relatedMemories !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setDismissedInsights([...dismissedInsights, insight.id])}
                    className="text-slate-400 hover:text-slate-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                  <Button variant="ghost" size="sm">
                    Explore
                  </Button>
                </div>
              </div>
            </Card>
          ))}
      </div>
    </div>
  );
}

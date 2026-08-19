'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Heart,
  Target,
} from 'lucide-react';

export default function WeeklyReplayPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Weekly Replay</h1>
          <p className="text-slate-400 mt-2">Your AI-generated week summary</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Week selector */}
      <Card className="border-slate-700 bg-slate-800/50">
        <div className="p-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-slate-400" />
            <div>
              <p className="text-sm font-semibold text-white">Week of August 14 - 20, 2026</p>
              <p className="text-xs text-slate-500">7 days captured</p>
            </div>
          </div>
        </div>
      </Card>

      {/* AI Summary */}
      <Card className="border-slate-700 bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-6">
        <h3 className="font-semibold text-white mb-3">AI Summary</h3>
        <p className="text-slate-300 leading-relaxed mb-4">
          This week was highly productive. You captured 28 memories, made significant
          progress on the Life Replay launch, and discovered 5 new connections between your
          ideas. Your most productive day was Thursday (Aug 17), and you maintained a
          consistent capture streak. Major themes: product development, team collaboration, and
          strategic planning.
        </p>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            Expand Summary
          </Button>
          <Button variant="ghost" size="sm">
            Export
          </Button>
        </div>
      </Card>

      {/* Key Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-slate-700 bg-slate-800/50">
          <div className="p-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Progress Made
            </h3>
            <ul className="space-y-2">
              {[
                'Completed dashboard design',
                'Implemented 80% of core features',
                'Onboarded 2 beta users',
                'Resolved 15 tech issues',
              ].map((item, idx) => (
                <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card className="border-slate-700 bg-slate-800/50">
          <div className="p-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              Goals Updated
            </h3>
            <ul className="space-y-2">
              {[
                'Launch Life Replay: +15%',
                'Learn Rust: +5%',
                'Health: Maintained',
                'Reading: 2 books completed',
              ].map((item, idx) => (
                <li key={idx} className="text-sm text-slate-300">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      {/* Statistics */}
      <Card className="border-slate-700 bg-slate-800/50">
        <div className="p-6">
          <h3 className="font-semibold text-white mb-4">Weekly Statistics</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { label: 'Memories', value: '28' },
              { label: 'Connections', value: '5' },
              { label: 'Decisions', value: '2' },
              { label: 'Insights', value: '3' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-cyan-400">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Memorable Moments */}
      <Card className="border-slate-700 bg-slate-800/50">
        <div className="p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Most Memorable
          </h3>
          <div className="space-y-3">
            <p className="text-sm text-slate-300">
              💡 "Architectural breakthrough that simplified the entire system"
            </p>
            <p className="text-sm text-slate-300">
              🤝 "Great team collaboration on the design review"
            </p>
            <p className="text-sm text-slate-300">
              🎯 "Successfully closed 2 critical bugs before launch"
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Award,
} from 'lucide-react';

export default function MonthlyReplayPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Monthly Replay</h1>
          <p className="text-slate-400 mt-2">Your AI-generated month summary</p>
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

      {/* Month selector */}
      <Card className="border-slate-700 bg-slate-800/50">
        <div className="p-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-slate-400" />
            <div>
              <p className="text-sm font-semibold text-white">August 2026</p>
              <p className="text-xs text-slate-500">127 memories captured</p>
            </div>
          </div>
        </div>
      </Card>

      {/* AI Summary */}
      <Card className="border-slate-700 bg-gradient-to-r from-purple-900/20 to-blue-900/20 p-6">
        <h3 className="font-semibold text-white mb-3">Month Overview</h3>
        <p className="text-slate-300 leading-relaxed mb-4">
          August was a transformative month. Life Replay launched successfully, you achieved
          a critical architectural breakthrough, and built strong team connections. Overall,
          you're in a growth phase with clear momentum. Your goals are tracking well, and
          you've established healthy patterns for memory capture and self-reflection.
        </p>
      </Card>

      {/* Key Achievements */}
      <Card className="border-slate-700 bg-slate-800/50">
        <div className="p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            Key Achievements
          </h3>
          <ul className="space-y-2">
            {[
              'Shipped Life Replay to market',
              'Onboarded 10 beta users',
              'Architecture refactor completed',
              'Team expanded to 3 people',
              '500+ memories captured',
            ].map((item, idx) => (
              <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                <span className="text-yellow-400 mt-1">⭐</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      {/* Monthly Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { label: 'Total Memories', value: '127', icon: '📝' },
          { label: 'Insights Found', value: '12', icon: '💡' },
          { label: 'Goals Progressed', value: '4', icon: '🎯' },
        ].map((stat) => (
          <Card key={stat.label} className="border-slate-700 bg-slate-800/50">
            <div className="p-6 text-center">
              <p className="text-3xl mb-2">{stat.icon}</p>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm text-slate-400">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Themes & Topics */}
      <Card className="border-slate-700 bg-slate-800/50">
        <div className="p-6">
          <h3 className="font-semibold text-white mb-4">Major Themes</h3>
          <div className="flex flex-wrap gap-2">
            {[
              'Product Development',
              'Team Building',
              'Technical Architecture',
              'Growth',
              'Innovation',
            ].map((theme) => (
              <span
                key={theme}
                className="px-3 py-2 bg-slate-700 text-sm text-slate-300 rounded-lg"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>
      </Card>

      {/* Growth Indicators */}
      <Card className="border-slate-700 bg-slate-800/50">
        <div className="p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            Growth Indicators
          </h3>
          <div className="space-y-3">
            {[
              {
                metric: 'Goal Clarity',
                change: '+35%',
                desc: 'Your goals are more specific and measurable',
              },
              {
                metric: 'Decision Quality',
                change: '+28%',
                desc: 'Better-reasoned decisions with documented outcomes',
              },
              {
                metric: 'Team Mentions',
                change: '+4x',
                desc: 'Increased collaboration and shared work',
              },
            ].map((indicator) => (
              <div
                key={indicator.metric}
                className="p-3 bg-slate-900/50 rounded-lg border border-slate-700"
              >
                <p className="font-medium text-white">{indicator.metric}</p>
                <p className="text-sm text-emerald-400">{indicator.change}</p>
                <p className="text-xs text-slate-400 mt-1">{indicator.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

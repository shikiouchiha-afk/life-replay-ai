'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Calendar,
  TrendingUp,
  Award,
  Users,
  MapPin,
  Lightbulb,
} from 'lucide-react';

export default function YearReplayPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Year in Review: 2026</h1>
        <p className="text-slate-400 mt-2">Your comprehensive annual life review</p>
      </div>

      {/* Year Summary */}
      <Card className="border-slate-700 bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-8">
        <div className="text-center">
          <p className="text-4xl font-bold text-cyan-400 mb-3">2026</p>
          <p className="text-lg text-slate-300 mb-4">
            A year of growth, creation, and meaningful connections
          </p>
          <p className="text-slate-400 max-w-2xl mx-auto">
            You captured over 1,200 memories, completed 8 major projects, and grew
            significantly as a person. This year marked the launch of your most ambitious
            venture and deepened your relationships with people who matter most.
          </p>
        </div>
      </Card>

      {/* Key Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: 'Total Memories', value: '1,247', icon: '📝' },
          { label: 'Insights Discovered', value: '156', icon: '💡' },
          { label: 'Goals Completed', value: '8', icon: '🎯' },
          { label: 'Major Moments', value: '12', icon: '⭐' },
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

      {/* Quarterly Breakdown */}
      <Card className="border-slate-700 bg-slate-800/50">
        <div className="p-6">
          <h3 className="font-semibold text-white mb-4">Quarterly Overview</h3>
          <div className="space-y-4">
            {[
              {
                quarter: 'Q1 2026',
                theme: 'Foundation',
                achievements: ['Planning phase', '200 memories'],
              },
              {
                quarter: 'Q2 2026',
                theme: 'Building',
                achievements: ['Active development', '300 memories'],
              },
              {
                quarter: 'Q3 2026',
                theme: 'Launch',
                achievements: ['Product launch', '400 memories', 'Beta users'],
              },
              {
                quarter: 'Q4 2026',
                theme: 'Growth',
                achievements: ['Scaling', '347 memories', 'Team expansion'],
              },
            ].map((q) => (
              <div
                key={q.quarter}
                className="p-4 bg-slate-900/50 rounded-lg border border-slate-700"
              >
                <p className="font-medium text-white">
                  {q.quarter} - {q.theme}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {q.achievements.map((a) => (
                    <span key={a} className="text-xs text-slate-400">
                      • {a}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Top Themes & People */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-slate-700 bg-slate-800/50">
          <div className="p-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Major Themes
            </h3>
            <div className="space-y-2">
              {[
                'Product Development',
                'Leadership Growth',
                'Team Building',
                'Innovation',
                'Personal Development',
              ].map((theme) => (
                <p key={theme} className="text-sm text-slate-300">
                  ✓ {theme}
                </p>
              ))}
            </div>
          </div>
        </Card>

        <Card className="border-slate-700 bg-slate-800/50">
          <div className="p-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Most Important People
            </h3>
            <div className="space-y-2">
              {['Alice Chen', 'Sarah Johnson', 'Bob Martinez', 'Team Members', 'Family'].map(
                (person) => (
                  <p key={person} className="text-sm text-slate-300">
                    👤 {person}
                  </p>
                )
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Places & Moments */}
      <Card className="border-slate-700 bg-slate-800/50">
        <div className="p-6">
          <h3 className="font-semibold text-white mb-4">Most Meaningful Moments</h3>
          <div className="space-y-3">
            {[
              '✨ Life Replay launch day',
              '🎯 First major product milestone',
              '🤝 Team grew from 1 to 3 people',
              '📍 Visited 8 new cities',
              '💡 Multiple breakthrough ideas',
            ].map((moment) => (
              <p key={moment} className="text-slate-300">
                {moment}
              </p>
            ))}
          </div>
        </div>
      </Card>

      {/* CTA */}
      <div className="flex gap-3">
        <Button className="bg-gradient-to-r from-cyan-600 to-blue-600">
          <Calendar className="w-4 h-4 mr-2" />
          View Full Timeline
        </Button>
        <Button variant="outline">Export Year Review</Button>
      </div>
    </div>
  );
}

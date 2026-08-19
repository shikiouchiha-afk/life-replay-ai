'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TrendingUp, Zap, Target, AlertCircle } from 'lucide-react';

export default function PredictionsPage() {
  const predictions = [
    {
      id: '1',
      title: 'Goal Completion Probability',
      forecast: '78% likely to complete "Launch Life Replay" by Oct 15',
      reasoning: 'Based on your current velocity and commitment patterns',
      factors: ['Consistent progress', 'Team support', 'Clear milestones'],
    },
    {
      id: '2',
      title: 'Productivity Trend',
      forecast: 'Peak productivity expected Aug 22-25',
      reasoning: 'Historical patterns show increased output after major milestones',
      factors: ['Post-launch energy', 'User feedback cycle', 'Team dynamics'],
    },
    {
      id: '3',
      title: 'Decision Outcome Simulation',
      forecast: 'Switching to Next.js 16 → 82% positive impact',
      reasoning: 'Technical alignment with your long-term goals',
      factors: ['Performance gain', 'Developer experience', 'Ecosystem'],
    },
    {
      id: '4',
      title: 'Life Path Projection',
      forecast: 'Next 6 months: Growth phase with increased connections',
      reasoning: 'Your captured intentions and progress suggest expansion',
      factors: ['Ambition trajectory', 'Resource availability', 'Network growth'],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Predictions</h1>
        <p className="text-slate-400 mt-2">AI-simulated future paths based on your history</p>
      </div>

      <Card className="border-slate-700 bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-6">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
          <div>
            <p className="text-slate-300 text-sm">
              Predictions are based on your past patterns, current goals, and Life Graph analysis. They're insights to consider, not certainties.
            </p>
          </div>
        </div>
      </Card>

      {/* Predictions */}
      <div className="space-y-4">
        {predictions.map((prediction) => (
          <Card
            key={prediction.id}
            className="border-slate-700 bg-slate-800/50 hover:bg-slate-800/70 transition-all"
          >
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{prediction.title}</h3>
                  <p className="text-cyan-400 font-medium mt-2">
                    {prediction.forecast}
                  </p>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
                <p className="text-sm text-slate-300">
                  <span className="text-slate-400">Reasoning:</span> {prediction.reasoning}
                </p>
              </div>

              <div className="mb-4">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">
                  Key Factors
                </p>
                <div className="flex flex-wrap gap-2">
                  {prediction.factors.map((factor) => (
                    <span
                      key={factor}
                      className="px-3 py-1 bg-slate-700 text-xs text-slate-300 rounded-full"
                    >
                      ✓ {factor}
                    </span>
                  ))}
                </div>
              </div>

              <Button variant="ghost" size="sm">
                Explore Simulation
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

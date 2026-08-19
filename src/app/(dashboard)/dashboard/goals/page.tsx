'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getGoalList } from '@/lib/repositories/life-data';

export default function GoalsPage() {
  const [items, setItems] = useState<Awaited<ReturnType<typeof getGoalList>>['data']>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getGoalList(25)
      .then((result) => {
        if (active) setItems(result.data ?? []);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-white">Goals</h1>
          <p className="text-slate-400 mt-2">Track your progress and milestones</p>
        </div>
        <Button variant="outline">New goal</Button>
      </div>

      {loading ? (
        <Card className="border-slate-700 bg-slate-800/50 p-6 text-slate-400">Loading goals...</Card>
      ) : items.length === 0 ? (
        <Card className="border-dashed border-slate-700 bg-slate-800/30 p-10 text-center text-slate-400">
          No goals yet. Add a few goals to start tracking your direction.
        </Card>
      ) : (
        <div className="grid gap-4">
          {items.map((goal) => (
            <Card key={goal.id} className="border-slate-700 bg-slate-800/50 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">{goal.title}</h2>
                  <p className="text-sm text-slate-400 mt-1">{goal.status ?? 'Active'}</p>
                </div>
                <span className="text-sm font-semibold text-cyan-400">{goal.progress ?? 0}%</span>
              </div>
              <div className="mt-4 h-2 w-full rounded-full bg-slate-700">
                <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" style={{ width: `${Math.min(100, Math.max(0, goal.progress ?? 0))}%` }} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
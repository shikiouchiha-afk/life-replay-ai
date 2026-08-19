'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getDecisionList } from '@/lib/repositories/life-data';
import { CheckCircle } from 'lucide-react';

export default function DecisionsPage() {
  const [items, setItems] = useState<Awaited<ReturnType<typeof getDecisionList>>['data']>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getDecisionList(25)
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
          <h1 className="text-3xl font-bold text-white">Decisions</h1>
          <p className="text-slate-400 mt-2">Review your decision history and reasoning</p>
        </div>
        <Button variant="outline">Log Decision</Button>
      </div>

      {loading ? (
        <Card className="border-slate-700 bg-slate-800/50 p-6 text-slate-400">Loading decisions...</Card>
      ) : items.length === 0 ? (
        <Card className="border-dashed border-slate-700 bg-slate-800/30 p-10 text-center text-slate-400">
          No decisions logged yet. Start documenting your decisions and reasoning to build a decision history.
        </Card>
      ) : (
        <div className="grid gap-4">
          {items.map((decision) => (
            <Card key={decision.id} className="border-slate-700 bg-slate-800/50 p-5">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-lg flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-white">{decision.title}</h2>
                  <p className="text-sm text-slate-400 mt-1">
                    {decision.decision_date ? new Date(decision.decision_date).toLocaleDateString() : 'Undated'} · {decision.status ?? 'Pending'}
                  </p>
                  {decision.reasoning ? <p className="text-slate-300 mt-3">{decision.reasoning}</p> : null}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}

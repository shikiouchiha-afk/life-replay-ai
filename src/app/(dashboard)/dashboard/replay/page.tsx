'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getTimelineEntries } from '@/lib/repositories/life-data';
import { Clock, ChevronDown } from 'lucide-react';

export default function ReplayPage() {
  const [items, setItems] = useState<Awaited<ReturnType<typeof getTimelineEntries>>['data']>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getTimelineEntries(50)
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Replay</h1>
        <p className="text-slate-400 mt-2">Travel through your history chronologically</p>
      </div>

      {loading ? (
        <Card className="border-slate-700 bg-slate-800/50 p-6 text-slate-400">Loading your timeline...</Card>
      ) : items.length === 0 ? (
        <Card className="border-dashed border-slate-700 bg-slate-800/30 p-10 text-center text-slate-400">
          No timeline events yet. Your events will appear here as you create memories, goals, and other life records.
        </Card>
      ) : (
        <div className="space-y-0">
          {items.map((event, idx) => (
            <div key={event.id} className="relative">
              <Card className="border-slate-700 bg-slate-800/50 border-l-2 border-l-cyan-500/50 rounded-l-none">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="pt-1">
                      <Clock className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                      <p className="text-xs text-slate-400 uppercase tracking-wider mt-2">
                        {event.event_type ? event.event_type.toUpperCase() : 'EVENT'} · 
                        {event.occurred_at ? ` ${new Date(event.occurred_at).toLocaleDateString()} at ${new Date(event.occurred_at).toLocaleTimeString()}` : ' No date'}
                      </p>
                      {event.summary ? (
                        <p className="text-slate-300 mt-3">{event.summary}</p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

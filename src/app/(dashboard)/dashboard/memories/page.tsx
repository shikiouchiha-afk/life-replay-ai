'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getMemoryLibrary } from '@/lib/repositories/life-data';

export default function MemoriesPage() {
  const [items, setItems] = useState<Awaited<ReturnType<typeof getMemoryLibrary>>['data']>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getMemoryLibrary(25)
      .then((result) => {
        if (active) {
          setItems(result.data ?? []);
        }
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
          <h1 className="text-3xl font-bold text-white">Memories</h1>
          <p className="text-slate-400 mt-2">Your complete memory library</p>
        </div>
        <Button variant="outline">Add memory</Button>
      </div>

      {loading ? (
        <Card className="border-slate-700 bg-slate-800/50 p-6 text-slate-400">Loading memory library...</Card>
      ) : items.length === 0 ? (
        <Card className="border-dashed border-slate-700 bg-slate-800/30 p-10 text-center text-slate-400">
          No memories yet. Connect Supabase and start capturing moments to populate this library.
        </Card>
      ) : (
        <div className="grid gap-4">
          {items.map((memory) => (
            <Card key={memory.id} className="border-slate-700 bg-slate-800/50 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">{memory.title}</h2>
                  <p className="text-sm text-slate-400 mt-1">
                    {memory.event_date ? new Date(memory.event_date).toLocaleDateString() : 'No date'} · {memory.importance ?? 'Unlabeled'}
                  </p>
                </div>
                <span className="rounded-full border border-slate-600 px-2 py-1 text-xs text-slate-300">Memory</span>
              </div>
              {memory.summary ? <p className="mt-3 text-slate-300">{memory.summary}</p> : null}
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}

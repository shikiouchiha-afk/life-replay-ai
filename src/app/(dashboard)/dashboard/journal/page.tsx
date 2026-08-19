'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getJournalEntries } from '@/lib/repositories/life-data';
import { BookOpen, Plus, Calendar, Smile } from 'lucide-react';

export default function JournalPage() {
  const [items, setItems] = useState<Awaited<ReturnType<typeof getJournalEntries>>['data']>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    let active = true;

    getJournalEntries(25)
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

  const filteredItems = items.filter((item) =>
    item.entry_date ? new Date(item.entry_date).toISOString().split('T')[0] === selectedDate : false
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Journal</h1>
          <p className="text-slate-400 mt-2">Your personal reflection space</p>
        </div>
        <Button className="bg-gradient-to-r from-cyan-600 to-blue-600">
          <Plus className="w-4 h-4 mr-2" />
          New Entry
        </Button>
      </div>

      <Card className="border-slate-700 bg-slate-800/50">
        <div className="p-4 flex gap-4 items-center">
          <Calendar className="w-5 h-5 text-slate-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm"
          />
          <Button variant="outline" size="sm">
            Filter
          </Button>
        </div>
      </Card>

      {loading ? (
        <Card className="border-slate-700 bg-slate-800/50 p-6 text-slate-400">Loading journal entries...</Card>
      ) : filteredItems.length === 0 ? (
        <Card className="border-dashed border-slate-700 bg-slate-800/30 p-10 text-center text-slate-400">
          No entries for this date. Start journaling to capture your thoughts and reflections.
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((entry) => (
            <Card key={entry.id} className="border-slate-700 bg-slate-800/50">
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-slate-700 rounded-lg">
                    <BookOpen className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 uppercase tracking-wider">
                      {entry.entry_date ? new Date(entry.entry_date).toLocaleDateString() : 'No date'}
                    </p>
                    <h3 className="text-lg font-semibold text-white mt-1">
                      {entry.title || 'Untitled Entry'}
                    </h3>
                  </div>
                  {entry.mood ? (
                    <div className="flex items-center gap-2">
                      <Smile className="w-5 h-5 text-amber-400" />
                      <span className="text-sm text-slate-300">{entry.mood}</span>
                    </div>
                  ) : null}
                </div>
                <p className="text-slate-300 mb-4 line-clamp-3">{entry.content}</p>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm">
                    View Full
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

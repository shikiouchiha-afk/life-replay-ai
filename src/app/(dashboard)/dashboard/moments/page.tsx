'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Star, Plus, Calendar, Heart, MapPin } from 'lucide-react';

export default function MomentsPage() {
  const moments = [
    {
      id: '1',
      title: 'Life Replay Launch Day',
      date: 'Aug 15, 2026',
      type: 'Achievement',
      emotionalImpact: 'Euphoric',
      people: ['Alice', 'Bob'],
      places: ['Office'],
    },
    {
      id: '2',
      title: 'First Million Users',
      date: 'Aug 10, 2026',
      type: 'Milestone',
      emotionalImpact: 'Proud',
      people: ['Team'],
      places: ['SF HQ'],
    },
    {
      id: '3',
      title: 'Got Accepted to Y Combinator',
      date: 'Aug 1, 2026',
      type: 'Achievement',
      emotionalImpact: 'Excited',
      people: ['Sarah'],
      places: ['Home'],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Moments</h1>
          <p className="text-slate-400 mt-2">Major life moments and milestones</p>
        </div>
        <Button className="bg-gradient-to-r from-cyan-600 to-blue-600">
          <Plus className="w-4 h-4 mr-2" />
          Record Moment
        </Button>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {moments.map((moment, idx) => (
          <Card
            key={moment.id}
            className="border-slate-700 bg-slate-800/50 hover:bg-slate-800/70 transition-all relative"
          >
            {/* Timeline line */}
            {idx !== moments.length - 1 && (
              <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500/50 to-transparent" />
            )}

            <div className="p-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Star className="w-8 h-8 text-yellow-400 fill-current" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{moment.title}</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    {moment.date}
                  </p>

                  <div className="mt-4 space-y-2 text-sm">
                    <p>
                      <span className="text-slate-400">Type:</span>{' '}
                      <span className="text-slate-300">{moment.type}</span>
                    </p>
                    <p>
                      <span className="text-slate-400">Impact:</span>{' '}
                      <span className="text-slate-300">{moment.emotionalImpact}</span>
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {moment.people.map((person) => (
                      <span
                        key={person}
                        className="px-2 py-1 bg-slate-700 text-xs text-slate-300 rounded"
                      >
                        👤 {person}
                      </span>
                    ))}
                    {moment.places.map((place) => (
                      <span
                        key={place}
                        className="px-2 py-1 bg-slate-700 text-xs text-slate-300 rounded"
                      >
                        📍 {place}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Users, Plus, Search, Heart, MessageCircle } from 'lucide-react';
import { useState } from 'react';

export default function PeoplePage() {
  const [searchTerm, setSearchTerm] = useState('');

  const people = [
    {
      id: '1',
      name: 'Alice Chen',
      relationship: 'Cofounder',
      lastContact: 'Today',
      memories: 23,
      isFavorite: true,
    },
    {
      id: '2',
      name: 'Bob Martinez',
      relationship: 'Designer',
      lastContact: '2 days ago',
      memories: 18,
      isFavorite: false,
    },
    {
      id: '3',
      name: 'Sarah Johnson',
      relationship: 'Mentor',
      lastContact: '1 week ago',
      memories: 42,
      isFavorite: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">People</h1>
          <p className="text-slate-400 mt-2">Important people in your life</p>
        </div>
        <Button className="bg-gradient-to-r from-cyan-600 to-blue-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Person
        </Button>
      </div>

      {/* Search */}
      <Card className="border-slate-700 bg-slate-800/50">
        <div className="p-4 flex gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search people..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border-none text-white placeholder-slate-500 outline-none"
          />
        </div>
      </Card>

      {/* People Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {people.map((person) => (
          <Card
            key={person.id}
            className="border-slate-700 bg-slate-800/50 hover:bg-slate-800/70 transition-all cursor-pointer"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-white">{person.name}</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    {person.relationship}
                  </p>
                </div>
                {person.isFavorite && (
                  <Heart className="w-5 h-5 text-red-500 fill-current" />
                )}
              </div>

              <div className="space-y-2 mb-4 text-sm">
                <p className="text-slate-400">
                  Last contact: <span className="text-slate-300">{person.lastContact}</span>
                </p>
                <p className="text-slate-400">
                  Memories: <span className="text-slate-300">{person.memories}</span>
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="flex-1">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  View
                </Button>
                <Button variant="ghost" size="sm">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

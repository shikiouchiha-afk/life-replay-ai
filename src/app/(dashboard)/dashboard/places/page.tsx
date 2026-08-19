'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MapPin, Plus, Map, Calendar, MessageCircle } from 'lucide-react';
import { useState } from 'react';

export default function PlacesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const places = [
    {
      id: '1',
      name: 'Coffee Shop on Main St',
      type: 'Cafe',
      visitCount: 12,
      lastVisited: '3 days ago',
      memories: 8,
    },
    {
      id: '2',
      name: 'San Francisco',
      type: 'City',
      visitCount: 5,
      lastVisited: '2 months ago',
      memories: 34,
    },
    {
      id: '3',
      name: 'Office - 123 Tech Blvd',
      type: 'Work',
      visitCount: 250,
      lastVisited: 'Today',
      memories: 67,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Places</h1>
          <p className="text-slate-400 mt-2">Locations connected to your memories</p>
        </div>
        <Button className="bg-gradient-to-r from-cyan-600 to-blue-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Place
        </Button>
      </div>

      {/* Search */}
      <Card className="border-slate-700 bg-slate-800/50">
        <div className="p-4 flex gap-3">
          <MapPin className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search places..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border-none text-white placeholder-slate-500 outline-none"
          />
        </div>
      </Card>

      {/* Map View Placeholder */}
      <Card className="border-slate-700 bg-slate-900/50 h-64 flex items-center justify-center">
        <div className="text-center">
          <Map className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500">Interactive map view coming soon</p>
        </div>
      </Card>

      {/* Places List */}
      <div className="space-y-4">
        {places.map((place) => (
          <Card
            key={place.id}
            className="border-slate-700 bg-slate-800/50 hover:bg-slate-800/70 transition-all"
          >
            <div className="p-6 flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-white">{place.name}</h3>
                <p className="text-sm text-slate-400 mt-1">{place.type}</p>
                <div className="flex gap-4 mt-4 text-sm">
                  <span className="text-slate-400">
                    Visited <span className="text-slate-300">{place.visitCount}</span>x
                  </span>
                  <span className="text-slate-400">
                    Last: <span className="text-slate-300">{place.lastVisited}</span>
                  </span>
                  <span className="text-slate-400">
                    Memories: <span className="text-slate-300">{place.memories}</span>
                  </span>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <MessageCircle className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

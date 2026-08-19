'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getCalendarEvents } from '@/lib/repositories/life-data';
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

export default function CalendarPage() {
  const [items, setItems] = useState<Awaited<ReturnType<typeof getCalendarEvents>>['data']>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 17));

  useEffect(() => {
    let active = true;

    getCalendarEvents(50)
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

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const days = Array.from({ length: daysInMonth(currentDate) }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth(currentDate) }, () => 0);

  const getEventsForDay = (day: number) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
    return items.filter((item) => item.event_date?.split('T')[0] === dateStr);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Calendar</h1>
          <p className="text-slate-400 mt-2">Events and important dates</p>
        </div>
        <Button className="bg-gradient-to-r from-cyan-600 to-blue-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>

      <Card className="border-slate-700 bg-slate-800/50 p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">{monthName}</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-slate-400 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {emptyDays.map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {days.map((day) => {
              const dayEvents = getEventsForDay(day);
              return (
                <div
                  key={day}
                  className="aspect-square p-2 bg-slate-900/50 rounded border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer"
                >
                  <div className="text-sm font-semibold text-white">{day}</div>
                  {dayEvents.length > 0 && <div className="text-xs text-cyan-400 mt-1">{dayEvents.length} event{dayEvents.length > 1 ? 's' : ''}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <Card className="border-slate-700 bg-slate-800/50">
        <div className="p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            Upcoming Events
          </h3>
          {loading ? (
            <div className="text-slate-400">Loading events...</div>
          ) : items.length === 0 ? (
            <div className="text-slate-400">No events scheduled yet.</div>
          ) : (
            <div className="space-y-3">
              {items.slice(0, 5).map((event) => (
                <div key={event.id} className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                  <p className="font-medium text-white">{event.title}</p>
                  <p className="text-sm text-slate-400 mt-1">
                    {event.event_date ? new Date(event.event_date).toLocaleDateString() : 'Flexible date'}
                    {event.start_time ? ` at ${event.start_time}` : ''}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

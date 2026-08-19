'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Upload, FileJson, Image, Calendar, BookOpen, Database } from 'lucide-react';

export default function ImportPage() {
  const importOptions = [
    {
      icon: Calendar,
      title: 'Calendar Events',
      description: 'Import from Google Calendar, Outlook, or iCal files',
      color: 'from-blue-500 to-purple-500',
    },
    {
      icon: Image,
      title: 'Photos',
      description: 'Import photos and albums from your device or cloud storage',
      color: 'from-pink-500 to-red-500',
    },
    {
      icon: BookOpen,
      title: 'Notes & Documents',
      description: 'Import from Notion, Evernote, or markdown files',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: FileJson,
      title: 'JSON Export',
      description: 'Import your data from other apps as JSON',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Database,
      title: 'Backup Restore',
      description: 'Restore from a previous Life Replay backup',
      color: 'from-cyan-500 to-blue-500',
    },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Import Data</h1>
        <p className="text-slate-400 mt-2">Bring your memories from other apps</p>
      </div>

      {/* Drag & Drop */}
      <Card className="border-slate-700 bg-slate-800/50">
        <div className="p-12 text-center border-2 border-dashed border-slate-700 rounded-lg">
          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-white font-medium mb-2">Drag & drop files here</p>
          <p className="text-sm text-slate-400 mb-4">or</p>
          <Button variant="outline">Browse Files</Button>
          <p className="text-xs text-slate-500 mt-4">
            Supported: JSON, CSV, JPEG, PNG, PDF (max 100MB)
          </p>
        </div>
      </Card>

      {/* Import Options */}
      <div>
        <h3 className="font-semibold text-white mb-4">Import from Services</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {importOptions.map((option, idx) => {
            const Icon = option.icon;
            return (
              <Card
                key={idx}
                className="border-slate-700 bg-slate-800/50 hover:bg-slate-800/70 transition-all cursor-pointer"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`p-3 rounded-lg bg-gradient-to-br ${option.color}`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-white mb-1">{option.title}</h4>
                  <p className="text-sm text-slate-400 mb-4">{option.description}</p>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Imports */}
      <Card className="border-slate-700 bg-slate-800/50">
        <div className="p-6">
          <h3 className="font-semibold text-white mb-4">Recent Imports</h3>
          <p className="text-sm text-slate-400">No imports yet. Start by uploading files.</p>
        </div>
      </Card>

      {/* FAQ */}
      <Card className="border-slate-700 bg-slate-800/50">
        <div className="p-6">
          <h3 className="font-semibold text-white mb-4">FAQ</h3>
          <div className="space-y-4">
            <div>
              <p className="font-medium text-slate-300">What data can I import?</p>
              <p className="text-sm text-slate-400 mt-1">
                You can import calendars, notes, photos, and any structured data from other apps.
              </p>
            </div>
            <div>
              <p className="font-medium text-slate-300">How long does import take?</p>
              <p className="text-sm text-slate-400 mt-1">
                Small files (under 10MB) typically complete in seconds.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

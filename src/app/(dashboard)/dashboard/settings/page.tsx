'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Bell, Lock, Eye, Database, Palette, Save } from 'lucide-react';

export default function SettingsPage() {
  const toggleSettings = [
    {
      icon: Bell,
      title: 'Email Notifications',
      description: 'Receive email digests and alerts',
      enabled: true,
    },
    {
      icon: Bell,
      title: 'Weekly Replay',
      description: 'Get AI-generated weekly summaries',
      enabled: true,
    },
    {
      icon: Eye,
      title: 'AI Processing',
      description: 'Allow AI to analyze your memories',
      enabled: true,
    },
    {
      icon: Database,
      title: 'Auto-Backup',
      description: 'Automatically backup your data',
      enabled: true,
    },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-2">Customize your experience</p>
      </div>

      {/* Preferences */}
      <Card className="border-slate-700 bg-slate-800/50">
        <div className="p-6">
          <h3 className="font-semibold text-white mb-4">Preferences</h3>
          <div className="space-y-4">
            {toggleSettings.map((setting) => {
              const Icon = setting.icon;
              return (
                <div
                  key={setting.title}
                  className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="font-medium text-white">{setting.title}</p>
                      <p className="text-xs text-slate-400">{setting.description}</p>
                    </div>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-700">
                    <span
                      className={`${
                        setting.enabled ? 'translate-x-6 bg-cyan-500' : 'translate-x-1 bg-slate-400'
                      } inline-block h-4 w-4 transform rounded-full transition`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Theme */}
      <Card className="border-slate-700 bg-slate-800/50">
        <div className="p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Appearance
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-slate-300 mb-3 block">Theme</label>
              <select className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm">
                <option>Dark (Default)</option>
                <option>Light</option>
                <option>Auto (System)</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-300 mb-3 block">Text Size</label>
              <select className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm">
                <option>Normal</option>
                <option>Larger</option>
                <option>Extra Large</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Privacy & Security */}
      <Card className="border-slate-700 bg-slate-800/50">
        <div className="p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Privacy & Security
          </h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Two-Factor Authentication
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Manage Sessions
            </Button>
          </div>
        </div>
      </Card>

      {/* Save */}
      <div className="flex gap-3">
        <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}

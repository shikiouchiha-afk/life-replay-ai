'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plug, Plus, AlertCircle, Check } from 'lucide-react';

export default function IntegrationsPage() {
  const integrations = [
    {
      name: 'Google Calendar',
      status: 'connected',
      lastSync: '2 hours ago',
      icon: '📅',
    },
    {
      name: 'Slack',
      status: 'connected',
      lastSync: '30 minutes ago',
      icon: '💬',
    },
    {
      name: 'Notion',
      status: 'disconnected',
      lastSync: null,
      icon: '📝',
    },
    {
      name: 'GitHub',
      status: 'disconnected',
      lastSync: null,
      icon: '🐙',
    },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Integrations</h1>
        <p className="text-slate-400 mt-2">Connect external services to Life Replay</p>
      </div>

      {/* Info */}
      <Card className="border-slate-700 bg-slate-800/30">
        <div className="p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-slate-300">
            Connect your favorite tools to automatically capture and sync data into your Life Graph.
          </p>
        </div>
      </Card>

      {/* Add Integration */}
      <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center gap-2">
        <Plus className="w-4 h-4" />
        Add Integration
      </Button>

      {/* Connected Services */}
      <div>
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Plug className="w-5 h-5" />
          Connected Services
        </h3>
        <div className="space-y-3">
          {integrations
            .filter((i) => i.status === 'connected')
            .map((integration) => (
              <Card
                key={integration.name}
                className="border-slate-700 bg-slate-800/50"
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{integration.icon}</span>
                    <div>
                      <p className="font-medium text-white">{integration.name}</p>
                      <p className="text-xs text-slate-400">
                        Synced {integration.lastSync}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-500" />
                    <Button variant="ghost" size="sm">
                      Manage
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      </div>

      {/* Available Services */}
      <div>
        <h3 className="font-semibold text-white mb-4">Available Integrations</h3>
        <div className="space-y-3">
          {integrations
            .filter((i) => i.status === 'disconnected')
            .map((integration) => (
              <Card
                key={integration.name}
                className="border-slate-700 bg-slate-800/50 hover:bg-slate-800/70 transition-all"
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{integration.icon}</span>
                    <p className="font-medium text-white">{integration.name}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}

'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Lock, Eye, Trash2, Download, AlertCircle } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Privacy & Data</h1>
        <p className="text-slate-400 mt-2">Manage your privacy and data settings</p>
      </div>

      {/* Privacy Statement */}
      <Card className="border-cyan-500/50 bg-cyan-900/20">
        <div className="p-6">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-white mb-2">Your data is private by default</p>
              <p className="text-sm text-slate-300">
                All your memories are encrypted end-to-end. No one, including us, can read
                your personal data without your permission.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Encryption */}
      <Card className="border-slate-700 bg-slate-800/50">
        <div className="p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Data Encryption
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
              <p className="text-sm text-white font-medium">End-to-End Encryption</p>
              <p className="text-xs text-slate-400 mt-1">✓ Enabled</p>
            </div>
            <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
              <p className="text-sm text-white font-medium">Transport Security</p>
              <p className="text-xs text-slate-400 mt-1">✓ TLS 1.3</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Data Visibility */}
      <Card className="border-slate-700 bg-slate-800/50">
        <div className="p-6">
          <h3 className="font-semibold text-white mb-4">What can AI see?</h3>
          <div className="space-y-3">
            {[
              { item: 'Your memories and journals', enabled: true },
              { item: 'Your goals and projects', enabled: true },
              { item: 'Calendar events', enabled: false },
              { item: 'Location data', enabled: false },
            ].map((permission, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                <span className="text-sm text-slate-300">{permission.item}</span>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-700">
                  <span
                    className={`${
                      permission.enabled ? 'translate-x-6 bg-cyan-500' : 'translate-x-1 bg-slate-400'
                    } inline-block h-4 w-4 transform rounded-full transition`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Data Management */}
      <Card className="border-slate-700 bg-slate-800/50">
        <div className="p-6">
          <h3 className="font-semibold text-white mb-4">Data Management</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-2">
              <Download className="w-4 h-4" />
              Download Your Data
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <AlertCircle className="w-4 h-4" />
              Request Data Deletion
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 border-red-500/50 text-red-400 hover:bg-red-900/20"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account & All Data
            </Button>
          </div>
        </div>
      </Card>

      {/* Third-Party Access */}
      <Card className="border-slate-700 bg-slate-800/50">
        <div className="p-6">
          <h3 className="font-semibold text-white mb-4">Third-Party Access</h3>
          <div className="space-y-3">
            <p className="text-sm text-slate-400 mb-4">
              Control which connected services can access your data
            </p>
            {['Google Calendar', 'Slack', 'Notion'].map((service) => (
              <div key={service} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                <span className="text-sm text-slate-300">{service}</span>
                <Button variant="ghost" size="sm">
                  Revoke
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Privacy Policy */}
      <Card className="border-slate-700 bg-slate-800/50">
        <div className="p-6 text-center">
          <p className="text-sm text-slate-400 mb-4">
            Read our full privacy policy and terms of service
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="ghost" size="sm">
              Privacy Policy
            </Button>
            <Button variant="ghost" size="sm">
              Terms of Service
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

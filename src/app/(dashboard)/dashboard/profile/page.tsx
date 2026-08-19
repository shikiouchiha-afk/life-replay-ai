'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { User, Mail, MapPin, Link as LinkIcon, Save } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Profile</h1>
        <p className="text-slate-400 mt-2">Manage your personal information</p>
      </div>

      {/* Avatar Section */}
      <Card className="border-slate-700 bg-slate-800/50">
        <div className="p-6">
          <h3 className="font-semibold text-white mb-4">Profile Picture</h3>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <Button variant="outline" size="sm">
                Upload Photo
              </Button>
              <p className="text-xs text-slate-500 mt-2">
                Recommended: Square image, at least 400x400px
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Personal Info */}
      <Card className="border-slate-700 bg-slate-800/50">
        <div className="p-6">
          <h3 className="font-semibold text-white mb-4">Personal Information</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                defaultValue="Raphael Morgan"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                defaultValue="raphael@example.com"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                defaultValue="AI enthusiast. Building Life Replay. Always learning."
                className="w-full mt-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm min-h-20"
              />
            </div>
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <select className="w-full mt-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm">
                <option>Pacific Time (PT)</option>
                <option>Mountain Time (MT)</option>
                <option>Central Time (CT)</option>
                <option>Eastern Time (ET)</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Social Links */}
      <Card className="border-slate-700 bg-slate-800/50">
        <div className="p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <LinkIcon className="w-5 h-5" />
            Social Links
          </h3>
          <div className="space-y-3">
            {['Twitter', 'LinkedIn', 'Website'].map((platform) => (
              <Input
                key={platform}
                placeholder={`Your ${platform} URL`}
                className="text-sm"
              />
            ))}
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
        <Button variant="outline">Cancel</Button>
      </div>
    </div>
  );
}

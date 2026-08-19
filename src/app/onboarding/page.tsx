'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Brain, Heart, Zap, BarChart3, Lock, Zap as Lightning } from 'lucide-react';

export default function OnboardingPage() {
  const [step, setStep] = useState(0);

  const features = [
    {
      icon: Heart,
      title: 'Capture Everything',
      description: 'Save memories, ideas, goals, decisions, and journal entries. AI automatically organizes them.',
    },
    {
      icon: Brain,
      title: 'Universal Search',
      description: 'Search across your entire life database with natural language. Find anything instantly.',
    },
    {
      icon: Zap,
      title: 'AI-Powered Insights',
      description: 'Discover patterns, connections, and insights about yourself automatically.',
    },
    {
      icon: BarChart3,
      title: 'Timeline Replay',
      description: 'Replay any day, week, month, or year with AI-generated summaries and insights.',
    },
    {
      icon: Lock,
      title: 'Complete Privacy',
      description: 'Your data stays yours. No algorithms mine your memories. Encrypted and secure.',
    },
    {
      icon: Lightning,
      title: 'Ask Your Life',
      description: 'Question your own history. Get grounded answers from your actual memories.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Brain className="w-10 h-10 text-cyan-400" />
            <h1 className="text-5xl font-bold text-white">Life Replay</h1>
          </div>
          <p className="text-xl text-slate-300 mb-4">
            Your personal AI operating system for life
          </p>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Transform how you remember, understand, and navigate your life. Capture everything, understand yourself deeply, and make better decisions.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="border-slate-700 bg-slate-800/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all"
              >
                <div className="p-6">
                  <Icon className="w-8 h-8 text-cyan-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-sm">{feature.description}</p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Quick setup */}
        <Card className="border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm max-w-2xl mx-auto">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Get Started in Minutes</h2>

            <div className="space-y-6">
              {[
                {
                  number: '1',
                  title: 'Capture Your First Memory',
                  description: 'Start saving thoughts, ideas, and moments. You can do this anywhere, anytime.',
                },
                {
                  number: '2',
                  title: 'Let AI Organize',
                  description: 'AI automatically categorizes, tags, and connects your information.',
                },
                {
                  number: '3',
                  title: 'Explore & Discover',
                  description: 'Search, replay, and discover patterns about yourself.',
                },
              ].map((item) => (
                <div key={item.number} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold">
                      {item.number}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-slate-400 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button className="w-full mt-8 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700">
              Begin Your Replay
            </Button>
          </div>
        </Card>

        {/* Privacy note */}
        <div className="text-center mt-12">
          <Lock className="w-5 h-5 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">
            Your memories are encrypted and private. Only you can access your data.
          </p>
        </div>
      </div>
    </div>
  );
}

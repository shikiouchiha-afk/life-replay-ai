'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Zap, Check, ArrowRight, Sparkles } from 'lucide-react';

export default function UpgradePage() {
  const features = [
    { name: 'Memory Limit', free: '100/month', pro: 'Unlimited', enterprise: 'Unlimited' },
    { name: 'Storage', free: '1 GB', pro: '100 GB', enterprise: 'Unlimited' },
    { name: 'AI Insights', free: 'Limited', pro: 'Advanced', enterprise: 'Premium' },
    { name: 'Search', free: 'Basic', pro: 'Semantic', enterprise: 'AI-Powered' },
    { name: 'Life Map', free: '❌', pro: '✓', enterprise: '✓' },
    { name: 'API Access', free: '❌', pro: '❌', enterprise: '✓' },
    { name: 'Support', free: 'Community', pro: 'Priority', enterprise: 'Dedicated' },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-yellow-500" />
          Upgrade to Pro
        </h1>
        <p className="text-slate-400 mt-2">Unlock the full power of Life Replay</p>
      </div>

      {/* Promo */}
      <Card className="border-cyan-500/50 bg-gradient-to-r from-cyan-900/40 to-blue-900/40 p-8">
        <div className="text-center">
          <p className="text-sm font-semibold text-cyan-400 mb-2">LIMITED TIME OFFER</p>
          <p className="text-2xl font-bold text-white">First month 50% off</p>
          <p className="text-slate-300 mt-2">
            Start your unlimited Life Replay journey for just $6
          </p>
        </div>
      </Card>

      {/* Comparison Table */}
      <Card className="border-slate-700 bg-slate-800/50 overflow-x-auto">
        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 font-semibold text-white">Features</th>
                <th className="text-center py-3 px-4 font-semibold text-white">Free</th>
                <th className="text-center py-3 px-4 font-semibold text-white">
                  <span className="text-cyan-400">Pro</span>
                </th>
                <th className="text-center py-3 px-4 font-semibold text-white">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, idx) => (
                <tr key={idx} className="border-b border-slate-700">
                  <td className="py-3 px-4 text-slate-300">{feature.name}</td>
                  <td className="text-center py-3 px-4 text-slate-400 text-sm">
                    {feature.free}
                  </td>
                  <td className="text-center py-3 px-4 text-cyan-400 text-sm font-medium">
                    {feature.pro}
                  </td>
                  <td className="text-center py-3 px-4 text-slate-400 text-sm">
                    {feature.enterprise}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Benefits */}
      <Card className="border-slate-700 bg-slate-800/50">
        <div className="p-6">
          <h3 className="font-semibold text-white mb-4">Why upgrade?</h3>
          <ul className="space-y-3">
            {[
              'Capture unlimited memories and never hit limits',
              'Access AI-powered insights and predictions',
              'Use semantic search to find anything instantly',
              'Visualize your Life Map with powerful connections',
              'Get priority email and chat support',
              'Export and backup all your data',
            ].map((benefit) => (
              <li key={benefit} className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pro Card */}
        <Card className="border-cyan-500/50 bg-gradient-to-br from-cyan-900/20 to-blue-900/20">
          <div className="p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
            <p className="text-4xl font-bold text-cyan-400 mb-1">
              $12
              <span className="text-lg text-slate-400">/month</span>
            </p>
            <p className="text-sm text-slate-400 mb-6">First month: $6</p>
            <Button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 mb-6">
              Upgrade Now
            </Button>
            <p className="text-xs text-slate-500">Annual: $120/year (save 20%)</p>
          </div>
        </Card>

        {/* Enterprise Card */}
        <Card className="border-slate-700 bg-slate-800/50">
          <div className="p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
            <p className="text-3xl font-bold text-white mb-1">Custom</p>
            <p className="text-sm text-slate-400 mb-6">For teams and organizations</p>
            <Button variant="outline" className="w-full">
              Contact Sales
            </Button>
          </div>
        </Card>
      </div>

      {/* FAQ */}
      <Card className="border-slate-700 bg-slate-800/50">
        <div className="p-6">
          <h3 className="font-semibold text-white mb-4">FAQ</h3>
          <div className="space-y-4">
            <div>
              <p className="font-medium text-white">Can I cancel anytime?</p>
              <p className="text-sm text-slate-400 mt-1">
                Yes, you can cancel your subscription at any time with no questions asked.
              </p>
            </div>
            <div>
              <p className="font-medium text-white">Do you offer annual discounts?</p>
              <p className="text-sm text-slate-400 mt-1">
                Yes! Save 20% when you pay annually ($120/year instead of $144).
              </p>
            </div>
            <div>
              <p className="font-medium text-white">What happens to my free account?</p>
              <p className="text-sm text-slate-400 mt-1">
                Your Pro features activate immediately. Cancel anytime to go back to Free.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

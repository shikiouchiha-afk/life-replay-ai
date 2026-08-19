'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CreditCard, Check, ArrowRight } from 'lucide-react';

export default function BillingPage() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'Forever',
      current: true,
      features: [
        '100 memories per month',
        '1 GB storage',
        'Basic search',
        'Community support',
      ],
    },
    {
      name: 'Pro',
      price: '$12',
      period: '/month',
      current: false,
      features: [
        'Unlimited memories',
        '100 GB storage',
        'Advanced AI search',
        'Priority support',
        'Private insights',
        'Life Map access',
      ],
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'Contact us',
      current: false,
      features: [
        'Everything in Pro',
        'Team features',
        'API access',
        'White-label options',
        'Dedicated support',
        'Custom integrations',
      ],
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Billing</h1>
        <p className="text-slate-400 mt-2">Manage your subscription and billing</p>
      </div>

      {/* Current Plan */}
      <Card className="border-slate-700 bg-slate-800/50">
        <div className="p-6">
          <h3 className="font-semibold text-white mb-4">Current Plan</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-white">Free Plan</p>
              <p className="text-slate-400 mt-1">You're on a free trial. Upgrade anytime.</p>
            </div>
            <Button className="bg-gradient-to-r from-cyan-600 to-blue-600">
              Upgrade Now
            </Button>
          </div>
        </div>
      </Card>

      {/* Billing Plans */}
      <div>
        <h3 className="font-semibold text-white mb-4">Pricing Plans</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`border-slate-700 ${
                plan.current
                  ? 'bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border-cyan-500/50'
                  : 'bg-slate-800/50'
              }`}
            >
              <div className="p-6">
                {plan.current && (
                  <span className="px-3 py-1 bg-cyan-500/20 text-xs font-semibold text-cyan-400 rounded-full mb-4 inline-block">
                    Current Plan
                  </span>
                )}
                <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                <p className="text-3xl font-bold text-white mb-1">{plan.price}</p>
                <p className="text-sm text-slate-400 mb-6">{plan.period}</p>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-1" />
                      <span className="text-sm text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.current ? 'outline' : 'primary'}
                  className="w-full flex items-center justify-center gap-2"
                >
                  {plan.current ? 'Current Plan' : 'Upgrade'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <Card className="border-slate-700 bg-slate-800/50">
        <div className="p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Method
          </h3>
          <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700 mb-4">
            <p className="text-sm text-slate-400 mb-2">Visa ending in 4242</p>
            <p className="text-xs text-slate-500">Expires 12/26</p>
          </div>
          <Button variant="outline" size="sm">
            Update Payment Method
          </Button>
        </div>
      </Card>

      {/* Billing History */}
      <Card className="border-slate-700 bg-slate-800/50">
        <div className="p-6">
          <h3 className="font-semibold text-white mb-4">Billing History</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
              <div>
                <p className="text-sm text-white">August 2026</p>
                <p className="text-xs text-slate-500">Free Plan</p>
              </div>
              <span className="text-sm font-semibold text-slate-300">$0.00</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

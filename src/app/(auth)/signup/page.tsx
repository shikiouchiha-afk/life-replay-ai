'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/db/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card } from '@/components/ui/Card';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationRequired, setConfirmationRequired] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', fullName: '' });

  useEffect(() => {
    let active = true;
    const client = getSupabaseClient();

    if (!client) return;

    client.auth.getUser().then(({ data: { user } }) => {
      if (active && user) router.replace('/dashboard');
    });

    return () => {
      active = false;
    };
  }, [router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setConfirmationRequired(false);
    setLoading(true);

    try {
      const client = getSupabaseClient();
      if (!client) {
        setError('Supabase is not configured');
        return;
      }

      const { data, error: signUpError } = await client.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { full_name: formData.fullName } },
      });

      if (signUpError) {
        setError(signUpError.message || 'Failed to create your account');
        return;
      }

      if (data.session) {
        router.replace('/onboarding');
      } else {
        setConfirmationRequired(true);
      }
    } catch (signupError) {
      setError(signupError instanceof Error ? signupError.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="p-8 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Create your account</h1>
            <p className="text-slate-400 mt-2">Start building your private life intelligence layer.</p>
          </div>

          {error && (
            <div className="flex gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {confirmationRequired && (
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-sm text-cyan-200">
              Check your email to confirm your account, then return to sign in.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullName" className="text-slate-300">Name</Label>
              <Input id="fullName" value={formData.fullName} onChange={(event) => setFormData({ ...formData, fullName: event.target.value })} disabled={loading} className="mt-1" required />
            </div>
            <div>
              <Label htmlFor="email" className="text-slate-300">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} disabled={loading} className="mt-1" required />
            </div>
            <div>
              <Label htmlFor="password" className="text-slate-300">Password</Label>
              <Input id="password" type="password" placeholder="At least 6 characters" minLength={6} value={formData.password} onChange={(event) => setFormData({ ...formData, password: event.target.value })} disabled={loading} className="mt-1" required />
            </div>
            <Button type="submit" disabled={loading} className="w-full mt-6">
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating Account...</> : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="text-cyan-400 hover:text-cyan-300">Sign in</Link>
          </p>
        </div>
      </Card>
    </div>
  );
}

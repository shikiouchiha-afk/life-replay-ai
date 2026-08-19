'use server';

import { requireSupabaseClient, supabase } from '@/lib/db/supabase';
import { ProfileInsert, ProfileUpdate } from '@/types/database';

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(email: string, password: string, fullName?: string) {
  try {
    const client = supabase ?? requireSupabaseClient();

    // Create auth account
    const { data: authData, error: authError } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || '',
        },
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Failed to create user account');

    return {
      success: true,
      user: authData.user,
      session: authData.session,
    };
  } catch (error) {
    console.error('Error signing up:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string) {
  try {
    const client = supabase ?? requireSupabaseClient();
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return {
      success: true,
      user: data.user,
      session: data.session,
    };
  } catch (error) {
    console.error('Error signing in:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  try {
    const client = supabase ?? requireSupabaseClient();
    const { error } = await client.auth.signOut();
    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string) {
  try {
    const client = supabase ?? requireSupabaseClient();
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
    });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error sending reset email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Reset password with token
 */
export async function resetPassword(password: string) {
  try {
    const client = supabase ?? requireSupabaseClient();
    const { error } = await client.auth.updateUser({
      password,
    });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error resetting password:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Update user profile
 */
export async function updateProfile(userId: string, data: ProfileUpdate) {
  try {
    const client = supabase ?? requireSupabaseClient();
    const { data: profile, error } = await client
      .from('profiles')
      .update(data)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data: profile };
  } catch (error) {
    console.error('Error updating profile:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get current user profile
 */
export async function getCurrentUserProfile(userId: string) {
  try {
    const client = supabase ?? requireSupabaseClient();
    const { data: profile, error } = await client
      .from('profiles')
      .select(
        `
        *,
        subscriptions(*),
        user_settings(*)
      `
      )
      .eq('id', userId)
      .single();

    if (error) throw error;

    return { success: true, data: profile };
  } catch (error) {
    console.error('Error fetching profile:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check if email exists
 */
export async function checkEmailExists(email: string) {
  try {
    const client = supabase ?? requireSupabaseClient();
    const { data, error } = await client
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return {
      success: true,
      exists: !!data,
    };
  } catch (error) {
    console.error('Error checking email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      exists: false,
    };
  }
}

/**
 * Delete user account (irreversible)
 */
export async function deleteUserAccount(userId: string) {
  try {
    const client = supabase ?? requireSupabaseClient();
    // Delete all user data (cascading)
    await client.from('profiles').delete().eq('id', userId);

    // Delete auth user
    // Note: This typically requires admin access
    // Users should request account deletion through support

    return { success: true };
  } catch (error) {
    console.error('Error deleting account:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get user's subscription
 */
export async function getSubscription(userId: string) {
  try {
    const client = supabase ?? requireSupabaseClient();
    const { data: subscription, error } = await client
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    return {
      success: true,
      data: subscription,
    };
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check if user is on free plan
 */
export async function isUserOnFreePlan(userId: string) {
  const result = await getSubscription(userId);
  if (!result.success) return false;
  return result.data?.plan === 'free';
}

/**
 * Check if user is on paid plan
 */
export async function isUserOnPaidPlan(userId: string) {
  const result = await getSubscription(userId);
  if (!result.success) return false;
  return result.data?.plan === 'pro' || result.data?.plan === 'ultra';
}

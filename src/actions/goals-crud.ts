'use server';

import { getSupabaseClient, requireSupabaseClient } from '@/lib/db/supabase';

export type CreateGoalInput = {
  title: string;
  description?: string;
  status?: 'active' | 'completed' | 'paused' | 'archived';
  progress?: number;
  target_date?: string;
  category?: string;
};

export type UpdateGoalInput = {
  id: string;
  title?: string;
  description?: string;
  status?: 'active' | 'completed' | 'paused' | 'archived';
  progress?: number;
  target_date?: string;
  category?: string;
};

export async function createGoal(input: CreateGoalInput) {
  const supabase = getSupabaseClient() ?? requireSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  try {
    const { data, error } = await supabase
      .from('goals')
      .insert({
        user_id: user.id,
        title: input.title,
        description: input.description || null,
        status: input.status || 'active',
        progress: input.progress || 0,
        target_date: input.target_date || null,
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create goal';
    return { success: false, error: message, data: null };
  }
}

export async function updateGoal(input: UpdateGoalInput) {
  const supabase = getSupabaseClient() ?? requireSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  try {
    const { data, error } = await supabase
      .from('goals')
      .update({
        ...(input.title && { title: input.title }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.status && { status: input.status }),
        ...(input.progress !== undefined && { progress: input.progress }),
        ...(input.target_date && { target_date: input.target_date }),
      })
      .eq('id', input.id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update goal';
    return { success: false, error: message, data: null };
  }
}

export async function deleteGoal(id: string) {
  const supabase = getSupabaseClient() ?? requireSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  try {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete goal';
    return { success: false, error: message };
  }
}

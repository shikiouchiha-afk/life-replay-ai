'use server';

import { getSupabaseClient, requireSupabaseClient } from '@/lib/db/supabase';

export type CreateDecisionInput = {
  title: string;
  reasoning?: string;
  status?: 'pending' | 'decided' | 'executed' | 'reviewed';
  decision_date?: string;
};

export type UpdateDecisionInput = {
  id: string;
  title?: string;
  reasoning?: string;
  status?: 'pending' | 'decided' | 'executed' | 'reviewed';
  decision_date?: string;
};

export async function createDecision(input: CreateDecisionInput) {
  const supabase = getSupabaseClient() ?? requireSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  try {
    const { data, error } = await supabase
      .from('decisions')
      .insert({
        user_id: user.id,
        title: input.title,
        reasoning: input.reasoning || null,
        status: input.status || 'pending',
        decision_date: input.decision_date || new Date().toISOString().split('T')[0],
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create decision';
    return { success: false, error: message, data: null };
  }
}

export async function updateDecision(input: UpdateDecisionInput) {
  const supabase = getSupabaseClient() ?? requireSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  try {
    const { data, error } = await supabase
      .from('decisions')
      .update({
        ...(input.title && { title: input.title }),
        ...(input.reasoning !== undefined && { reasoning: input.reasoning }),
        ...(input.status && { status: input.status }),
        ...(input.decision_date && { decision_date: input.decision_date }),
      })
      .eq('id', input.id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update decision';
    return { success: false, error: message, data: null };
  }
}

export async function deleteDecision(id: string) {
  const supabase = getSupabaseClient() ?? requireSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  try {
    const { error } = await supabase
      .from('decisions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete decision';
    return { success: false, error: message };
  }
}

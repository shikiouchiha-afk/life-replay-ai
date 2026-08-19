'use server';

import { getSupabaseClient, requireSupabaseClient } from '@/lib/db/supabase';

export type CreateMemoryInput = {
  title: string;
  summary?: string;
  raw_content?: string;
  event_date?: string;
  importance?: string;
  tags?: string[];
};

export type UpdateMemoryInput = {
  id: string;
  title?: string;
  summary?: string;
  raw_content?: string;
  event_date?: string;
  importance?: string;
  tags?: string[];
};

export async function createMemory(input: CreateMemoryInput) {
  const supabase = getSupabaseClient() ?? requireSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  try {
    const { data, error } = await supabase
      .from('memories')
      .insert({
        user_id: user.id,
        title: input.title,
        summary: input.summary || null,
        raw_content: input.raw_content || null,
        event_date: input.event_date || null,
        importance: input.importance || null,
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create memory';
    return { success: false, error: message, data: null };
  }
}

export async function updateMemory(input: UpdateMemoryInput) {
  const supabase = getSupabaseClient() ?? requireSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  try {
    const { data, error } = await supabase
      .from('memories')
      .update({
        ...(input.title && { title: input.title }),
        ...(input.summary && { summary: input.summary }),
        ...(input.raw_content && { raw_content: input.raw_content }),
        ...(input.event_date && { event_date: input.event_date }),
        ...(input.importance && { importance: input.importance }),
      })
      .eq('id', input.id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update memory';
    return { success: false, error: message, data: null };
  }
}

export async function deleteMemory(id: string) {
  const supabase = getSupabaseClient() ?? requireSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  try {
    const { error } = await supabase
      .from('memories')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete memory';
    return { success: false, error: message };
  }
}

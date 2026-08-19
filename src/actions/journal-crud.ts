'use server';

import { getSupabaseClient, requireSupabaseClient } from '@/lib/db/supabase';

export type CreateJournalEntryInput = {
  title?: string;
  content: string;
  entry_date?: string;
  mood?: string;
  tags?: string[];
};

export type UpdateJournalEntryInput = {
  id: string;
  title?: string;
  content?: string;
  entry_date?: string;
  mood?: string;
  tags?: string[];
};

export async function createJournalEntry(input: CreateJournalEntryInput) {
  const supabase = getSupabaseClient() ?? requireSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: user.id,
        title: input.title || null,
        content: input.content,
        entry_date: input.entry_date || new Date().toISOString().split('T')[0],
        mood: input.mood || null,
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create journal entry';
    return { success: false, error: message, data: null };
  }
}

export async function updateJournalEntry(input: UpdateJournalEntryInput) {
  const supabase = getSupabaseClient() ?? requireSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .update({
        ...(input.title !== undefined && { title: input.title }),
        ...(input.content && { content: input.content }),
        ...(input.entry_date && { entry_date: input.entry_date }),
        ...(input.mood !== undefined && { mood: input.mood }),
      })
      .eq('id', input.id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update journal entry';
    return { success: false, error: message, data: null };
  }
}

export async function deleteJournalEntry(id: string) {
  const supabase = getSupabaseClient() ?? requireSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  try {
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete journal entry';
    return { success: false, error: message };
  }
}

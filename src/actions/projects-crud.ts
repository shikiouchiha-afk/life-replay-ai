'use server';

import { getSupabaseClient, requireSupabaseClient } from '@/lib/db/supabase';

export type CreateProjectInput = {
  name: string;
  description?: string;
  status?: 'planning' | 'in-progress' | 'on-hold' | 'completed' | 'archived';
  progress?: number;
  target_date?: string;
  category?: string;
};

export type UpdateProjectInput = {
  id: string;
  name?: string;
  description?: string;
  status?: 'planning' | 'in-progress' | 'on-hold' | 'completed' | 'archived';
  progress?: number;
  target_date?: string;
  category?: string;
};

export async function createProject(input: CreateProjectInput) {
  const supabase = getSupabaseClient() ?? requireSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        name: input.name,
        description: input.description || null,
        status: input.status || 'planning',
        progress: input.progress || 0,
        target_date: input.target_date || null,
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create project';
    return { success: false, error: message, data: null };
  }
}

export async function updateProject(input: UpdateProjectInput) {
  const supabase = getSupabaseClient() ?? requireSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .update({
        ...(input.name && { name: input.name }),
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
    const message = error instanceof Error ? error.message : 'Failed to update project';
    return { success: false, error: message, data: null };
  }
}

export async function deleteProject(id: string) {
  const supabase = getSupabaseClient() ?? requireSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete project';
    return { success: false, error: message };
  }
}

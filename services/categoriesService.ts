import { createClient } from '@/utils/supabase/client';
import { Category } from '@/types/models';
import { authService } from './authService';

export const categoriesService = {
  async getAll(): Promise<any[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const { data, error } = await supabase
      .from('categories')
      .select('*, reminders(id, is_done, title, status, description, location_id, created_at)')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  async create(category: Omit<Category, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Category> {
    const supabase = createClient();
    const user = await authService.getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('categories')
      .insert({ ...category, user_id: user.id })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Category;
  },

  async update(id: string, updates: Partial<Omit<Category, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<Category> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id || '')
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Category;
  },

  async delete(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id || '');

    if (error) throw new Error(error.message);
  }
};



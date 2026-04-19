import { createClient } from '@/utils/supabase/client';
import { Reminder, InsertReminder, UpdateReminder } from '@/types/models';

export const remindersService = {
  async getAll(): Promise<Reminder[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('reminders')
      .select('*, category:categories(*), location:locations(*)')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data as any as Reminder[];
  },

  async create(reminder: InsertReminder): Promise<Reminder> {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('reminders')
      .insert({ ...reminder, user_id: userData.user.id })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as any as Reminder;
  },

  async createWithLocation(
    reminderData: Omit<InsertReminder, 'location_id' | 'user_id'>, 
    locationData: { name: string, address?: string, lat: number, lng: number, radius: number }
  ): Promise<Reminder> {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Not authenticated');

    // 1. Insert Location
    const { data: locData, error: locError } = await supabase
      .from('locations')
      .insert({ ...locationData, user_id: userData.user.id })
      .select()
      .single();

    if (locError) throw new Error(`Failed to create location: ${locError.message}`);

    // 2. Insert Reminder
    const { data: remData, error: remError } = await supabase
      .from('reminders')
      .insert({ ...reminderData, location_id: locData.id, user_id: userData.user.id })
      .select()
      .single();

    if (remError) throw new Error(`Failed to create reminder: ${remError.message}`);

    return remData as any as Reminder;
  },

  async update(id: string, payload: UpdateReminder): Promise<Reminder> {        
    const supabase = createClient();
    const { data, error } = await supabase
      .from('reminders')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as any as Reminder;
  },

  async archive(id: string): Promise<void> {
    const supabase = createClient();
    const now = new Date().toISOString();
    const { error } = await supabase
      .from('reminders')
      .update({ deleted_at: now, updated_at: now })
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  async restore(id: string, is_done: boolean): Promise<void> {
    const supabase = createClient();
    const now = new Date().toISOString();
    const { error } = await supabase
      .from('reminders')
      .update({ status: is_done ? 'Done' : 'Active', deleted_at: null, updated_at: now })
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  async delete(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from('reminders')
      .delete()
      .eq('id', id)
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id || '');

    if (error) throw new Error(error.message);
  }
};



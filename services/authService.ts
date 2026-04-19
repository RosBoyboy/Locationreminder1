import { createClient } from '@/utils/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export const authService = {
  async signUpWithEmail(email: string, password: string, fullName?: string) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });
    if (error) throw error;
    return data;
  },

  async signInWithEmail(email: string, password: string) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async getCurrentUser(): Promise<User | null> {
    const supabase = createClient();
    const { data: { session }, error } = await supabase.auth.getSession();      
    if (error) {
      console.error('Error fetching session:', error.message);
      throw new Error(error.message);
    }
    return session?.user ?? null;
  },

  onAuthStateChange(callback: (session: Session | null) => void) {
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => callback(session)
    );
    return subscription;
  },

  async signOut(): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
};


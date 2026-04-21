import { createClient } from '@/utils/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export function isInvalidRefreshTokenError(error: any) {
  return typeof error?.message === 'string' && (
    error.message.toLowerCase().includes('invalid refresh token') ||
    error.message.toLowerCase().includes('refresh token not found') ||
    error.message.toLowerCase().includes('refresh token')
  );
}

export async function clearStaleAuthSession() {
  const supabase = createClient();
  await supabase.auth.signOut().catch(() => {});

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem('supabase.auth.token');
    } catch {
      // ignore storage cleanup failures
    }
  }
}

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
      if (isInvalidRefreshTokenError(error)) {
        await clearStaleAuthSession();
        return null;
      }
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
  },

  async verifyPassword(password: string) {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.email) throw new Error("No user email to verify password");
    const { error } = await supabase.auth.signInWithPassword({
        email: session.user.email,
        password
    });
    if (error) throw new Error("Incorrect current password.");
    return true;
  },

  async updateUser(updates: any) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.updateUser(updates);
    if (error) throw error;
    return data.user;
  }
};


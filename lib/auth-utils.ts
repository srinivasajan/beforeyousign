/**
 * Client-side authentication utilities
 * Provides hooks and helpers for managing auth state via Supabase
 */

'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User as SupabaseUserType } from '@supabase/supabase-js';

export interface User {
  id: string;
  name?: string;
  email?: string;
  image?: string;
}

export type { SupabaseUserType as SupabaseUser }; // Alias for clarity if needed, though we are hiding Supabase User

export interface Session {
  user: User;
  expires: string;
}

/**
 * Client-side hook to get current session
 */
export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const mapUser = (supabaseUser: SupabaseUserType): User => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
      name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || undefined,
      image: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.image || undefined,
    };
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (initialSession) {
        setSession({
          user: mapUser(initialSession.user),
          expires: initialSession.expires_at?.toString() || '',
        });
      }
      setLoading(false);
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (newSession) {
        setSession({
          user: mapUser(newSession.user),
          expires: newSession.expires_at?.toString() || '',
        });
      } else {
        setSession(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  return { session, loading };
}

/**
 * Helper to check if user is authenticated
 */
export function useAuth() {
  const { session, loading } = useSession();

  return {
    user: session?.user || null,
    isAuthenticated: !!session,
    isLoading: loading,
  };
}

/**
 * Sign out helper
 */
export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  window.location.href = '/auth/signin';
}

/**
 * Register new user
 */
export async function register(data: {
  name: string;
  email: string;
  password: string;
}) {
  const supabase = createClient();
  const { data: result, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.name,
      },
    },
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true, user: result.user ? {
      id: result.user.id,
      email: result.user.email,
      name: result.user.user_metadata?.full_name,
    } : null
  };
}

/**
 * Get user initials for avatar
 */
export function getUserInitials(name?: string | null): string {
  if (!name) return '?';

  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

/**
 * Protected route wrapper - redirects to sign in if not authenticated
 */
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/auth/signin?callbackUrl=' + window.location.pathname;
    }
  }, [isLoading, isAuthenticated]);

  return { isAuthenticated, isLoading };
}


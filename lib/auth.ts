import { supabase } from './supabase';

/**
 * Get the current authenticated user
 */
export async function getCurrentUser() {
  try {
    // First check if we have a session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return null;
    }

    // If we have a session, get the user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error('Error getting current user:', userError);
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
}

/**
 * Check if the current user is an admin
 * This checks if a user exists in the users table
 * If the is_admin() RPC function doesn't exist, this falls back to checking the users table
 */
export async function checkIsAdmin(): Promise<boolean> {
  const user = await getCurrentUser();

  if (!user) {
    return false;
  }

  try {
    // Try using the RPC function first
    const { data: rpcData, error: rpcError } = await supabase
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .rpc('is_admin', { user_id: user.id } as any);

    if (!rpcError && rpcData !== null) {
      return rpcData === true;
    }

    // Fallback: Check users table directly
    // This assumes you have a users table with the user's ID
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    if (userError) {
      console.error('Error checking users table:', userError);
      // If user is in auth but not in users table, they're not an admin
      return false;
    }

    // If user exists in users table, they're an admin
    return userData !== null;
  } catch (error) {
    console.error('Error in checkIsAdmin:', error);
    return false;
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/admin/auth/callback`,
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/admin/reset-password`,
  });

  if (error) {
    throw error;
  }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

/**
 * Check if user is authenticated (has valid session)
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

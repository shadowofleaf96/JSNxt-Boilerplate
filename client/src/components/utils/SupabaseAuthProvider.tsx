'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { fetchCurrentUser, setUser } from '@/redux/user/usersSlice';
import { createClient } from '@/utils/supabase/client';

export function SupabaseAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const supabase = createClient();

    // Initial check
    dispatch(fetchCurrentUser());

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event) => {
      console.log('Supabase Auth Event:', event);
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        dispatch(fetchCurrentUser());
      } else if (event === 'SIGNED_OUT') {
        dispatch(setUser(null));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  return <>{children}</>;
}

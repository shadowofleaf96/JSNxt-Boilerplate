import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User, CurrentUser } from '@/types/user';
import { createClient } from '@/utils/supabase/client';

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  loggedInUser: string | null;
  currentUser: CurrentUser | null;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
  loggedInUser: null,
  currentUser: null,
};

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw error;
  return data;
});

export const addUser = createAsyncThunk(
  'users/addUser',
  async (userData: any) => {
    const supabase = createClient();
    // Support for FormData might be tricky directly,
    // but for simple user creation we can use RPC or insert.
    // Given we are migrating, we should probably use supabase.auth.admin or insert.
    // For now, just a placeholder insert.
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select();
    if (error) throw error;
    return data[0];
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'users/fetchCurrentUser',
  async () => {
    const supabase = createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    if (!user) return null;

    // Fetch extra profile data from 'users' table if needed
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    const avatar = profile?.avatar || user.user_metadata?.avatar_url || '';
    const name =
      profile?.name ||
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      '';

    return { ...user, ...profile, avatar, name };
  }
);

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
      state.loggedInUser = action.payload?.id;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add user';
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.loggedInUser = action.payload?.id;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user';
        state.currentUser = null;
        state.loggedInUser = null;
      });
  },
});

export const { setUser } = usersSlice.actions;

export default usersSlice.reducer;

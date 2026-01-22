import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User, CurrentUser } from '@/types/user';
import AxiosConfig from '@/components/utils/AxiosConfig';

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
  const response = await AxiosConfig.get('/users/getallusers');
  return response.data.users;
});

export const addUser = createAsyncThunk(
  'users/addUser',
  async (userData: FormData) => {
    const response = await AxiosConfig.post('/users/register', userData);
    return response.data.user;
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'users/fetchCurrentUser',
  async () => {
    const response = await AxiosConfig.get('/users/profile', {
      withCredentials: true,
    });
    return response.data.user;
  }
);

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
      state.loggedInUser = action.payload.id;
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
        state.loggedInUser = action.payload.id;
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

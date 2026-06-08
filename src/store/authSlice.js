import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../services/apiServices';
import { toast } from 'react-toastify';

const parseStoredUser = () => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    localStorage.removeItem('user');
    return null;
  }
};

const storedUser = parseStoredUser();
const storedToken = localStorage.getItem('token');

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.login(credentials);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await api.register(userData);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  try { await api.logout(); } catch {}
  localStorage.removeItem('token');
  localStorage.removeItem('user');
});

export const fetchMe = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.getMe();
    return data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedUser || null,
    token: storedToken || null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
    updateUserLocal: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      try {
        localStorage.setItem('user', JSON.stringify(state.user));
      } catch {}
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        try { localStorage.setItem('user', JSON.stringify(action.payload.user)); } catch {}
        toast.success(`Welcome back, ${action.payload.user.name}!`);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        try { localStorage.setItem('user', JSON.stringify(action.payload.user)); } catch {}
        toast.success('Account created successfully!');
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        toast.info('Logged out successfully');
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
        try { localStorage.setItem('user', JSON.stringify(action.payload)); } catch {}
      })
      .addCase(fetchMe.rejected, (state) => {
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      });
  },
});

export const { clearError, updateUserLocal } = authSlice.actions;
export default authSlice.reducer;

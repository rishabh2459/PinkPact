// src/store/features/profile/profileSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../api/apiServices';

interface ProfileState {
  data: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  data: null,
  loading: false,
  error: null,
};

// 🔥 Async thunk for fetching profile
export const fetchProfile = createAsyncThunk('profile/fetchProfile', async () => {
  const response = await apiService.get('/v1/profile');
  return response.data; // this will be in action.payload
});

// 🔥 Update profile
export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (formData: FormData) => {
    const response = await apiService.put('/v1/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data; // updated profile
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfile: state => {
      state.data = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProfile.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load profile';
      })
        .addCase(updateProfile.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;

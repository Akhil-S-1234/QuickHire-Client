// store/slices/authSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'
import AxiosInstance  from '../../app/lib/axiosInstance';


interface Admin {
  email: string;
}

interface AuthState {
  admin: Admin | null;
  isAuthenticated: boolean;
}


export const logoutAdmin= createAsyncThunk('auth/logoutAdmin', async (_, { rejectWithValue }) => {
  try {
    await AxiosInstance.post('/api/admin/logout');
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Logout failed');
  }
});



const initialState: AuthState = {
  admin: null,
  isAuthenticated: false,
};

const adminAuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAdminCredentials: (state, action: PayloadAction<{ admin: Admin; }>) => {
      const { admin } = action.payload;
      state.admin = admin;
      state.isAuthenticated = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.admin = null;
        state.isAuthenticated = false
      })
  }
});

export const { setAdminCredentials } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
// store/slices/authSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'
import AxiosInstance from '../../app/lib/axiosInstance';


interface User {
  id?: string;
  firstName: string;
  lastName?: string;
  phoneNumber?: string;
  profilePicture?: string;
  email: string;
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isBlocked: boolean;
}


export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    await AxiosInstance.post('/api/users/logout');
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Logout failed');
  }
});



const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isBlocked: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserCredentials: (state, action: PayloadAction<{ user: User; }>) => {
      const { user } = action.payload;
      state.user = user;
      state.isAuthenticated = true;
    },
    setImage: (state, action: PayloadAction<{ image: string; }>) => {
      const { image } = action.payload;
      if (state.user)
        state.user.profilePicture = image;
    },
    setBlock: (state, action: PayloadAction<boolean>) => {
      state.user = null;
      state.isAuthenticated = false
      state.isBlocked = action.payload
    }

  },
  extraReducers: (builder) => {
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false
      })
  }
});

export const { setUserCredentials, setImage, setBlock } = authSlice.actions;
export default authSlice.reducer;
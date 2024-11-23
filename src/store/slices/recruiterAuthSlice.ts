// store/slices/authSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'
import AxiosInstance  from '../../app/lib/axiosInstance';


interface Recruiter {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  position?: string;
  companyName?: string;
  createdAt?: string;
}

interface AuthState {
  recruiter: Recruiter | null;
  isAuthenticated: boolean;
}


export const logoutRecruiter = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    await AxiosInstance.post('/api/recruiter/logout');
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Logout failed');
  }
});



const initialState: AuthState = {
  recruiter: null,
  isAuthenticated: false,
};

const recruiterAuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ recruiter: Recruiter; }>) => {
      const { recruiter } = action.payload;
      state.recruiter = recruiter;
      state.isAuthenticated = true;
    },
    // logoutRecruiter: (state) => {
    //     state.recruiter = null;
    //     state.isAuthenticated = false
    // }
    // setImage: (state, action: PayloadAction<{ image: string; }>) => {
    //   const { image } = action.payload;
    //   if(state.recruiter)
    //   state.recruiter.profilePicture = image;
    // },

  },
  extraReducers: (builder) => {
    builder
      .addCase(logoutRecruiter.fulfilled, (state) => {
        state.recruiter = null;
        state.isAuthenticated = false
      })
  }
});

export const { setCredentials } = recruiterAuthSlice.actions;
export default recruiterAuthSlice.reducer;
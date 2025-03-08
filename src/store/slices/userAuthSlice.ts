// store/slices/userAuthSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from '../../app/lib/axiosInstance';

interface Feature {
  featureId: string;
  name: string;
  value: string;
}


interface Subscription {
  isPremium: boolean;
  features: Feature[];
}

interface User {
  id?: string;
  firstName: string;
  lastName?: string;
  phoneNumber?: string;
  profilePicture?: string;
  email: string;
  createdAt?: string;
}

interface UserAuthState {
  user: User | null;
  subscription: Subscription;
  isAuthenticated: boolean;
  isBlocked: boolean;
}

export const logoutUser = createAsyncThunk('userAuth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    await AxiosInstance.post('/api/users/logout');
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Logout failed');
  }
});

export const fetchSubscription = createAsyncThunk<
  Subscription,
  void,
  { rejectValue: string }
>(
  'userAuth/fetchSubscription',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get(`/api/users/subscription`);
      if (response.data.data) {
        return {
          isPremium: true,
          features: response.data.data.features || [], // Ensure features is always an array
        };
      }
      return { isPremium: false, features: [] };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subscription');
    }
  }
);

const initialState: UserAuthState = {
  user: null,
  subscription: { isPremium: false, features: [] },
  isAuthenticated: false,
  isBlocked: false,
};

const userAuthSlice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
    setUserCredentials: (state, action: PayloadAction<{ user: User }>) => {
      const { user } = action.payload;
      state.user = user;
      state.isAuthenticated = true;
    },
    setImage: (state, action: PayloadAction<{ image: string }>) => {
      if (state.user) {
        state.user.profilePicture = action.payload.image;
      }
    },
    setBlock: (state, action: PayloadAction<boolean>) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isBlocked = action.payload;
    },
    setSubscription: (state, action: PayloadAction<Subscription>) => {
      if (state.user) {
        state.subscription = action.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.subscription = { isPremium: false, features: [] };

      })
      .addCase(fetchSubscription.fulfilled, (state, action: PayloadAction<Subscription>) => {
        if (state.user) {
          state.subscription = action.payload;
        }
      });
  }
});

export const { setUserCredentials, setImage, setBlock, setSubscription } = userAuthSlice.actions;
export default userAuthSlice.reducer;

// store/store.ts
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/userAuthSlice';
import recruiterAuthReducer from './slices/recruiterAuthSlice';
import adminAuthReducer from './slices/adminAuthSlice'

const persistConfig = {
  key: 'root',
  storage,
  // whitelist: ['userAuth', 'recruiterAuth', 'adminAuth'], // Only persist auth reducer
};

const rootReducer = combineReducers({
  userAuth: authReducer,
  recruiterAuth: recruiterAuthReducer,
  adminAuth: adminAuthReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
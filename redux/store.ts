import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'

import walletReducer from './walletSlice';
import balanceReducer from './balanceSlice';
import transactionsSlice from './transactionsSlice';
import addressSlice from './addressSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore } from 'redux-persist';

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  blacklist: ['walletObject'],
}

const rootReducer = combineReducers({wallet: walletReducer})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export let persistor = persistStore(store);

// export const store = configureStore({
//   middleware: getDefaultMiddleware =>
//     getDefaultMiddleware({
//       serializableCheck: false,
//     }),
//   reducer: {
//     wallet: walletReducer,
//     balance: balanceReducer,
//     transactions: transactionsSlice,
//     address: addressSlice,
//   },
// });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

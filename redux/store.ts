import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist'
import walletReducer from './walletSlice';
import contactsReducer from './contactsSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore } from 'redux-persist';

const rootPersistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['wallet']
}
 
const walletPersistConfig = {
  key: 'wallet',
  storage: AsyncStorage,
  blacklist: [
  'currentWalletObject',
  'newWalletLabel',
  'walletLoading',
  'walletError',
  'addressLoading',
  'addressError',
  'balanceLoading',
  'balanceError',
  'transactionsLoading',
  'transactionsError'
  ]
}
 
const rootReducer = combineReducers({
  wallet: persistReducer(walletPersistConfig, walletReducer),
  contacts: contactsReducer
})

const persistedReducer = persistReducer(rootPersistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: true,
        ignoreState: true
      },
      immutableCheck: false,
    }),
})

export let persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { configureStore } from "@reduxjs/toolkit";
import walletReducer from "./walletSlice";
import balanceReducer from "./balanceSlice";
import transactionsSlice from "./transactionsSlice";
import addressSlice from "./addressSlice";

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  reducer: {
    wallet: walletReducer,
    balance: balanceReducer,
    transactions: transactionsSlice,
    address: addressSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
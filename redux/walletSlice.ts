import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
const ElectrumHelper = require("../utils/ElectrumHelper");

type InitialState = {
  value: any;
  loading: boolean;
  error: boolean;
};

interface WalletState {
  currentWallet: any;
  currentWalletAddress: InitialState;
  currentWalletBalance: InitialState;
  transactions: InitialState;
}

const initialState: WalletState = {
  currentWallet: undefined,
  currentWalletAddress: { value: "", loading: false, error: false },
  currentWalletBalance: { value: 0, loading: false, error: false },
  transactions: { value: [], loading: false, error: false },
};

export const getAddress = createAsyncThunk(
  "wallet/getAddress",
  async (wallet: any, { rejectWithValue }) => {
    try {
      await ElectrumHelper.waitTillConnected();
      const walletAddress = wallet._getExternalAddressByIndex(
        wallet.getNextFreeAddressIndex()
      );
      return walletAddress;
    } catch (err) {
      console.log("get address error: ", err);
      return rejectWithValue(err);
    }
  }
);

export const getBalance = createAsyncThunk(
  "wallet/getBalance",
  async (wallet: any, { rejectWithValue }) => {
    try {
      await ElectrumHelper.waitTillConnected();
      await wallet.fetchBalance();
      const walletBalance = wallet.getBalance();
      return walletBalance;
    } catch (err) {
      console.log("get balance error: ", err);
      return rejectWithValue(err);
    }
  }
);

export const getTransactions = createAsyncThunk(
  "wallet/getTransactions",
  async (wallet: any, { rejectWithValue }) => {
    try {
      await ElectrumHelper.waitTillConnected();
      await wallet.fetchTransactions();
      const transactions = wallet.getTransactions();
      console.log("past transactions", transactions);
      return transactions;
    } catch (err) {
      console.log("get transactions error: ", err);
      return rejectWithValue(err);
    }
  }
);

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    saveCurrentWallet: (state, action: PayloadAction<any>) => {
      state.currentWallet = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAddress.pending, (state, action) => {
        state.currentWalletAddress.error = false;
        state.currentWalletAddress.loading = true;
      })
      .addCase(getAddress.fulfilled, (state, action) => {
        state.currentWalletAddress.value = action.payload;
        state.currentWalletAddress.loading = false;
      })
      .addCase(getAddress.rejected, (state, action) => {
        state.currentWalletAddress.loading = false;
        state.currentWalletAddress.error = true;
      })
      .addCase(getBalance.pending, (state, action) => {
        state.currentWalletBalance.error = false;
        state.currentWalletBalance.loading = true;
      })
      .addCase(getBalance.fulfilled, (state, action) => {
        state.currentWalletBalance.value = action.payload;
        state.currentWalletBalance.loading = false;
      })
      .addCase(getBalance.rejected, (state, action) => {
        state.currentWalletBalance.loading = false;
        state.currentWalletBalance.error = true;
      })
      .addCase(getTransactions.pending, (state, action) => {
        state.transactions.error = false;
        state.transactions.loading = true;
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.transactions.value = action.payload;
        state.transactions.loading = false;
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.transactions.loading = false;
        state.transactions.error = true;
      });
  },
});

export const { saveCurrentWallet } = walletSlice.actions;

export const selectWallet = (state: RootState) => state.wallet.currentWallet;

export default walletSlice.reducer;

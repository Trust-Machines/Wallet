import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const ElectrumHelper = require("@utils/ElectrumHelper");

interface TransactionsState {
  transactions: any;
  transactionsLoading: boolean;
  transactionsError: boolean;
}

const initialState: TransactionsState = {
  transactions: [],
  transactionsLoading: false,
  transactionsError: false,
};

export const getTransactions = createAsyncThunk(
  "wallet/getTransactions",
  async (wallet: any, { rejectWithValue }) => {
    try {
      await ElectrumHelper.waitTillConnected();
      await wallet.fetchTransactions();
      console.log('TRANSACTIONS wallet')
      const transactions = wallet.getTransactions();
      //console.log("past transactions", transactions);
      return transactions;
    } catch (err) {
      console.log("get transactions error: ", err);
      return rejectWithValue(err);
    }
  }
);

export const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTransactions.pending, (state, action) => {
        state.transactionsError = false;
        state.transactionsLoading = true;
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload;
        state.transactionsLoading = false;
        state.transactionsError = false;
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.transactionsLoading = false;
        state.transactionsError = true;
      });
  },
});

export default transactionsSlice.reducer;

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
const ElectrumHelper = require("../utils/ElectrumHelper");

interface BalanceState {
  balance: number;
  balanceLoading: boolean;
  balanceError: boolean;
}

const initialState: BalanceState = {
  balance: 0,
  balanceLoading: false,
  balanceError: false
};

export const getBalance = createAsyncThunk(
  "balance/getBalance",
  async (wallet: any, { rejectWithValue }) => {
    try {
      await ElectrumHelper.waitTillConnected();
      await wallet.fetchBalance();
      const walletBalance = wallet.getBalance();
      console.log('BALANCE', walletBalance)
      return walletBalance;
    } catch (err) {
      console.log("get balance error: ", err);
      return rejectWithValue(err);
    }
  }
);

export const balanceSlice = createSlice({
  name: "balance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBalance.pending, (state, action) => {
        state.balanceError = false;
        state.balanceLoading = true;
      })
      .addCase(getBalance.fulfilled, (state, action) => {
        state.balance = action.payload;
        state.balanceLoading = false;
        state.balanceError = false;
      })
      .addCase(getBalance.rejected, (state, action) => {
        state.balanceLoading = false;
        state.balanceError = true;
      })
     
  },
});

export default balanceSlice.reducer;
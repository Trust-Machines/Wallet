import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const ElectrumHelper = require("@utils/ElectrumHelper");

interface AddressState {
  address: string;
  addressLoading: boolean;
  addressError: boolean;
}

const initialState: AddressState = {
  address: '',
  addressLoading: false,
  addressError: false,
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

export const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAddress.pending, (state, action) => {
        state.addressError = false;
        state.addressLoading = true;
      })
      .addCase(getAddress.fulfilled, (state, action) => {
        state.address = action.payload;
        state.addressLoading = false;
      })
      .addCase(getAddress.rejected, (state, action) => {
        state.addressLoading = false;
        state.addressError = true;
      })
  },
});

export default addressSlice.reducer;

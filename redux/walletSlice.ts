import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { saveSecurely, SecureKeys } from "../utils/secureStore";
import { startImport } from "../utils/wallets/wallet-import";
import type { RootState } from "./store";

interface WalletState {
  wallet: any;
  walletLoading: boolean;
  walletError: boolean;
}

const initialState: WalletState = {
  wallet: undefined,
  walletLoading: false,
  walletError: false
};

const importWalletHelper = async (seedPhrase: string) => {
  return new Promise(resolve => {
    let walletType: string = "";

    const onProgress = (data: any) => {
      walletType = data;
      console.log("onProgress", data);
    };

    const onPassword = () => {
      const pass = "123456"; // Should prompt the user to set a password or sth
      return pass;
    };

    const onWallet = async (wallet: any) => {
      const id = wallet.getID();
      console.log("WALLETID: ", id);
      let subtitle;
        subtitle = wallet.getDerivationPath?.();
        await saveSecurely(SecureKeys.WalletType, walletType);
        await saveSecurely(SecureKeys.SeedPhrase, wallet.secret);
        console.log('WALLET', wallet)
        resolve(wallet)
        return wallet
    };

    startImport(seedPhrase, true, true, onProgress, onWallet, onPassword);
  });
}

export const importWallet = createAsyncThunk(
  "wallet/importWallet",
  async (seedPhrase: string, { rejectWithValue }) => {
    try {
      return await importWalletHelper(seedPhrase)
    } catch (err) {
      console.log("wallet import error", err);
      return rejectWithValue(err);
    }   
  }
);

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(importWallet.pending, (state, action) => {
        state.walletError = false;
        state.walletLoading = true;
      })
      .addCase(importWallet.fulfilled, (state, action) => {
        state.wallet = action.payload;
        state.walletLoading = false;
      })
      .addCase(importWallet.rejected, (state, action) => {
        state.walletLoading = false;
        state.walletError = true;
      })
  },
});

export const selectWallet = (state: RootState) => state.wallet.wallet;

export default walletSlice.reducer;

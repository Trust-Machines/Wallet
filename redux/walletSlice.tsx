import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CachedWallets } from "../utils/asyncStorageHelper";
import { startImport } from "../utils/wallets/wallet-import";
import type { RootState } from "./store";

interface WalletState {
  currentWalletID: string;
  currentWalletLabel: string;
  walletObject: any;
  walletLoading: boolean;
  walletError: boolean;
  wallets: CachedWallets;
}

const initialState: WalletState = {
  currentWalletID: "",
  currentWalletLabel: "",
  walletObject: undefined,
  walletLoading: false,
  walletError: false,
  wallets: {},
};

// TODO add type parameter
const importWalletHelper = async (
  seedPhrase: string
): Promise<{
  walletObject: any;
  walletID: string;
}> => {
  return new Promise((resolve) => {
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
      const walletID = wallet.getID();
      console.log("WALLETID: ", walletID);
      const subtitle = wallet.getDerivationPath?.();
      console.log("WALLET", wallet);

      resolve({ walletObject: wallet, walletID });
    };

    startImport(seedPhrase, true, true, onProgress, onWallet, onPassword);
  });
};

export const importWallet = createAsyncThunk(
  "wallet/importWallet",
  async (seedPhrase: string, { rejectWithValue }) => {
    try {
      return await importWalletHelper(seedPhrase);
    } catch (err) {
      console.log("wallet import error", err);
      return rejectWithValue(err);
    }
  }
);

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWallet: (
      state,
      action: PayloadAction<{
        walletObject: Object;
      }>
    ) => {
      state.walletObject = action.payload.walletObject;
    },
    setCurrentWalletLabel: (state, action: PayloadAction<string>) => {
      state.currentWalletLabel = action.payload;
    },
    setCurrentWalletID: (state, action: PayloadAction<string>) => {
      state.currentWalletID = action.payload;
    },
    setWallets: (state, action: PayloadAction<CachedWallets>) => {
      state.wallets = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(importWallet.pending, (state, action) => {
        state.walletError = false;
        state.walletLoading = true;
      })
      .addCase(importWallet.fulfilled, (state, action) => {
        console.log("WWWOOO", action.payload.walletObject.secret);
        state.walletObject = action.payload.walletObject;
        state.walletLoading = false;

        if (!Object.keys(state.wallets).length) {
          state.currentWalletID = action.payload.walletID;
        }
      })
      .addCase(importWallet.rejected, (state, action) => {
        state.walletLoading = false;
        state.walletError = true;
      });
  },
});

export const selectWallet = (state: RootState) => state.wallet.walletObject;
export const {
  setWallet,
  setCurrentWalletLabel,
  setCurrentWalletID,
  setWallets,
} = walletSlice.actions;

export default walletSlice.reducer;

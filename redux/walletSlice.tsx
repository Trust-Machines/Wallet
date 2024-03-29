import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { startImport } from '@utils/wallets/wallet-import';
import type { RootState } from './store';
const ElectrumHelper = require('@utils/ElectrumHelper');
import { PURGE } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createSelector } from '@reduxjs/toolkit';

export interface EncryptedSeed {
  iv: string;
  content: string;
}

export interface WalletData {
  id: string;
  label: string;
  address: string;
  type: string;
  balance: number;
  transactions: [];
  encryptedSeed: EncryptedSeed;
}

interface WalletState {
  wallets: WalletData[];
  currentWalletID: string;
  currentWalletObject: any;
  usdPrice: number;
  updatedAt: number | undefined;

  newWalletLabel: string;
  walletLoading: boolean;
  walletError: boolean;
  addressLoading: boolean;
  addressError: boolean;
  balanceLoading: boolean;
  balanceError: boolean;
  transactionsLoading: boolean;
  transactionsError: boolean;
}

const initialState: WalletState = {
  wallets: [],
  currentWalletID: '',
  currentWalletObject: undefined,
  usdPrice: 0,
  updatedAt: undefined,

  newWalletLabel: '',
  walletLoading: false,
  walletError: false,
  addressLoading: false,
  addressError: false,
  balanceLoading: false,
  balanceError: false,
  transactionsLoading: false,
  transactionsError: false,
};

const importWalletHelper = async (
  seedPhrase: string,
  type?: string
): Promise<{
  walletObject: any;
  walletID: string;
  type: string;
}> => {
  return new Promise((resolve, reject) => {
    let walletType: string = '';

    const onProgress = (data: any) => {
      walletType = data;
      console.log('onProgress', data);
    };

    const onPassword = () => {
      const pass = '123456'; // Should prompt the user to set a password or sth
      return pass;
    };

    const onWallet = async (wallet: any) => {
      const walletID = wallet.getID();
      console.log('WALLETID: ', walletID);
      const subtitle = wallet.getDerivationPath?.();
      console.log('WALLET', wallet);

      resolve({ walletObject: wallet, walletID, type: walletType });
    };

    const onNotFound = async () => {
      reject('Wallet not found');
    };

    startImport(seedPhrase, type, true, true, onProgress, onWallet, onPassword, onNotFound);
  });
};

export const importWallet = createAsyncThunk(
  'wallet/importWallet',
  async ({ seedPhrase, type }: { seedPhrase: string; type?: string }, { rejectWithValue }) => {
    try {
      return await importWalletHelper(seedPhrase, type);
    } catch (err) {
      console.log('wallet import error', err);
      return rejectWithValue(err);
    }
  }
);

export const getAddress = createAsyncThunk(
  'wallet/getAddress',
  async (wallet: any, { rejectWithValue }) => {
    try {
      await ElectrumHelper.waitTillConnected();
      const walletAddress = wallet._getExternalAddressByIndex(wallet.getNextFreeAddressIndex());
      return walletAddress;
    } catch (err) {
      console.log('get address error: ', err);
      return rejectWithValue(err);
    }
  }
);

export const getBalance = createAsyncThunk(
  'balance/getBalance',
  async (wallet: any, { rejectWithValue }) => {
    try {
      await ElectrumHelper.waitTillConnected();
      await wallet.fetchBalance();
      const walletBalance = wallet.getBalance();
      console.log('BALANCE', walletBalance);

      const priceResponse = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=usd&vs_currencies=btc',
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      const usdPrice = await priceResponse.json();

      return { walletBalance, usdPrice: usdPrice.usd.btc, updatedAt: Date.now() / 1000 };
    } catch (err) {
      console.log('get balance error: ', err);
      return rejectWithValue(err);
    }
  }
);

export const getTransactions = createAsyncThunk(
  'wallet/getTransactions',
  async (wallet: any, { rejectWithValue }) => {
    try {
      await ElectrumHelper.waitTillConnected();
      await wallet.fetchTransactions();
      const transactions = wallet.getTransactions();
      //console.log("past transactions", transactions);

      const priceResponse = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=usd&vs_currencies=btc',
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      const usdPrice = await priceResponse.json();

      return { transactions, usdPrice: usdPrice.usd.btc };
    } catch (err) {
      console.log('get transactions error: ', err);
      return rejectWithValue(err);
    }
  }
);

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWallet: (
      state,
      action: PayloadAction<{
        walletObject: Object;
      }>
    ) => {
      state.currentWalletObject = action.payload.walletObject;
    },
    setCurrentWalletID: (state, action: PayloadAction<string>) => {
      state.currentWalletID = action.payload;
    },
    setWallets: (state, action: PayloadAction<WalletData[]>) => {
      state.wallets = action.payload;
    },
    setNewWalletLabel: (state, action: PayloadAction<string>) => {
      state.newWalletLabel = action.payload;
    },
    addNewWallet: (state, action: PayloadAction<WalletData>) => {
      // if there is no wallet stored, the current wallet id is set
      if (!state.wallets.length) {
        state.currentWalletID = action.payload.id;
      }

      state.wallets = [...state.wallets, action.payload];
      state.newWalletLabel = '';
    },
    editWalletLabel: (state, action: PayloadAction<string>) => {
      let wallets = state.wallets;
      const walletIndex = wallets.findIndex(obj => obj.id === state.currentWalletID);
      const walletData = wallets.find(obj => obj.id === state.currentWalletID);

      if (walletIndex > -1 && !!walletData) {
        wallets[walletIndex] = { ...walletData, label: action.payload };
        state.wallets = wallets;
      }
    },
    deleteWalletById: (state, action: PayloadAction<string>) => {
      let wallets = state.wallets;
      const walletIndex = wallets.findIndex(obj => obj.id === action.payload);
      console.log('INDEX', walletIndex);

      if (walletIndex > -1) {
        wallets.splice(walletIndex, 1);
      }

      state.wallets = wallets;
    },
  },
  extraReducers: builder => {
    builder
      // WALLET OBJECT
      .addCase(importWallet.pending, (state, action) => {
        state.walletError = false;
        state.walletLoading = true;
      })
      .addCase(importWallet.fulfilled, (state, action) => {
        state.currentWalletObject = action.payload.walletObject;
        state.walletLoading = false;

        // if there is no wallet stored, the id of the current wallet is set
        if (!state.wallets.length) {
          state.currentWalletID = action.payload.walletID;
        }
      })
      .addCase(importWallet.rejected, (state, action) => {
        state.walletLoading = false;
        state.walletError = true;
      })
      // ADDRESS
      .addCase(getAddress.pending, (state, action) => {
        state.addressError = false;
        state.addressLoading = true;
      })
      .addCase(getAddress.fulfilled, (state, action) => {
        let wallets = state.wallets;
        const walletIndex = wallets.findIndex(obj => obj.id === state.currentWalletID);
        const walletData = wallets.find(obj => obj.id === state.currentWalletID);

        if (walletIndex > -1 && !!walletData) {
          wallets[walletIndex] = { ...walletData, address: action.payload };
          state.wallets = wallets;
        }

        state.addressLoading = false;
      })
      .addCase(getAddress.rejected, (state, action) => {
        state.addressLoading = false;
        state.addressError = true;
      })
      // BALANCE
      .addCase(getBalance.pending, (state, action) => {
        state.balanceError = false;
        state.balanceLoading = true;
      })
      .addCase(getBalance.fulfilled, (state, action) => {
        let wallets = state.wallets;
        const walletIndex = wallets.findIndex(obj => obj.id === state.currentWalletID);
        const walletData = wallets.find(obj => obj.id === state.currentWalletID);

        if (!!walletData) {
          wallets[walletIndex] = { ...walletData, balance: action.payload.walletBalance };
          state.wallets = wallets;
        }

        state.updatedAt = action.payload.updatedAt;
        state.usdPrice = action.payload.usdPrice;
        state.balanceLoading = false;
        state.balanceError = false;
      })
      .addCase(getBalance.rejected, (state, action) => {
        state.balanceLoading = false;
        state.balanceError = true;
      })
      // TRANSACTIONS
      .addCase(getTransactions.pending, (state, action) => {
        state.transactionsError = false;
        state.transactionsLoading = true;
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        let wallets = state.wallets;
        const walletIndex = wallets.findIndex(obj => obj.id === state.currentWalletID);
        const walletData = wallets.find(obj => obj.id === state.currentWalletID);

        if (!!walletData) {
          wallets[walletIndex] = { ...walletData, transactions: action.payload.transactions };
          state.wallets = wallets;
        }

        state.usdPrice = action.payload.usdPrice;
        state.transactionsLoading = false;
        state.transactionsError = false;
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.transactionsLoading = false;
        state.transactionsError = true;
      });

    // PURGE
    builder.addCase(PURGE, state => {
      storage.removeItem('root');
    });
  },
});

const selectWallets = (state: RootState) => state.wallet.wallets;
const selectCurrentWalletID = (state: RootState) => state.wallet.currentWalletID;
export const selectCurrentWalletData = createSelector(
  selectWallets,
  selectCurrentWalletID,
  (wallets, id) => wallets.find(wallet => wallet.id === id)
);
export const selectIsLoggedIn = createSelector(selectWallets, wallets => wallets.length > 0);

export const {
  setWallet,
  setCurrentWalletID,
  setWallets,
  setNewWalletLabel,
  addNewWallet,
  editWalletLabel,
  deleteWalletById,
} = walletSlice.actions;

export default walletSlice.reducer;

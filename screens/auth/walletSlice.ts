import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../redux/store'

interface WalletState {
  currentWallet: any
}

const initialState: WalletState = {
  currentWallet: undefined,
}

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    save: (state, action: PayloadAction<any>) => {
      console.log('ACTION', action.payload)
      state.currentWallet = action.payload
    },
  },
})

export const { save } = walletSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectWallet = (state: RootState) => state.wallet.currentWallet

export default walletSlice.reducer
/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EncryptedSeed, WalletData } from '@redux/walletSlice';
import { Assets } from './constants/CommonEnums';
import { TransactionDetails } from './hooks/useTransactionSending';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  OnboardingStack: NavigatorScreenParams<OnboardingStackParamList>;
  ExchangeStack: NavigatorScreenParams<ExchangeStackParamList>;
  TransactionStack: NavigatorScreenParams<TransactionStackParamList>;
  BuyCryptoStack: NavigatorScreenParams<BuyCryptoStackParamList>;
  WalletsStack: NavigatorScreenParams<WalletsStackParamList>;
  NewWalletStack: NavigatorScreenParams<NewWalletStackParamList>;
  TransactionDetails: { transactionHash: string };
  Settings: undefined;
  CommonError: { message?: string };
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
  Home: undefined;
  Collectibles: undefined;
  ExchangeTab: undefined;
  DefiBrowser: undefined;
  Transactions: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;

export type CommonStackParamList = {
  SaveRecoveryPhrase: { password?: string };
  CreateWalletSuccess: { isFirstWallet?: boolean };
  WalletLogin: { password?: string };
  UnlockWallet: {
    encryptedSeedPhrase: EncryptedSeed;
    onValidationFinished(success: boolean, password?: string): void;
  };
  WalletLabel: { flow: 'import' | 'generate' };
};

export type CommonStackScreenProps<Screen extends keyof CommonStackParamList> =
  NativeStackScreenProps<CommonStackParamList, Screen>;

export type OnboardingStackParamList = CommonStackParamList & {
  Start: undefined;
  Biometrics: undefined;
  AcceptTOS: { flow: 'import' | 'generate' };
  SetPassword: { seedPhrase: string; type: string };
};

export type OnboardingStackScreenProps<Screen extends keyof OnboardingStackParamList> =
  NativeStackScreenProps<OnboardingStackParamList, Screen>;

export type ExchangeStackParamList = {
  ExchangeSelectToken: {
    type: 'pay' | 'receive';
    onGoBack(type: 'pay' | 'receive', asset: Assets): void;
  };
};

export type ExchangeStackScreenProps<Screen extends keyof ExchangeStackParamList> =
  NativeStackScreenProps<ExchangeStackParamList, Screen>;

export type TransactionStackParamList = {
  PresentQr: undefined;
  ScanQr: undefined;
  ConfirmTransaction: { address: string; amount: string };
  TransactionSuccess: TransactionDetails;
};

export type TransactionStackScreenProps<Screen extends keyof TransactionStackParamList> =
  NativeStackScreenProps<TransactionStackParamList, Screen>;

export type BuyCryptoStackParamList = {
  BuyCrypto: undefined;
};

export type BuyCryptoStackScreenProps<Screen extends keyof BuyCryptoStackParamList> =
  NativeStackScreenProps<BuyCryptoStackParamList, Screen>;

export type WalletsStackParamList = {
  WalletSelector: undefined;
  UnlockWallet: {
    encryptedSeedPhrase: EncryptedSeed;
    onValidationFinished(success: boolean, password: string): void;
  };
  EditWallet: { wallet: WalletData; id: string };
};

export type WalletsStackScreenProps<Screen extends keyof WalletsStackParamList> =
  NativeStackScreenProps<WalletsStackParamList, Screen>;

export type NewWalletStackParamList = CommonStackParamList & {
  AddNewWallet: undefined;
};

export type NewWalletStackScreenProps<Screen extends keyof NewWalletStackParamList> =
  NativeStackScreenProps<NewWalletStackParamList, Screen>;

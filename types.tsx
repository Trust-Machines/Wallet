/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Assets } from './constants/CommonEnums';
import { TransactionDetails } from './hooks/useTransactionSending';
import { CachedWallet, EncryptedSeed } from './utils/asyncStorageHelper';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  OnboardingStack: NavigatorScreenParams<OnboardingStackParamList>;
  ExchangeStack: NavigatorScreenParams<ExchangeStackParamList>;
  QrStack: NavigatorScreenParams<QrStackParamList>;
  ReceiveStack: NavigatorScreenParams<ReceiveStackParamList>;
  SendStack: NavigatorScreenParams<SendStackParamList>;
  BuyCryptoStack: NavigatorScreenParams<BuyCryptoStackParamList>;
  WalletsStack: NavigatorScreenParams<WalletsStackParamList>;
  NewWalletStack: NavigatorScreenParams<NewWalletStackParamList>;
  TransactionDetails: { transactionHash: string };
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
  Settings: undefined;
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
  SetPassword: { seedPhrase: string };
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

export type QrStackParamList = {
  PresentQr: undefined;
  ScanQr: undefined;
  ConfirmSend: { address: string; amount: string };
  TransactionSuccess: TransactionDetails;
};

export type QrStackScreenProps<Screen extends keyof QrStackParamList> = NativeStackScreenProps<
  QrStackParamList,
  Screen
>;

export type ReceiveStackParamList = {
  ReceivePresentQr: undefined;
};

export type ReceiveStackScreenProps<Screen extends keyof ReceiveStackParamList> =
  NativeStackScreenProps<ReceiveStackParamList, Screen>;

export type SendStackParamList = {
  Send: undefined;
  SendSuccess: TransactionDetails;
};

export type SendStackScreenProps<Screen extends keyof SendStackParamList> = NativeStackScreenProps<
  SendStackParamList,
  Screen
>;

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
  EditWallet: { wallet: CachedWallet; id: string };
};

export type WalletsStackScreenProps<Screen extends keyof WalletsStackParamList> =
  NativeStackScreenProps<WalletsStackParamList, Screen>;

export type NewWalletStackParamList = CommonStackParamList & {
  AddNewWallet: undefined;
};

export type NewWalletStackScreenProps<Screen extends keyof NewWalletStackParamList> =
  NativeStackScreenProps<NewWalletStackParamList, Screen>;

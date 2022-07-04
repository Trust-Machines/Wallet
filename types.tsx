/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Assets } from "./constants/CommonEnums";
import { TransactionDetails } from "./hooks/useTransactionSending";
import { EncryptedSeed } from "./utils/asyncStorageHelper";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  ExchangeStack: NavigatorScreenParams<ExchangeStackParamList>;
  QrStack: NavigatorScreenParams<QrStackParamList>;
  ReceiveStack: NavigatorScreenParams<ReceiveStackParamList>;
  SendStack: NavigatorScreenParams<SendStackParamList>;
  BuyCryptoStack: NavigatorScreenParams<BuyCryptoStackParamList>;
  WalletsStack: NavigatorScreenParams<WalletsStackParamList>;
  NewWalletStack: NavigatorScreenParams<NewWalletStackParamList>;
  Start: undefined;
  Biometrics: undefined;
  AcceptTOS: { flow: "import" | "generate" };
  SaveRecoveryPhrase: undefined;
  CreateWalletSuccess: undefined;
  WalletLogin: undefined;
  SetPassword: { seedPhrase: string };
  UnlockWallet: {
    encryptedSeedPhrase: EncryptedSeed;
    onValidationFinished(success: boolean): void;
  };
  WalletLabel: { flow: "import" | "generate" };
  AddNewWallet: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
  Home: undefined;
  Collectibles: undefined;
  ExchangeTab: undefined;
  DefiBrowser: undefined;
  Settings: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

export type ExchangeStackParamList = {
  ExchangeSelectToken: {
    type: "pay" | "receive";
    onGoBack(type: "pay" | "receive", asset: Assets): void;
  };
};

export type ExchangeStackScreenProps<
  Screen extends keyof ExchangeStackParamList
> = NativeStackScreenProps<ExchangeStackParamList, Screen>;

export type QrStackParamList = {
  PresentQr: undefined;
  ScanQr: undefined;
  ConfirmSend: { address: string; amount: string };
  TransactionSuccess: TransactionDetails;
};

export type QrStackScreenProps<Screen extends keyof QrStackParamList> =
  NativeStackScreenProps<QrStackParamList, Screen>;

export type ReceiveStackParamList = {
  ReceivePresentQr: undefined;
};

export type ReceiveStackScreenProps<
  Screen extends keyof ReceiveStackParamList
> = NativeStackScreenProps<ReceiveStackParamList, Screen>;

export type SendStackParamList = {
  Send: undefined;
  SendSuccess: TransactionDetails;
};

export type SendStackScreenProps<Screen extends keyof SendStackParamList> =
  NativeStackScreenProps<SendStackParamList, Screen>;

export type BuyCryptoStackParamList = {
  BuyCrypto: undefined;
};

export type BuyCryptoStackScreenProps<
  Screen extends keyof BuyCryptoStackParamList
> = NativeStackScreenProps<BuyCryptoStackParamList, Screen>;

export type WalletsStackParamList = {
  WalletSelector: undefined;
  UnlockWallet: {
    encryptedSeedPhrase: EncryptedSeed;
    onValidationFinished(success: boolean, password: string): void;
  };
};

export type WalletsStackScreenProps<
  Screen extends keyof WalletsStackParamList
> = NativeStackScreenProps<WalletsStackParamList, Screen>;

export type NewWalletStackParamList = {
  AddNewWallet: undefined;
  UnlockWallet: {
    encryptedSeedPhrase: EncryptedSeed;
    onValidationFinished(success: boolean, password: string): void;
  };
  SaveRecoveryPhrase: { password: string };
  CreateWalletSuccess: undefined;
  WalletLogin: { password: string };
  // TODO wallet label
};

export type NewWalletStackScreenProps<
  Screen extends keyof NewWalletStackParamList
> = NativeStackScreenProps<NewWalletStackParamList, Screen>;

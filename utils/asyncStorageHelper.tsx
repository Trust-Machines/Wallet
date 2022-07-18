import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppDispatch } from "@redux/hooks";
import { setWallets } from "@redux/walletSlice";

export enum StorageKeys {
  Wallets = "Wallets",
  CurrentWalletId = "CurrentWalletId",
}

export interface CachedWallet {
  seed: EncryptedSeed;
  type: string;
  label: string;
}

export interface CachedWallets {
  [key: string]: CachedWallet;
}

export const storeDataToAsyncStorage = async (
  key: StorageKeys,
  value: string | boolean | number | Object
): Promise<void> => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const storeCurrentWalletIdToAsyncStorage = async (
  value: string
): Promise<void> => {
  await AsyncStorage.setItem(
    StorageKeys.CurrentWalletId,
    JSON.stringify(value)
  );
};

export const getDataFromAsyncStorage = async (
  key: StorageKeys
): Promise<string | undefined> => {
  let result = await AsyncStorage.getItem(key);
  if (result) {
    return JSON.parse(result);
  } else {
    return undefined;
  }
};

export const getWalletsFromAsyncStorage = async (): Promise<
  CachedWallets | undefined
> => {
  let result = await AsyncStorage.getItem(StorageKeys.Wallets);
  if (result) {
    return JSON.parse(result);
  } else {
    return undefined;
  }
};

export type EncryptedSeed = { iv: string; content: string };
export type AddWalletToAsyncStorageParams = {
  encryptedWalletSeed: EncryptedSeed;
  walletID: string;
  walletLabel: string;
};

export const addWalletToAsyncStorage = async (
  addWalletToAsyncStorageParams: AddWalletToAsyncStorageParams
): Promise<void> => {
  let storedWallets = (await getWalletsFromAsyncStorage()) ?? {};
  console.log("SAVED WALLETS", storedWallets);
  const { walletID, encryptedWalletSeed, walletLabel } =
    addWalletToAsyncStorageParams;

  storedWallets[walletID] = {
    seed: encryptedWalletSeed,
    type: "type",
    label: walletLabel,
  } as CachedWallet;

  console.log("SAVED WALLETS1", storedWallets, walletID);
  await AsyncStorage.setItem(
    StorageKeys.Wallets,
    JSON.stringify(storedWallets)
  );
};

export const removeWalletFromAsyncStorage = async (
  idToRemove: string
): Promise<void> => {
  let wallets = await getWalletsFromAsyncStorage();
  console.log("DELETE1", wallets);

  if (wallets) {
    delete wallets[idToRemove];
  }

  console.log("DELETE2", wallets);

  await AsyncStorage.setItem(StorageKeys.Wallets, JSON.stringify(wallets));
};

export const removeFromAsyncStorage = async (
  key: StorageKeys
): Promise<void> => {
  await AsyncStorage.removeItem(key);
};

export const clearAsyncStorage = async () => {
  try {
    const keys: string[] = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiRemove(keys);
  } catch (err) {
    console.log("clear async storage error: ", err);
  }

  console.log("CLEARED");
};

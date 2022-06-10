import * as SecureStore from "expo-secure-store";

export enum SecureKeys {
  SeedPhrase = "SeedPhrase",
  WalletType = "WalletType",
}

export const saveSecurely = async (
  key: SecureKeys,
  value: string | boolean | number
): Promise<void> => {
  await SecureStore.setItemAsync(key, JSON.stringify(value));
};

export const deleteFromSecureStore = async (key: SecureKeys): Promise<void> => {
  await SecureStore.deleteItemAsync(key);
};

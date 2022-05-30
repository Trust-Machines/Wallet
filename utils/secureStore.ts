import * as SecureStore from 'expo-secure-store';

export enum SecureKeys {
  SeedPhrase = 'SeedPhrase',
}

export const saveSecurely = async (key: SecureKeys, value: string | boolean | number): Promise<void> => {
  await SecureStore.setItemAsync(key, JSON.stringify(value));
}
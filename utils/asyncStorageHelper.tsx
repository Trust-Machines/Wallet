import AsyncStorage from '@react-native-async-storage/async-storage';

export const clearAsyncStorage = async () => {
  try {
    const keys: string[] = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiRemove(keys);
  } catch (err) {
    console.log('clear async storage error: ', err);
  }

  console.log('CLEARED');
};

import { SafeAreaProvider } from 'react-native-safe-area-context';
//import useCachedResources from "./hooks/useCachedResources";
//import useColorScheme from "./hooks/useColorScheme";
import { Navigation } from './navigation';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { Provider } from 'react-redux';
import { persistor, store } from './redux/store';
import { LogBox, Text } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';
// import { persistStore } from 'redux-persist';

LogBox.ignoreAllLogs();

export function App() {
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  //let persistor = persistStore(store);

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={<Text>Loading...</Text> /*null*/} persistor={persistor}>
          <Navigation />
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}

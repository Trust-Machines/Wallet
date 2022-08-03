import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Navigation } from './navigation';
import RNUxcam from 'react-native-ux-cam';
import { logger } from './utils/logger';
RNUxcam.optIntoSchematicRecordings(); // Add this line to enable iOS screen recordings
RNUxcam.startWithKey('tos5xeujyp3efc3'); // Add this line after RNUcam.optIntoSchematicRecordings();

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

logger('App launched', { success: true }, 'Main');

export function App() {
  LogBox.ignoreAllLogs();

  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

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

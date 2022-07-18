import { SafeAreaProvider } from 'react-native-safe-area-context';
//import useCachedResources from "./hooks/useCachedResources";
//import useColorScheme from "./hooks/useColorScheme";
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
import { store } from './redux/store';
import { LogBox } from 'react-native';

logger('App launched', { success: true }, 'Main');

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

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <Navigation />
      </Provider>
    </SafeAreaProvider>
  );
}

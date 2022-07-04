import { SafeAreaProvider } from "react-native-safe-area-context";
//import useCachedResources from "./hooks/useCachedResources";
//import useColorScheme from "./hooks/useColorScheme";
import { Navigation } from "./navigation";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { LogBox } from "react-native";

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

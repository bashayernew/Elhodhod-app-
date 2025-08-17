import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View } from "react-native";
import * as SecureStore from 'expo-secure-store';
import { setTokenProvider } from '@hodhod/data';

setTokenProvider({
  getAccessToken: async () => {
    try {
      return await SecureStore.getItemAsync('access_token');
    } catch {
      return null;
    }
  }
});

export default function RootLayout() {
	return (
		<SafeAreaProvider>
			<View style={{ flex: 1, backgroundColor: "#0b0b0d" }}>
				<Slot />
			</View>
		</SafeAreaProvider>
	);
}



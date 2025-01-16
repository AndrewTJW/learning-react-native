import { Stack } from "expo-router";
import { StatusBar} from "expo-status-bar";

export default function RootLayout() {
  return (
      <>
          <Stack>
              <Stack.Screen name = "(tabs)" options = {{headerShown: false}} />
              <Stack.Screen name = "+not-found" />
          </Stack>
          //works for IOS and Android only
          <StatusBar style="light" />
      </>
  );
}

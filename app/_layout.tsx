import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <>
      <StatusBar barStyle="dark-content" />

      <Stack>
        <Stack.Screen name="index" options={{ title: "Pokedex" }} />
        <Stack.Screen name="details" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

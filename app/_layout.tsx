import { Stack } from "expo-router";
import { ThemeProvider } from "../context/ThemeContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PointsProvider } from "../context/PointsContext";

export default function Layout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <PointsProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </PointsProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

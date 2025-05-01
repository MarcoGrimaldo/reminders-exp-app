import React from "react";
import { View, StyleSheet, StatusBar, Platform, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";

interface SafeAreaWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  statusBarColor?: string;
  statusBarStyle?: "light-content" | "dark-content";
  statusBarTranslucent?: boolean;
}

export default function SafeAreaWrapper({
  children,
  style,
  statusBarColor,
  statusBarStyle,
  statusBarTranslucent = true,
}: SafeAreaWrapperProps) {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();

  // Determine status bar style based on theme if not explicitly provided
  const barStyle =
    statusBarStyle || (isDark ? "light-content" : "dark-content");

  // Use provided status bar color or theme background color
  const barColor = statusBarColor || theme.colors.background;

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          backgroundColor: theme.colors.background,
        },
        style,
      ]}
    >
      <StatusBar
        barStyle={barStyle}
        backgroundColor={barColor}
        translucent={statusBarTranslucent}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

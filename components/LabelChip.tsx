// components/LabelChip.tsx
import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

interface Props {
  label: string;
  color: string;
  selected: boolean;
  onPress: () => void;
}

export default function LabelChip({ label, color, selected, onPress }: Props) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? color : theme.colors.border,
          borderColor: color,
        },
      ]}
    >
      <Text
        style={[styles.text, { color: selected ? "#fff" : theme.colors.text }]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
  },
});

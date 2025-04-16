// components/LabelChip.tsx
import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";

interface Props {
  label: string;
  color: string;
  selected: boolean;
  onPress: () => void;
}

export default function LabelChip({ label, color, selected, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.chip,
        { backgroundColor: selected ? color : "#e5e7eb", borderColor: color },
      ]}
    >
      <Text style={[styles.text, { color: selected ? "#fff" : "#111" }]}>
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

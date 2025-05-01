// components/LabelModal.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { useTheme } from "../context/ThemeContext";

const colorOptions = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (label: string, color: string) => void;
}

export default function LabelModal({ visible, onClose, onSave }: Props) {
  const [labelName, setLabelName] = useState("");
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const { theme } = useTheme();

  const handleSave = () => {
    if (!labelName.trim()) return;
    onSave(labelName.trim(), selectedColor);
    setLabelName("");
    setSelectedColor(colorOptions[0]);
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.overlay}>
        <View
          style={[styles.container, { backgroundColor: theme.colors.card }]}
        >
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Create Label
          </Text>
          <TextInput
            value={labelName}
            onChangeText={setLabelName}
            placeholder="Label name"
            placeholderTextColor={theme.colors.secondary}
            style={[
              styles.input,
              {
                borderColor: theme.colors.border,
                color: theme.colors.text,
                backgroundColor: theme.colors.background,
              },
            ]}
          />
          <Text style={[styles.subtitle, { color: theme.colors.text }]}>
            Choose color:
          </Text>
          <FlatList
            horizontal
            data={colorOptions}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.colorCircle,
                  {
                    backgroundColor: item,
                    borderWidth: item === selectedColor ? 3 : 0,
                    borderColor: theme.colors.text,
                  },
                ]}
                onPress={() => setSelectedColor(item)}
              />
            )}
          />
          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: theme.colors.primary }]}
            onPress={handleSave}
          >
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}>
            <Text
              style={[styles.cancelText, { color: theme.colors.secondary }]}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#0006",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "85%",
    padding: 20,
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
    marginTop: 8,
  },
  saveBtn: {
    marginTop: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelText: {
    marginTop: 10,
    textAlign: "center",
  },
});

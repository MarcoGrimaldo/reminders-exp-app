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

const colorOptions = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (label: string, color: string) => void;
}

export default function LabelModal({ visible, onClose, onSave }: Props) {
  const [labelName, setLabelName] = useState("");
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);

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
        <View style={styles.container}>
          <Text style={styles.title}>Create Label</Text>
          <TextInput
            value={labelName}
            onChangeText={setLabelName}
            placeholder="Label name"
            style={styles.input}
          />
          <Text style={styles.subtitle}>Choose color:</Text>
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
                    borderColor: "#000",
                  },
                ]}
                onPress={() => setSelectedColor(item)}
              />
            )}
          />
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
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
    backgroundColor: "#fff",
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
    borderColor: "#d1d5db",
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
    backgroundColor: "#1e40af",
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
    color: "#6b7280",
  },
});

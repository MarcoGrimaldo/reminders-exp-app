import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import ENV from "../config/env";

type Props = {
  onReset?: () => void;
};

export default function DebugMenu({ onReset }: Props) {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  if (!ENV.SHOW_DEBUG_BUTTONS) {
    return null;
  }

  const handleClearStorage = async () => {
    Alert.alert(
      "Clear App Data",
      "This will reset all your points and ranks. Are you sure?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              setModalVisible(false);
              if (onReset) {
                onReset();
              }
              Alert.alert("Success", "App data has been cleared.");
            } catch (error) {
              Alert.alert("Error", "Failed to clear app data.");
            }
          },
        },
      ]
    );
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.debugButton}
      >
        <Ionicons name="bug-outline" size={24} color={theme.colors.primary} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.colors.card },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Debug Menu
            </Text>

            <TouchableOpacity
              style={[styles.menuItem, { backgroundColor: theme.colors.error }]}
              onPress={handleClearStorage}
            >
              <Text style={styles.menuItemText}>Clear App Data</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.menuItem,
                { backgroundColor: theme.colors.border },
              ]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.menuItemText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  debugButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  menuItem: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  menuItemText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

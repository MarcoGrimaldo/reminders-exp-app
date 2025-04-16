import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";

import LabelChip from "../../components/LabelChip";
import LabelModal from "../../components/LabelModal";
import SchedulePicker from "../../components/SchedulePicker";

type Task = {
  id: string;
  title: string;
  completed: boolean;
  label?: string;
  schedule?: {
    repeatDays?: string[];
    date?: string;
  };
};

type LabelEntry = {
  name: string;
  color: string;
};

const defaultLabels: LabelEntry[] = [
  { name: "Work", color: "#3b82f6" },
  { name: "Routine", color: "#10b981" },
  { name: "Shopping", color: "#f59e0b" },
  { name: "Urgent", color: "#ef4444" },
  { name: "Personal", color: "#8b5cf6" },
  { name: "CrossFit", color: "#6366f1" },
];

export default function AddTaskScreen() {
  const [text, setText] = useState("");
  const [labels, setLabels] = useState<LabelEntry[]>([]);
  const [selectedLabel, setSelectedLabel] = useState<LabelEntry | null>(null);
  const [schedule, setSchedule] = useState<{
    repeatDays?: string[];
    date?: string;
  } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [textError, setTextError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadLabels();
  }, []);

  const loadLabels = async () => {
    const local = await AsyncStorage.getItem("labels");
    const parsed: LabelEntry[] = local ? JSON.parse(local) : [];
    const merged = [
      ...defaultLabels,
      ...parsed.filter(
        (l) =>
          !defaultLabels.some(
            (d) => d.name.toLowerCase() === l.name.toLowerCase()
          )
      ),
    ];
    setLabels(merged);
  };

  const saveNewLabel = async (name: string, color: string) => {
    if (!name.trim()) return; // already handled by modal
    const exists = labels.some(
      (l) => l.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      alert("This label already exists.");
      return;
    }

    const newLabel = { name, color };
    const updated = [...labels, newLabel];
    setLabels(updated);
    await AsyncStorage.setItem("labels", JSON.stringify(updated));
    setSelectedLabel(newLabel);
  };

  const addTask = async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setTextError("Please enter a task title.");
      return;
    }

    if (trimmed.length < 3) {
      setTextError("Task must be at least 3 characters.");
      return;
    }

    // Reset error
    setTextError(null);

    const existing = await AsyncStorage.getItem("tasks");
    const parsed: Task[] = existing ? JSON.parse(existing) : [];

    const newTask: Task = {
      id: uuidv4(),
      title: trimmed,
      completed: false,
      label: selectedLabel?.name,
      schedule: schedule ?? undefined,
    };

    parsed.push(newTask);
    await AsyncStorage.setItem("tasks", JSON.stringify(parsed));
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.label}>What task do you want to add?</Text>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Enter task..."
          style={styles.input}
        />
        {textError && <Text style={styles.error}>{textError}</Text>}
        <Text style={styles.label}>Labels:</Text>
        <View style={styles.labelsContainer}>
          <LabelChip
            label="None"
            color="#d1d5db"
            selected={!selectedLabel}
            onPress={() => setSelectedLabel(null)}
          />
          <LabelChip
            label="+ Create one"
            color="#1e3a8a"
            selected={false}
            onPress={() => setModalVisible(true)}
          />
          {labels.map((lbl) => (
            <LabelChip
              key={lbl.name}
              label={lbl.name}
              color={lbl.color}
              selected={
                selectedLabel?.name.toLowerCase() === lbl.name.toLowerCase()
              }
              onPress={() => setSelectedLabel(lbl)}
            />
          ))}
        </View>

        <Text style={styles.label}>Schedule:</Text>
        <SchedulePicker value={schedule} onChange={setSchedule} />

        <TouchableOpacity style={styles.button} onPress={addTask}>
          <Text style={styles.buttonText}>Add Task</Text>
        </TouchableOpacity>
      </ScrollView>

      <LabelModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={saveNewLabel}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  labelsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#1e40af",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  error: {
    color: "#ef4444",
    marginBottom: 10,
  },
});

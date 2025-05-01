import React, { useCallback, useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  AppState,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import TaskCard from "../components/TaskCard";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import SafeAreaWrapper from "../components/SafeAreaWrapper";
import RankProgressBar from "../components/RankProgressBar";
import TaskVerificationModal from "../components/TaskVerificationModal";
import DebugMenu from "../components/DebugMenu";

type Task = {
  id: string;
  title: string;
  completed: boolean;
  label?: string;
  schedule?: {
    repeatDays?: string[];
    date?: string;
  };
  lastCompletedDate?: string;
};

type LabelGroup = { [label: string]: Task[] };

const getTodayKey = () =>
  new Date().toLocaleDateString("en-US", {
    weekday: "long",
  }); // e.g. 'Monday'

const isTodayTask = (task: Task): boolean => {
  const today = getTodayKey();
  const todayISO = new Date().toISOString().split("T")[0];
  if (!task.schedule) return false;
  if (task.schedule.repeatDays?.includes(today)) return true;
  if (task.schedule.date === todayISO) return true;
  return false;
};

const isUpcomingTask = (task: Task): boolean => {
  if (!task.schedule) return false;
  return !isTodayTask(task);
};

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [labelColors, setLabelColors] = useState<{ [name: string]: string }>(
    {}
  );
  const router = useRouter();
  const appState = useRef(AppState.currentState);
  const { theme, isDark, toggleTheme } = useTheme();
  const [verificationModalVisible, setVerificationModalVisible] =
    useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (nextState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextState === "active"
      ) {
        handleDayCheck();
      }
      appState.current = nextState;
    });

    handleDayCheck(); // Also run on mount

    return () => sub.remove();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
      loadLabelColors();
    }, [])
  );

  const handleDayCheck = async () => {
    const today = new Date().toISOString().split("T")[0];
    const lastOpened = await AsyncStorage.getItem("lastOpenedDate");

    if (lastOpened !== today) {
      await AsyncStorage.setItem("lastOpenedDate", today);
      await resetRecurringTaskStatus();
    }
  };

  const resetRecurringTaskStatus = async () => {
    const today = new Date().toISOString().split("T")[0];
    const todayKey = new Date().toLocaleDateString("en-US", {
      weekday: "long",
    });

    const updated = tasks.map((task) => {
      // Reset status for recurring tasks that were completed on a different day
      if (
        task.schedule?.repeatDays?.length &&
        task.lastCompletedDate !== today
      ) {
        return { ...task, completed: false };
      }
      // Reset one-time scheduled tasks for today that were completed on a different day
      if (task.schedule?.date === today && task.lastCompletedDate !== today) {
        return { ...task, completed: false };
      }
      return task;
    });

    saveTasks(updated);
  };

  const loadLabelColors = async () => {
    const defaultLabels = [
      { name: "Work", color: "#3b82f6" },
      { name: "Routine", color: "#10b981" },
      { name: "Shopping", color: "#f59e0b" },
      { name: "Urgent", color: "#ef4444" },
      { name: "Personal", color: "#8b5cf6" },
    ];

    const stored = await AsyncStorage.getItem("labels");
    const parsed = stored ? JSON.parse(stored) : [];

    const merged = [...defaultLabels, ...parsed].reduce((acc, l) => {
      acc[l.name] = l.color;
      return acc;
    }, {} as { [name: string]: string });

    setLabelColors(merged);
  };

  const loadTasks = async () => {
    const json = await AsyncStorage.getItem("tasks");
    const parsed: Task[] = json ? JSON.parse(json) : [];
    setTasks(parsed);
  };

  const saveTasks = async (newTasks: Task[]) => {
    setTasks(newTasks);
    await AsyncStorage.setItem("tasks", JSON.stringify(newTasks));
  };

  const toggleTask = async (id: string) => {
    const today = new Date().toISOString().split("T")[0];
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, completed: true, lastCompletedDate: today } : t
    );
    saveTasks(updated);
  };

  const deleteTask = async (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    saveTasks(updated);
  };

  const groupByLabel = (filtered: Task[]): LabelGroup => {
    return filtered.reduce((acc, task) => {
      const label = task.label || "To Do";
      if (!acc[label]) acc[label] = [];
      acc[label].push(task);
      return acc;
    }, {} as LabelGroup);
  };

  const todayTasks = groupByLabel(tasks.filter(isTodayTask));
  const noScheduleTasks = groupByLabel(tasks.filter((t) => !t.schedule));
  const upcomingTasks = groupByLabel(tasks.filter(isUpcomingTask));

  const renderSection = (
    title: string,
    groups: LabelGroup,
    showSchedule = false
  ) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        {title}
      </Text>
      {Object.entries(groups).map(([label, tasks]) => (
        <View
          key={label}
          style={[
            styles.group,
            {
              backgroundColor:
                theme.colors.labelBackground[label] ||
                theme.colors.labelBackground.Work,
            },
          ]}
        >
          <Text style={[styles.label, { color: theme.colors.text }]}>
            {label}
          </Text>

          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={() => handleTaskToggle(task.id)}
              onDelete={() => deleteTask(task.id)}
              showSchedule={showSchedule}
            />
          ))}
        </View>
      ))}
    </View>
  );

  const handleTaskToggle = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const today = new Date().toISOString().split("T")[0];

    // If task is already completed today, don't allow toggling
    if (task.completed && task.lastCompletedDate === today) {
      return;
    }

    // For scheduled tasks, check if it's a repeating task
    if (task.schedule) {
      // If it's a one-time scheduled task and already completed, don't allow toggling
      if (task.schedule.date && task.completed) {
        return;
      }
      // For repeating tasks, allow toggle if it's a new day
      if (task.schedule.repeatDays && task.lastCompletedDate === today) {
        return;
      }
    } else {
      // For non-scheduled tasks, if completed, don't allow toggling
      if (task.completed) {
        return;
      }
    }

    setSelectedTaskId(id);
    setVerificationModalVisible(true);
  };

  const handleVerificationConfirm = () => {
    if (selectedTaskId) {
      toggleTask(selectedTaskId);
    }
    setVerificationModalVisible(false);
    setSelectedTaskId(null);
  };

  const handleAppReset = () => {
    loadTasks();
    loadLabelColors();
  };

  return (
    <SafeAreaWrapper>
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <RankProgressBar />
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Reminders
          </Text>
          <View style={styles.headerButtons}>
            <DebugMenu onReset={handleAppReset} />
            <TouchableOpacity onPress={toggleTheme} style={styles.headerButton}>
              <Ionicons
                name={isDark ? "sunny" : "moon"}
                size={24}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/reminders/add-reminder")}
              style={styles.headerButton}
            >
              <Ionicons name="add" size={30} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          {renderSection("For Today", todayTasks)}
          {renderSection("To Do Also", noScheduleTasks)}
          {renderSection("Upcoming", upcomingTasks, true)}
        </ScrollView>

        <TaskVerificationModal
          visible={verificationModalVisible}
          onClose={() => setVerificationModalVisible(false)}
          onConfirm={handleVerificationConfirm}
        />
      </View>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  headerButton: {
    padding: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  group: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
});

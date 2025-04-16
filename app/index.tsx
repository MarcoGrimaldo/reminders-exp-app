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
    const updated = tasks.map((task) => {
      if (task.schedule?.repeatDays?.length) {
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
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
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
              onToggle={() => toggleTask(task.id)}
              onDelete={() => deleteTask(task.id)}
              showSchedule={showSchedule}
            />
          ))}
        </View>
      ))}
    </View>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Reminders
        </Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
            <Ionicons
              name={isDark ? "sunny" : "moon"}
              size={24}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/reminders/add-reminder")}
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
    </View>
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
    paddingTop: 60,
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  themeButton: {
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

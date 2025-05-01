import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ViewStyle,
} from "react-native";
import { MotiView, AnimatePresence } from "moti";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
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
  lastCompletedDate?: string;
};

type Props = {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  showSchedule?: boolean;
};

export default function TaskCard({ task, onToggle, onDelete, showSchedule }: Props) {
  const { theme } = useTheme();
  const today = new Date().toISOString().split("T")[0];

  const getCheckboxStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      width: 24,
      height: 24,
      borderRadius: 6,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    };

    // Task completed today
    if (task.completed && task.lastCompletedDate === today) {
      return {
        ...baseStyle,
        backgroundColor: theme.colors.primary,
        borderWidth: 0,
      };
    }

    // Task permanently completed (non-recurring or past scheduled task)
    if (task.completed) {
      const isPermanentlyCompleted = !task.schedule?.repeatDays;
      if (isPermanentlyCompleted) {
        return {
          ...baseStyle,
          backgroundColor: theme.colors.border,
          borderWidth: 0,
        };
      }
    }

    // Default uncompleted state
    return {
      ...baseStyle,
      backgroundColor: "transparent",
      borderWidth: 2,
      borderColor: theme.colors.border,
    };
  };

  const getCheckboxIcon = () => {
    if (!task.completed) return null;

    const isCompletedToday = task.lastCompletedDate === today;
    const iconName = isCompletedToday ? "checkmark-sharp" : "lock-closed";
    const iconColor = isCompletedToday ? "#fff" : theme.colors.text;

    return <Ionicons name={iconName} size={16} color={iconColor} />;
  };

  return (
    <GestureHandlerRootView>
      <Swipeable
        renderRightActions={() => (
          <TouchableOpacity
            style={[
              styles.deleteButton,
              { backgroundColor: theme.colors.error },
            ]}
            onPress={onDelete}
          >
            <Ionicons name="trash" size={24} color="white" />
          </TouchableOpacity>
        )}
      >
        <AnimatePresence>
          <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ type: "timing", duration: 300 }}
            style={[styles.card, { backgroundColor: theme.colors.card }]}
          >
            <TouchableOpacity
              style={getCheckboxStyle()}
              onPress={onToggle}
              disabled={
                task.completed &&
                (!task.schedule?.repeatDays || task.lastCompletedDate === today)
              }
            >
              {getCheckboxIcon()}
            </TouchableOpacity>
            <Text
              style={[
                styles.text,
                { color: theme.colors.text },
                task.completed && styles.completed,
              ]}
            >
              {task.title}
            </Text>

            {showSchedule && task.schedule && (
              <Text
                style={[styles.scheduleText, { color: theme.colors.secondary }]}
              >
                {task.schedule.date
                  ? new Date(task.schedule.date).toLocaleDateString()
                  : task.schedule.repeatDays
                  ? task.schedule.repeatDays.length > 2
                    ? `${task.schedule.repeatDays.slice(0, 1).join(", ")}, + ${
                        task.schedule.repeatDays.length - 1
                      } days`
                    : task.schedule.repeatDays.join(", ")
                  : ""}
              </Text>
            )}
          </MotiView>
        </AnimatePresence>
      </Swipeable>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  text: {
    fontSize: 16,
    flex: 1,
  },
  completed: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: "70%",
    marginTop: 10,
    borderRadius: 10,
  },
  scheduleText: {
    fontSize: 12,
    marginLeft: "auto",
  },
});

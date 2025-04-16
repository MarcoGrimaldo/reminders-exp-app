import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
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
};

interface Props {
  task: Task;
  onDelete: () => void;
  onToggle: () => void;
  showSchedule?: boolean;
}

export default function TaskCard({
  task,
  onDelete,
  onToggle,
  showSchedule,
}: Props) {
  const { theme } = useTheme();

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
            <Checkbox
              value={task.completed}
              onValueChange={onToggle}
              color={task.completed ? theme.colors.primary : undefined}
            />
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

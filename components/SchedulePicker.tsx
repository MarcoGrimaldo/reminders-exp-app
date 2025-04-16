// components/SchedulePicker.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  value: {
    repeatDays?: string[];
    date?: string;
  } | null;
  onChange: (schedule: Props["value"]) => void;
};

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function SchedulePicker({ value, onChange }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);

  const toggleDay = (day: string) => {
    const current = value?.repeatDays || [];
    const updated = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day];
    onChange({ repeatDays: updated });
  };

  const handleDatePicked = (date: Date) => {
    const formatted = date.toISOString().split("T")[0]; // yyyy-mm-dd
    onChange({ date: formatted });
    setCalendarVisible(false);
  };

  const clearSchedule = () => {
    onChange(null); // Equivalent to "Nop"
  };

  const displayLabel = () => {
    if (!value) return "Nop";
    if (value.date) return `📅 ${value.date}`;
    if (value.repeatDays?.length) return value.repeatDays.join(", ");
    return "Nop";
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setExpanded((prev) => !prev)}
      >
        <Text style={styles.dropdownText}>Schedule: {displayLabel()}</Text>
        <Ionicons name="chevron-down" size={18} />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.menu}>
          <TouchableOpacity style={styles.option} onPress={clearSchedule}>
            <Text style={styles.optionText}>Nop</Text>
          </TouchableOpacity>

          {daysOfWeek.map((day) => (
            <TouchableOpacity
              key={day}
              style={styles.option}
              onPress={() => toggleDay(day)}
            >
              <Text style={styles.optionText}>
                {value?.repeatDays?.includes(day) ? "✅ " : ""}
                {day}s
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.option}
            onPress={() => {
              setCalendarVisible(true);
              setExpanded(false);
            }}
          >
            <Text style={styles.optionText}>Select day on calendar</Text>
            <Ionicons name="calendar-outline" size={18} />
          </TouchableOpacity>
        </View>
      )}

      <DateTimePickerModal
        isVisible={calendarVisible}
        mode="date"
        onConfirm={handleDatePicked}
        onCancel={() => setCalendarVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 16,
  },
  menu: {
    marginTop: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    overflow: "hidden",
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionText: {
    fontSize: 16,
  },
});

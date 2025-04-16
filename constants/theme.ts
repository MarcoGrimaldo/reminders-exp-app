type LabelBackground = {
  Work: string;
  Routine: string;
  Shopping: string;
  Urgent: string;
  Personal: string;
  [key: string]: string;
};

export const lightTheme = {
  colors: {
    primary: "#1e40af",
    background: "#ffffff",
    card: "#ffffff",
    text: "#000000",
    border: "#e5e7eb",
    notification: "#ef4444",
    secondary: "#6b7280",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    labelBackground: {
      Work: "#3b82f620",
      Routine: "#10b98120",
      Shopping: "#f59e0b20",
      Urgent: "#ef444420",
      Personal: "#8b5cf620",
    } as LabelBackground,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
};

export const darkTheme = {
  colors: {
    primary: "#60a5fa",
    background: "#111827",
    card: "#1f2937",
    text: "#ffffff",
    border: "#374151",
    notification: "#f87171",
    secondary: "#9ca3af",
    success: "#34d399",
    warning: "#fbbf24",
    error: "#f87171",
    labelBackground: {
      Work: "#3b82f640",
      Routine: "#10b98140",
      Shopping: "#f59e0b40",
      Urgent: "#ef444440",
      Personal: "#8b5cf640",
    } as LabelBackground,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
};

export type Theme = typeof lightTheme;

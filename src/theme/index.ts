export const theme = {
  colors: {
    primary: "#10b981", // Emerald 500
    secondary: "#3b82f6", // Blue 500
    accent: "#f59e0b", // Amber 500
    background: "#000000",
    text: {
      primary: "#ffffff",
      secondary: "#9ca3af", // Gray 400
      muted: "#6b7280", // Gray 500
      inverse: "#000000",
    },
    glass: {
      border: "rgba(255, 255, 255, 0.08)",
      bg: "rgba(20, 20, 20, 0.6)",
    },
    status: {
      success: "#10b981",
      error: "#ef4444",
      warning: "#f59e0b",
      info: "#3b82f6",
    },
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    full: 9999,
  },
  typography: {
    h1: { fontSize: 32, fontWeight: "700" },
    h2: { fontSize: 24, fontWeight: "600" },
    h3: { fontSize: 20, fontWeight: "600" },
    body: { fontSize: 16, fontWeight: "400" },
    caption: { fontSize: 12, fontWeight: "400" },
  },
};

export const darkTheme = theme;

export const lightTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    background: "#ffffff",
    text: {
      primary: "#000000",
      secondary: "#4b5563", // Gray 600
      muted: "#9ca3af", // Gray 400
      inverse: "#ffffff",
    },
    glass: {
      border: "rgba(0, 0, 0, 0.08)",
      bg: "rgba(255, 255, 255, 0.6)",
    },
  },
};

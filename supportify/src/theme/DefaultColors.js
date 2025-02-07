import { createTheme } from "@mui/material/styles";
import typography from "./Typography";
import { shadows } from "./Shadows";

const commonPalette = {
  success: {
    main: "#4CAF50",
    light: "#81C784",
    dark: "#388E3C",
    contrastText: "#ffffff",
  },
  error: {
    main: "#F44336",
    light: "#EF9A9A",
    dark: "#D32F2F",
    contrastText: "#ffffff",
  },
  warning: {
    main: "#FF9800",
    light: "#FFB74D",
    dark: "#F57C00",
    contrastText: "#ffffff",
  },
  text: {
    primary: "#212121",
    secondary: "#757575",
  },
  divider: "#BDBDBD",
};

const baselightTheme = createTheme({
  direction: "ltr",
  palette: {
    primary: {
      main: "#00796B",
      light: "#48A999",
      dark: "#004D40",
      50: "#E0F2F1",
      100: "#B2DFDB",
      200: "#80CBC4",
      300: "#4DB6AC",
      400: "#26A69A",
      500: "#00796B",
      600: "#00695C",
      700: "#004D40",
      800: "#003D33",
      900: "#00251A",
    },
    secondary: {
      main: "#1976D2",
      light: "#63A4FF",
      dark: "#004BA0",
      50: "#E3F2FD",
      100: "#BBDEFB",
      200: "#90CAF9",
      300: "#64B5F6",
      400: "#42A5F5",
      500: "#1976D2",
      600: "#1565C0",
      700: "#0D47A1",
      800: "#0B3D91",
      900: "#082A6C",
    },
    ...commonPalette,
  },
  typography,
  shadows,
});

const cyanTheme = createTheme({
  direction: "ltr",
  palette: {
    primary: {
      main: "#00BCD4",
      light: "#62EFFF",
      dark: "#008394",
      50: "#E0F7FA",
      100: "#B2EBF2",
      200: "#80DEEA",
      300: "#4DD0E1",
      400: "#26C6DA",
      500: "#00BCD4",
      600: "#00ACC1",
      700: "#008394",
      800: "#007C91",
      900: "#005662",
    },
    secondary: {
      main: "#FFC107",
      light: "#FFD54F",
      dark: "#FFA000",
      50: "#FFF8E1",
      100: "#FFECB3",
      200: "#FFE082",
      300: "#FFD54F",
      400: "#FFCA28",
      500: "#FFC107",
      600: "#FFB300",
      700: "#FFA000",
      800: "#FF8F00",
      900: "#FF6F00",
    },
    ...commonPalette,
  },
  typography,
  shadows,
});

const blueTheme = createTheme({
  direction: "ltr",
  palette: {
    primary: {
      main: "#1E88E5",
      light: "#6AB7FF",
      dark: "#005CB2",
      50: "#E3F2FD",
      100: "#BBDEFB",
      200: "#90CAF9",
      300: "#64B5F6",
      400: "#42A5F5",
      500: "#1E88E5",
      600: "#1A76D2",
      700: "#1565C0",
      800: "#0D47A1",
      900: "#0B3D91",
    },
    secondary: {
      main: "#C62828",
      light: "#FF5F52",
      dark: "#8E0000",
      50: "#FFEBEE",
      100: "#FFCDD2",
      200: "#EF9A9A",
      300: "#E57373",
      400: "#EF5350",
      500: "#C62828",
      600: "#B71C1C",
      700: "#9E1414",
      800: "#8E0000",
      900: "#6C0000",
    },
    ...commonPalette,
  },
  typography,
  shadows,
});

const purpleTheme = createTheme({
  palette: {
    primary: {
      main: "#9C27B0",
      light: "#E1BEE7",
      dark: "#7B1FA2",
      50: "#F3E5F5",
      100: "#E1BEE7",
      200: "#CE93D8",
      300: "#BA68C8",
      400: "#AB47BC",
      500: "#9C27B0",
      600: "#8E24AA",
      700: "#7B1FA2",
      800: "#6A1B9A",
      900: "#4A148C",
    },
    secondary: {
      main: "#F57C00",
      light: "#FFB74D",
      dark: "#EF6C00",
      50: "#FFF3E0",
      100: "#FFE0B2",
      200: "#FFCC80",
      300: "#FFB74D",
      400: "#FFA726",
      500: "#F57C00",
      600: "#E65100",
      700: "#DD2C00",
      800: "#BF360C",
      900: "#3E2723",
    },
    ...commonPalette,
  },
  typography,
  shadows,
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#212121",
      light: "#484848",
      dark: "#000000",
    },
    secondary: {
      main: "#616161",
      light: "#8E8E8E",
      dark: "#373737",
    },
    ...commonPalette,
  },
  typography,
  shadows,
});

const amberTheme = createTheme({
  palette: {
    primary: {
      main: "#FFC107",
      light: "#FFECB3",
      dark: "#FFA000",
    },
    secondary: {
      main: "#FF5722",
      light: "#FF8A65",
      dark: "#BF360C",
    },
    ...commonPalette,
  },
  typography,
  shadows,
});

const pinkTheme = createTheme({
  palette: {
    primary: {
      main: "#E91E63", // Vibrant pink
      light: "#F48FB1", // Light pink
      dark: "#C2185B", // Dark pink
      50: "#FCE4EC",
      100: "#F8BBD0",
      200: "#F48FB1",
      300: "#F06292",
      400: "#EC407A",
      500: "#E91E63",
      600: "#D81B60",
      700: "#C2185B",
      800: "#AD1457",
      900: "#880E4F",
    },
    secondary: {
      main: "#FFC1E3", // Soft pastel pink
      light: "#FFE5F0",
      dark: "#FF94C2",
      50: "#FFF0F6",
      100: "#FFDEE9",
      200: "#FFC1E3",
      300: "#FF94C2",
      400: "#FF6DAF",
      500: "#FF4081",
      600: "#E6396E",
      700: "#CC3365",
      800: "#B22D5A",
      900: "#99294E",
    },
    ...commonPalette,
  },
  typography,
  shadows,
});

const redTheme = createTheme({
  palette: {
    primary: {
      main: "#F44336", // Vibrant red
      light: "#EF9A9A", // Light red
      dark: "#D32F2F", // Dark red
      50: "#FFEBEE",
      100: "#FFCDD2",
      200: "#EF9A9A",
      300: "#E57373",
      400: "#EF5350",
      500: "#F44336",
      600: "#E53935",
      700: "#D32F2F",
      800: "#C62828",
      900: "#B71C1C",
    },
    secondary: {
      main: "#FF8A80", // Soft pinkish red
      light: "#FFCCBC",
      dark: "#D84315",
      50: "#FBE9E7",
      100: "#FFCCBC",
      200: "#FFAB91",
      300: "#FF8A65",
      400: "#FF7043",
      500: "#FF5722",
      600: "#F4511E",
      700: "#E64A19",
      800: "#D84315",
      900: "#BF360C",
    },
    ...commonPalette,
  },
  typography,
  shadows,
});

export {
  baselightTheme,
  cyanTheme,
  blueTheme,
  purpleTheme,
  darkTheme,
  amberTheme,
  pinkTheme,
  redTheme,
};

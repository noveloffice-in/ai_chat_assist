import { createTheme } from "@mui/material/styles";
import typography from "./Typography";
import { shadows } from "./Shadows";

const baselightTheme = createTheme({
  direction: 'ltr',
  palette: {
    primary: {
      main: '#00796B',  // Teal for primary color
      light: '#48A999',  // Light teal
      dark: '#004D40',  // Dark teal for contrast
    },
    secondary: {
      main: '#1976D2',  // Blue for secondary elements
      light: '#63A4FF',  // Light blue for hover or active states
      dark: '#004BA0',  // Dark blue for buttons or focus areas
    },
    success: {
      main: '#4CAF50',  // Green for success messages
      light: '#81C784',  // Light green for success hover states
      dark: '#388E3C',  // Dark green for active success buttons
      contrastText: '#ffffff',
    },
    info: {
      main: '#2196F3',  // Blue for informational messages
      light: '#64B5F6',  // Light blue for info hover states
      dark: '#1976D2',  // Darker blue for info active states
      contrastText: '#ffffff',
    },
    error: {
      main: '#F44336',  // Red for error messages
      light: '#EF9A9A',  // Light red for error hover states
      dark: '#D32F2F',  // Dark red for active error states
      contrastText: '#ffffff',
    },
    warning: {
      main: '#FF9800',  // Orange for warning messages
      light: '#FFB74D',  // Light orange for warning hover states
      dark: '#F57C00',  // Dark orange for active warning states
      contrastText: '#ffffff',
    },
    purple: {
      A50: '#E1BEE7',  // Light purple for backgrounds or accents
      A100: '#9C27B0',  // Vibrant purple for active states
      A200: '#7B1FA2',  // Darker purple for contrasting elements
    },
    grey: {
      100: '#F5F5F5',  // Very light grey for backgrounds
      200: '#EEEEEE',  // Light grey for dividers or borders
      300: '#E0E0E0',  // Neutral grey for elements like input fields
      400: '#BDBDBD',  // Grey for disabled text or icons
      500: '#9E9E9E',  // Regular grey for standard text
      600: '#757575',  // Dark grey for inactive or disabled elements
    },
    text: {
      primary: '#212121',  // Dark grey for primary text (messages)
      secondary: '#757575',  // Lighter grey for secondary text (timestamps, etc.)
    },
    action: {
      disabledBackground: 'rgba(0, 0, 0, 0.12)',  // Grey background for disabled elements
      hoverOpacity: 0.06,  // Subtle hover opacity for interactive elements
      hover: '#e0f7fa',  // Light cyan for hover effect
    },
    divider: '#BDBDBD',  // Divider color to separate chat bubbles or UI sections
  },
  typography,
  shadows,
  components: {
    MuiAlert: {
      styleOverrides: {
        filledSuccess: {
          backgroundColor: '#4CAF50',  // Green for success alert
          color: '#FFFFFF',
        },
      },
    },
  },
});

export { baselightTheme };

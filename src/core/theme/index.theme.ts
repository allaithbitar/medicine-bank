// src/theme/index.ts (or wherever you define your MUI theme)
import { createTheme } from "@mui/material/styles";

const baseTheme = createTheme();

const theme = createTheme({
  direction: "rtl",
  spacing: 8,
  shape: {
    borderRadius: 8,
  },

  shadows: baseTheme.shadows,
  transitions: baseTheme.transitions,
  typography: {},

  components: {
    MuiGrid: {
      defaultProps: {
        component: "div",
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {},
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        variant: "contained",
        size: "large",
      },
    },
  },
  custom: {
    containerWidths: {
      mobile: "100%",
      card: 400,
      cardSm: 450,
      cardMd: 500,
    },
    commonBoxShadow: baseTheme.shadows[3],
    commonHoverBoxShadow: baseTheme.shadows[6],
  },
});

declare module "@mui/material/styles" {
  interface Theme {
    custom: {
      containerWidths: {
        mobile: string;
        card: number;
        cardSm: number;
        cardMd: number;
      };
      commonBoxShadow: string;
      commonHoverBoxShadow: string;
    };
  }
  interface ThemeOptions {
    custom?: {
      containerWidths?: {
        mobile?: string;
        card?: number;
        cardSm?: number;
        cardMd?: number;
      };
      commonBoxShadow?: string;
      commonHoverBoxShadow?: string;
    };
  }
}

export default theme;

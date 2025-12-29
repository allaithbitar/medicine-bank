// src/theme/index.ts (or wherever you define your MUI theme)
import { grey } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

const baseTheme = createTheme();

const theme = createTheme({
  direction: "rtl",
  spacing: 8,
  shape: {
    borderRadius: 3,
  },

  shadows: baseTheme.shadows,
  transitions: baseTheme.transitions,
  typography: {
    fontFamily: "alexandria",
  },

  components: {
    MuiGrid: {
      defaultProps: {
        component: "div",
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        variant: "contained",
        size: "large",
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
        sx: { p: 2 },
      },
      styleOverrides: {
        root: {
          border: `solid 1px ${grey[300]}`,
        },
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

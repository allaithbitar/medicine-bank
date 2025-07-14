import theme from "@/core/theme/index.theme";
import { ThemeProvider } from "@mui/material";
import { Outlet } from "react-router-dom";

const AppUiWrapper = () => (
  <>
    <ThemeProvider theme={theme}>
      <Outlet />
    </ThemeProvider>
  </>
);

export default AppUiWrapper;

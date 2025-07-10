import { ThemeProvider } from "@mui/material";
import { Outlet } from "react-router-dom";
import theme from "../../theme";

const AppUiWrapper = () => (
  <>
    <ThemeProvider theme={theme}>
      <Outlet />
    </ThemeProvider>
  </>
);

export default AppUiWrapper;

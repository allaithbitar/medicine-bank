import { ThemeProvider } from "@mui/material";
import { Outlet } from "react-router-dom";
import theme from "../../theme";
import Modal from "../common/modal/modal";

const AppUiWrapper = () => (
  <>
    <ThemeProvider theme={theme}>
      <Outlet />
      <Modal />
    </ThemeProvider>
  </>
);

export default AppUiWrapper;

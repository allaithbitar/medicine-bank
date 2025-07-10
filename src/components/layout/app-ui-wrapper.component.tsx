import { ThemeProvider } from "@mui/material";
import { Outlet } from "react-router-dom";
import theme from "../../theme";
import Modal from "../common/modal/modal.component";

const AppUiWrapper = () => (
  <>
    <ThemeProvider theme={theme}>
      <Outlet />
      <Modal />
    </ThemeProvider>
  </>
);

export default AppUiWrapper;

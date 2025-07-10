import theme from "@/core/theme/index.theme";
import { ThemeProvider } from "@mui/material";
import { Outlet } from "react-router-dom";
import Modal from "../../common/modal/modal.component";

const AppUiWrapper = () => (
  <>
    <ThemeProvider theme={theme}>
      <Outlet />
      <Modal />
    </ThemeProvider>
  </>
);

export default AppUiWrapper;

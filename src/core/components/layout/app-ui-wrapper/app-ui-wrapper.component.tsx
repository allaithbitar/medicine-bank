import { Outlet } from "react-router-dom";
import ThemeContextProvider from "@/core/context/theme.context";
import ModalProvider from "../../common/modal/modal-provider.component";

const AppUiWrapper = () => (
  <>
    <ThemeContextProvider>
      <ModalProvider>
        <Outlet />
      </ModalProvider>
    </ThemeContextProvider>
  </>
);

export default AppUiWrapper;

import Box from "@mui/material/Box";
import { Suspense, useState } from "react";
import Navbar from "../navbar/components/navbar.component";
import Sidebar from "../sidebar/sidebar.component";
import { Outlet } from "react-router-dom";
import type { SxProps, Theme } from "@mui/material";
import ErrorBoundary from "@/components/errorBoundary/error-boundary.component";
import PageLoading from "../../common/page-loading/page-loading.component";
import ModalProvider from "../../common/modal/modal-provider.component";

const contentWrapperStyles: SxProps<Theme> = {
  flexGrow: 1,
  p: 1,
  paddingTop: "65px",
  minHeight: "100vh",
  background: (theme) => theme.palette.grey[50],
};

const Layout = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  return (
    <Box sx={{ display: "flex" }}>
      <ModalProvider>
        <Navbar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
        <Sidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
        <Box
          component="main"
          sx={{
            ...contentWrapperStyles,
          }}
        >
          <Box sx={{ position: "relative" }}>
            <ErrorBoundary>
              <Suspense fallback={<PageLoading />}>
                <Outlet />
              </Suspense>
            </ErrorBoundary>
          </Box>
        </Box>
      </ModalProvider>
    </Box>
  );
};

export default Layout;

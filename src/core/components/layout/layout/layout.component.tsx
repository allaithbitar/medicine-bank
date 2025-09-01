import Box from "@mui/material/Box";
import { Suspense, useState } from "react";
import Navbar from "../navbar/components/navbar.component";
import Sidebar from "../sidebar/sidebar.component";
import { Outlet } from "react-router-dom";
import ErrorBoundary from "@/components/errorBoundary/error-boundary.component";
import PageLoading from "../../common/page-loading/page-loading.component";
import { Stack } from "@mui/material";

const Layout = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  return (
    <Stack
      sx={{
        display: "flex",
        height: "100dvh",
        maxWidth: "clamp(500px, 100%, 768px)",
        marginInline: "auto",
      }}
    >
      <Navbar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
      <Sidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
      <Box
        component="main"
        sx={{
          width: "100%",
          height: "100%",
          overflow: "auto",
          bgcolor: (theme) => theme.palette.grey[100],
          p: 1,
          position: "relative",
        }}
      >
        <ErrorBoundary>
          <Suspense fallback={<PageLoading />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </Box>
    </Stack>
  );
};

export default Layout;

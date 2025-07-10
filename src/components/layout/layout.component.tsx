// import BottomNavigation from "@mui/material/BottomNavigation";
// import BottomNavigationAction from "@mui/material/BottomNavigationAction";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import LocationOnIcon from "@mui/icons-material/LocationOn";
// import HomeIcon from "@mui/icons-material/Home";
import Box from "@mui/material/Box";
import { Suspense, useState } from "react";
import Navbar from "./navbar/components/navbar";
import Sidebar from "./sidebar/sidebar";
import ErrorBoundary from "../errorBoundary/errorBoundary";
import { Outlet } from "react-router-dom";
import PageLoading from "../common/pageLoading";
import type { SxProps, Theme } from "@mui/material";

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
    </Box>
  );
};

export default Layout;

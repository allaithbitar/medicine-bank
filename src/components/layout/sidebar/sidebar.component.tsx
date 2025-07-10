import { Box, Drawer, IconButton, styled, SvgIcon } from "@mui/material";
import type { Dispatch } from "react";
import SideBarItems from "./components/sidebar-items.component";

const drawerWidth = 300;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

function Sidebar({
  openSidebar,
  setOpenSidebar,
}: {
  openSidebar: boolean;
  setOpenSidebar: Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Drawer
      onClose={() => setOpenSidebar(false)}
      sx={{
        width: openSidebar ? drawerWidth : 0,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          // marginTop: "64px",
          width: drawerWidth,
          boxSizing: "border-box",
          px: 2,
          border: "none",
          maxHeight: "100vh",
          overflowY: "auto",
        },
      }}
      anchor="left"
      variant="temporary"
      open={openSidebar}
    >
      <DrawerHeader>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: 125,
          }}
        >
          {openSidebar && (
            <img
              src={"/logo.jpeg"}
              style={{ width: 100, marginBottom: 10, borderRadius: 8 }}
              alt="app-logo"
            />
          )}

          <IconButton
            disableRipple
            onClick={() => setOpenSidebar((prev) => !prev)}
            sx={{
              color: (theme) => theme.palette.primary.main,
              flex: 1,
              ...(!openSidebar
                ? { transform: "scaleX(-1)" }
                : { position: "absolute", top: 5, right: 5, zIndex: 10 }),
            }}
          >
            <SvgIcon />
          </IconButton>
        </Box>
      </DrawerHeader>
      <SideBarItems onClick={() => setOpenSidebar(false)} />
    </Drawer>
  );
}

export default Sidebar;

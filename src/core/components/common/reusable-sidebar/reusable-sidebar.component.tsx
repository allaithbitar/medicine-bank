import { Drawer, Stack } from "@mui/material";
import { type ReactNode } from "react";

const ReusableSidebar = ({
  children,
  open,
  actions,
}: {
  children: ReactNode;
  open?: boolean;
  actions?: ReactNode;
}) => {
  return (
    <Drawer
      keepMounted
      // onClose={() => setOpenSidebar(false)}
      sx={{
        // width: openSidebar ? drawerWidth : 0,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          // marginTop: "64px",
          width: "90dvw",
          boxSizing: "border-box",
          p: 2,
          border: "none",
          height: "100dvh",
        },
      }}
      anchor="left"
      variant="temporary"
      open={open}
    >
      <Stack sx={{ height: "100%" }} gap={2}>
        <Stack sx={{ height: "100%", overflowY: "auto" }}>{children}</Stack>

        {actions}
      </Stack>
    </Drawer>
  );
};

export default ReusableSidebar;

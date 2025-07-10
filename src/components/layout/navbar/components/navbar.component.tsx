import { AppBar, Box, Toolbar, useTheme } from "@mui/material";
import type { Dispatch } from "react";
import { MdMenuOpen } from "react-icons/md";
import UserSection from "./user-selection.component";
import CustomIconButton from "../../../common/custom-icon-button.component";

function Navbar({
  setOpenSidebar,
  openSidebar,
}: {
  setOpenSidebar: Dispatch<React.SetStateAction<boolean>>;
  openSidebar: boolean;
}) {
  const theme = useTheme();
  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        bgcolor: theme.palette.background.default,
        py: 0.5,
        zIndex: 10,
      }}
    >
      <Toolbar sx={{ gap: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
            gap: 1,
          }}
        >
          <img
            src={`/logo.jpeg`}
            style={{ width: 50, borderRadius: "8px" }}
            alt="bank-logo"
          />
          <CustomIconButton
            onClick={() => setOpenSidebar((prev: any) => !prev)}
            sx={{ scale: `${!openSidebar && "-"}1 !important`, mr: 1 }}
          >
            <MdMenuOpen />
          </CustomIconButton>
        </Box>

        <Box
          sx={{
            marginInlineStart: "auto",
            display: "flex",
            gap: 1,
            width: "fit-content",
          }}
        >
          <UserSection />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;

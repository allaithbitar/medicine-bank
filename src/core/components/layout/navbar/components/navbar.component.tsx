import { IconButton, Stack } from "@mui/material";
import type { Dispatch, SetStateAction } from "react";
import { MdMenuOpen } from "react-icons/md";
import RecordVoiceOverOutlinedIcon from "@mui/icons-material/RecordVoiceOverOutlined";
import { Link } from "react-router-dom";

function Navbar({
  setOpenSidebar,
  openSidebar,
}: {
  setOpenSidebar: Dispatch<SetStateAction<boolean>>;
  openSidebar: boolean;
}) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ width: "100%", p: 1, px: 2 }}
    >
      <IconButton
        color="primary"
        onClick={() => setOpenSidebar((prev: any) => !prev)}
        sx={{ scale: `${!openSidebar && "-"}1 !important` }}
      >
        <MdMenuOpen />
      </IconButton>
      <Stack sx={{ gap: 1, flexDirection: "row", alignItems: "center" }}>
        <Link to={`/system-broadcast`} style={{ marginInlineStart: "auto" }}>
          <IconButton color="primary">
            <RecordVoiceOverOutlinedIcon />
          </IconButton>
        </Link>
        <img
          src={`/logo.jpeg`}
          style={{ width: 50, borderRadius: "8px" }}
          alt="bank-logo"
        />
      </Stack>
    </Stack>
  );
}

export default Navbar;

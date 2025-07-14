import { IconButton, Stack } from "@mui/material";
import type { Dispatch, SetStateAction } from "react";
import { MdMenuOpen } from "react-icons/md";

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
      <img
        src={`/logo.jpeg`}
        style={{ width: 50, borderRadius: "8px" }}
        alt="bank-logo"
      />
    </Stack>
  );
}

export default Navbar;

import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useState, type ReactNode } from "react";
import HomeIcon from "@mui/icons-material/Home";
import { Stack } from "@mui/material";

const Layout = ({ children }: { children: ReactNode }) => {
  const [value, setValue] = useState(0);
  return (
    <Stack
      sx={{
        height: "100dvh",
        backgroundColor: (theme) => theme.palette.grey[100],
      }}
    >
      <Box sx={{ flex: 1, overflow: "auto" }}>{children}</Box>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
        <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
      </BottomNavigation>
    </Stack>
  );
};

export default Layout;

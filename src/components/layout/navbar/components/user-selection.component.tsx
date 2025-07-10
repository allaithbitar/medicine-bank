import { useState } from "react";
import {
  Avatar,
  Box,
  Chip,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Typography,
  useTheme,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../redux/slices/auth.slice";
import { handleLogout } from "../../../../utils/helpers";

function UserSection() {
  const { username } = useSelector(selectCurrentUser);
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const openUserMenu = Boolean(anchorEl);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    handleLogout();
  };

  return (
    <Box>
      <Menu
        anchorEl={anchorEl}
        open={openUserMenu}
        onClose={handleCloseUserMenu}
        onClick={handleCloseUserMenu}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            minWidth: 260,
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ px: 2, pt: 1 }}>
          <Typography gutterBottom component="div">
            {username}
          </Typography>
        </Box>
        <Divider />
        <MenuList>
          <MenuItem onClick={handleLogoutClick}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>
      <Chip
        sx={{
          height: "48px",
          alignItems: "center",
          borderRadius: "27px",
          transition: "all .2s ease-in-out",
          borderColor: theme.palette.primary.light,
          backgroundColor: theme.palette.primary.light,
          '&[aria-controls="menu-list-grow"], &:hover': {
            borderColor: theme.palette.primary.main,
            background: `${theme.palette.primary.main} !important`,
            color: `${theme.palette.primary.light} !important`,
          },
          "& .MuiChip-label": {
            lineHeight: 0,
          },
          cursor: "pointer",
        }}
        icon={
          <Avatar
            sx={{
              width: "34px",
              height: "34px",
              fontSize: "1.2rem",
              margin: "8px 0 8px 8px !important",
              cursor: "pointer",
            }}
            aria-controls={openUserMenu ? "menu-list-grow" : undefined}
            aria-haspopup="true"
            color="inherit"
          />
        }
        label={<SettingsIcon color="action" />}
        variant="outlined"
        aria-controls={openUserMenu ? "menu-list-grow" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        color="primary"
      />
    </Box>
  );
}

export default UserSection;

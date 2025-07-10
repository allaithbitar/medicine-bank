import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import type { ReactElement } from "react";
import { NavLink } from "react-router-dom";

interface ISideBarListItem {
  level: number;
  label: string;
  isSelected?: boolean;
  href?: string;
  icon?: ReactElement;
  onClick?: () => void;
}

export default function SideBarListItem({
  level,
  label,
  href,
  icon,
  onClick,
}: ISideBarListItem) {
  const theme = useTheme();

  return (
    <ListItemButton
      key={label}
      component={NavLink}
      to={href ?? ""}
      onClick={onClick}
      sx={{
        borderRadius: `8px`,
        mb: 0.5,
        alignItems: "flex-start",
        backgroundColor: level > 1 ? "transparent" : "inherit",
        py: level > 1 ? 1 : 1.25,
        pl: `${level * 24}px`,
        gap: 1,
        "&.active": {
          color: theme.palette.primary.main,
          backgroundColor: theme.palette.action.selected,
        },
        textDecoration: "none",
      }}
    >
      <ListItemIcon
        sx={{
          color: "inherit",
          my: "auto",
          minWidth: icon ? 18 : 15,
        }}
      >
        {icon}
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography color="inherit" sx={{ my: "auto" }}>
            {label}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

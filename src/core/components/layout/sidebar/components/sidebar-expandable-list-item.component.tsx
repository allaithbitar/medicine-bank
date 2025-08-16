import {
  Box,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import { useState, type ReactElement } from "react";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import type { IItem } from "./sidebar-items.component";
import SideBarListItem from "./sidebar-list-item.component";

const SidebarExpandableItem = ({
  level,
  label,
  childrens,
  icon,
  onClick,
}: {
  level: number;
  label: string;
  icon?: ReactElement;
  childrens: IItem[];
  onClick: () => void;
}) => {
  const theme = useTheme();

  const childrensPathNames = childrens.map((c) => c.href).filter(Boolean);
  const { pathname } = useLocation();

  const isAnyChildActive = childrensPathNames.includes(pathname);

  const [expand, setExpand] = useState(isAnyChildActive);

  return (
    <Box
      sx={{
        background: (theme) => (expand ? theme.palette.grey[50] : "inherit"),
        borderRadius: 1,
      }}
    >
      <ListItemButton
        sx={{
          borderRadius: 1,
          mb: 0.5,
          alignItems: "flex-start",
          py: level > 1 ? 1 : 1.25,
          pl: `${level * 24}px`,
          gap: 1,
          color: theme.palette.text.primary,
          ...(isAnyChildActive && {
            color: theme.palette.primary.main,
            backgroundColor: theme.palette.action.selected,
          }),
        }}
        onClick={() => setExpand((prev) => !prev)}
      >
        <ListItemIcon
          sx={{
            my: "auto",
            minWidth: icon ? 18 : 15,
            color: "inherit",
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
        {expand ? (
          <ExpandLess style={{ marginTop: "auto", marginBottom: "auto" }} />
        ) : (
          <ExpandMore style={{ marginTop: "auto", marginBottom: "auto" }} />
        )}
      </ListItemButton>
      <Collapse in={expand} timeout="auto" unmountOnExit>
        <List
          component="div"
          disablePadding
          sx={{
            position: "relative",
          }}
        >
          {childrens.map((c) =>
            c.href ? (
              <SideBarListItem
                onClick={onClick}
                key={c.href}
                href={c.href}
                label={c.label}
                level={2}
                icon={c.icon}
              />
            ) : null,
          )}
        </List>
      </Collapse>
    </Box>
  );
};

export default SidebarExpandableItem;

import { Person } from "@mui/icons-material";
import { Avatar, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";
import CustomIconButton from "../custom-icon-button/custom-icon-button.component";

type TCardAvatarProps = {
  name?: string;
  actions?: [
    {
      icon: ReactNode;
      onClick?: () => void;
    },
  ];
  extras?: ReactNode;
};

const CardAvatar = ({ name, actions, extras }: TCardAvatarProps) => {
  return (
    <Stack
      direction="row"
      sx={{
        alignItems: "center",
        width: "100%",
      }}
    >
      <Avatar
        sx={{
          bgcolor: "rgba(255,255,255,0.2)",
          mr: 1.5,
        }}
      >
        <Person sx={{ color: "white" }} />
      </Avatar>
      <Typography
        color="white"
        noWrap
        sx={{ textOverflow: "ellipsis", flex: 1 }}
      >
        {name}
      </Typography>
      {actions?.map((a) => (
        <CustomIconButton onClick={a.onClick}>{a.icon}</CustomIconButton>
      ))}
      {extras}
    </Stack>
  );
};

export default CardAvatar;

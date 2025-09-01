import { Add, MoreHoriz } from "@mui/icons-material";
import { SpeedDial, SpeedDialAction } from "@mui/material";
import type { ReactNode } from "react";

type TProps = {
  actions: {
    label: string;
    icon: ReactNode;
    onClick?: () => void;
  }[];
  icon?: ReactNode;
};

const ActionsFab = ({ icon, actions }: TProps) => {
  return (
    <SpeedDial
      ariaLabel=""
      sx={{
        position: "absolute",
        right: 10,
        bottom: 10,
        zIndex: 998,
      }}
      icon={icon || <MoreHoriz />}
    >
      {actions.map((a) => (
        <SpeedDialAction
          onClick={a.onClick}
          key={a.label}
          icon={<Add />}
          slotProps={{
            tooltip: {
              open: true,
              title: a.label,
            },
            staticTooltipLabel: { sx: { textWrap: "nowrap" } },
          }}
        />
      ))}
    </SpeedDial>
  );
};

export default ActionsFab;

import { Fab } from "@mui/material";
import type { ComponentProps, ReactNode } from "react";

const ActionFab = ({
  icon,
  ...props
}: { icon: ReactNode } & ComponentProps<typeof Fab>) => {
  return (
    <Fab
      {...props}
      sx={{
        position: "fixed",
        right: 10,
        bottom: 10,
        zIndex: 998,
        ...props.sx,
      }}
    >
      {icon}
    </Fab>
  );
};

export default ActionFab;

import { Typography } from "@mui/material";
import type { PropsWithChildren } from "react";

const RequiredLabel = ({
  required,
  children,
}: PropsWithChildren<{
  required?: boolean;
}>) => {
  return (
    <Typography color="textSecondary" sx={{ mb: 0.8 }}>
      {children}
      {required && (
        <Typography component="span" color="error">
          {" "}
          *
        </Typography>
      )}
    </Typography>
  );
};

export default RequiredLabel;

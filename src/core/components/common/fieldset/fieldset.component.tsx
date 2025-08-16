import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

const FieldSet = ({
  label,
  children,
}: {
  label?: string;
  children: ReactNode;
}) => {
  return (
    <Box>
      <Box
        component="fieldset"
        sx={{
          borderRadius: 1,
          p: 2,
          border: (theme) => `solid 1px ${theme.palette.grey[400]}`,
        }}
      >
        <Typography
          fontSize={18}
          component="legend"
          fontWeight="400"
          sx={{ mx: 1 }}
        >
          {label}
        </Typography>
        <div>{children}</div>
      </Box>
    </Box>
  );
};

export default FieldSet;

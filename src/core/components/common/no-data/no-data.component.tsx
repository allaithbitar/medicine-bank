import { cloneElement, type ReactElement } from "react";
import { Box, Typography } from "@mui/material";

function Nodata({
  icon,
  title = "No Data Found !",
  subTitle = "Add some employees to see them displayed here.",
}: {
  icon: ReactElement<{ sx?: object }>;
  title?: string;
  subTitle?: string;
}) {
  const iconWithStyle = cloneElement(icon, {
    sx: {
      fontSize: 60,
      color: "text.disabled",
      mb: 2,
      ...(icon.props.sx || {}),
    },
  });

  return (
    <Box sx={{ textAlign: "center", py: 8 }}>
      {iconWithStyle}
      <Typography
        variant="h6"
        color="text.primary"
        fontWeight="medium"
        gutterBottom
      >
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {subTitle}
      </Typography>
    </Box>
  );
}

export default Nodata;

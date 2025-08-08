import { type ComponentProps } from "react";
import { Stack, Typography } from "@mui/material";
import STRINGS from "@/core/constants/strings.constant";
import { Info } from "@mui/icons-material";

function Nodata({
  title = STRINGS.no_data_found,
  subTitle,
  icon: Icon = Info,
  iconSx,
}: {
  icon?: typeof Info;
  title?: string;
  subTitle?: string;
  iconSx?: ComponentProps<typeof Info>["sx"];
}) {
  return (
    <Stack sx={{ alignItems: "center", my: 6 }}>
      <Icon
        sx={{
          fontSize: 60,
          color: "text.disabled",
          ...iconSx,
        }}
      />
      <Typography
        variant="subtitle1"
        color="text.primary"
        fontWeight="medium"
        gutterBottom
      >
        {title}
      </Typography>
      <Typography variant="subtitle2" color="text.secondary">
        {subTitle}
      </Typography>
    </Stack>
  );
}

export default Nodata;

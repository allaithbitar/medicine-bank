import theme from "@/core/theme/index.theme";
import type { Theme } from "@emotion/react";
import { Stack, Typography, type SxProps } from "@mui/material";

function Header({ title, sx }: { title: string; sx?: SxProps<Theme> }) {
  return (
    <Stack flexDirection="row" gap={1} sx={{ py: 1, width: "100%", ...sx }}>
      {/* <Box
        sx={{
          p: 0.2,
          bgcolor: theme.palette.secondary.main,
          borderRadius: 100,
        }}
      /> */}
      <Typography
        variant="h6"
        sx={{
          bgcolor: theme.palette.grey[200],
          width: "100%",
          textAlign: "center",
          //   color: theme.palette.primary.contrastText,
          px: 2,
          py: 1,
          borderRadius: "3px",
        }}
      >
        {title}
      </Typography>
    </Stack>
  );
}

export default Header;

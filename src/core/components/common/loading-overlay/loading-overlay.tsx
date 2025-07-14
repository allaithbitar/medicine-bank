import type { Theme } from "@emotion/react";
import { Box, CircularProgress, type SxProps } from "@mui/material";

const LoadingOverlay = ({
  sx,
  spinnerSize,
}: {
  sx?: SxProps<Theme>;
  spinnerSize?: number;
}) => (
  <Box
    sx={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(255,255,255,0.8)",
      display: "grid",
      placeItems: "center",
      zIndex: 999,
      ...sx,
    }}
  >
    <CircularProgress {...(spinnerSize ? { size: spinnerSize } : {})} />
  </Box>
);

export default LoadingOverlay;

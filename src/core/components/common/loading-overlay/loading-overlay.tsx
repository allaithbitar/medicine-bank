import type { Theme } from "@emotion/react";
import { Backdrop, CircularProgress, type SxProps } from "@mui/material";

const LoadingOverlay = ({
  sx,
  spinnerSize,
}: {
  sx?: SxProps<Theme>;
  spinnerSize?: number;
}) => (
  <Backdrop
    open
    sx={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(255,255,255,0.3)",
      backdropFilter: "blur(2px)",
      display: "grid",
      placeItems: "center",
      zIndex: 999,
      ...sx,
    }}
  >
    <CircularProgress {...(spinnerSize ? { size: spinnerSize } : {})} />
  </Backdrop>
);

export default LoadingOverlay;

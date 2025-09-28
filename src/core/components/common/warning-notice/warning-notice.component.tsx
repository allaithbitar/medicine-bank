import React from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

export interface WarningNoticeProps {
  /**
   * Message shown inside the warning. Can be plain text or JSX.
   */
  message: React.ReactNode;
  /**
   * MUI Alert variant
   * - "standard" | "outlined" | "filled"
   */
  variant?: "standard" | "outlined" | "filled";
  /**
   * Optional title shown before the message. If omitted, no title is rendered.
   */
  title?: React.ReactNode;
  /**
   * sx prop forwarded to the root Alert
   */
  sx?: SxProps<Theme>;
  /**
   * Optional id for accessibility / testing
   */
  id?: string;
}

/**
 * WarningNotice
 *
 * A small, reusable warning component using MUI v5.
 */
const WarningNotice: React.FC<WarningNoticeProps> = ({
  message,
  variant = "outlined",
  title,
  sx,
  id,
}) => {
  return (
    <Alert
      id={id}
      icon={<WarningAmberIcon fontSize="medium" />}
      severity="warning"
      variant={variant}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.25,
        px: 2,
        py: 1.25,
        ...((sx as any) || {}),
      }}
      role="status"
    >
      {title ? (
        <AlertTitle sx={{ fontSize: "0.95rem", mr: 0.5 }}>{title}</AlertTitle>
      ) : null}

      <Box
        component="span"
        color="GrayText"
        sx={{ fontSize: "0.95rem", lineHeight: 1.25 }}
      >
        {message}
      </Box>
    </Alert>
  );
};

export default WarningNotice;

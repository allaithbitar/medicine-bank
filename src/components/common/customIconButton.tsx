import { forwardRef } from "react";
import { IconButton, type IconButtonProps, useTheme } from "@mui/material";

const CustomIconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, sx, ...props }, ref) => {
    const theme = useTheme();

    const defaultBgColor = "rgba(255,255,255,0.2)";
    const defaultIconColor = theme.palette.primary.dark;

    return (
      <IconButton
        ref={ref}
        sx={{
          background: defaultBgColor,
          p: 1,
          color: defaultIconColor,
          borderRadius: theme.shape.borderRadius,
          ...sx,
        }}
        {...props}
      >
        {children}
      </IconButton>
    );
  }
);

CustomIconButton.displayName = "CustomIconButton";

export default CustomIconButton;

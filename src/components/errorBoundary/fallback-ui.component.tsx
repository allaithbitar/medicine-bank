import { Box, Button, Stack, Typography } from "@mui/material";
import HealingIcon from "@mui/icons-material/Healing";
import { Link, useRouteError } from "react-router-dom";
import STRINGS from "@/core/constants/strings.constant";

const FallbackUI = ({
  errorMessage,
  buttonText,
  buttonHref,
}: {
  errorMessage?: string;
  buttonText?: string;
  buttonHref?: string;
}) => {
  const error = useRouteError() as string;
  return (
    <Stack
      sx={{
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
      }}
    >
      <HealingIcon sx={{ fontSize: 100 }} />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          textAlign: "center",
        }}
      >
        <Box>
          <Typography variant="body2">
            {STRINGS.something_went_wrong}
          </Typography>
          <Typography variant="caption"> {errorMessage || error}</Typography>
        </Box>
      </Box>
      {buttonHref ? (
        <Link to={buttonHref}>
          <Button variant="outlined" size="small">
            {buttonText || "Reload The App"}
          </Button>
        </Link>
      ) : (
        <Button
          variant="outlined"
          size="small"
          onClick={() => window.location.reload()}
        >
          {buttonText || "Reload The App"}
        </Button>
      )}
    </Stack>
  );
};

export default FallbackUI;

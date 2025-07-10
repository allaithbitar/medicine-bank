import { Box, Button, Card, Typography } from "@mui/material";
import HealingIcon from "@mui/icons-material/Healing";
import { Link, useRouteError } from "react-router-dom";

const CONTAINER = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: 1,
  textAlign: "center",
  padding: 10,
  height: "65vh",
  my: "auto",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
};

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
    <Card sx={CONTAINER}>
      <HealingIcon sx={{ fontSize: 100 }} />
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box>
          <Typography variant="body2">Something went wrong</Typography>
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
    </Card>
  );
};

export default FallbackUI;

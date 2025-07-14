import { Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{ height: "100dvh" }}
    >
      <Typography variant="h1">404</Typography>
      <Typography variant="h6">Should handle it better</Typography>
      <Button onClick={() => navigate("/")} sx={{ mt: 4 }}>
        Home
      </Button>
    </Stack>
  );
};

export default NotFoundPage;

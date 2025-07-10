import { Typography } from "@mui/material";
import { useRouteError } from "react-router-dom";

function AuthenticatedErrorPage() {
  const error = useRouteError() as any;
  return (
    <>
      <Typography variant="h1" sx={{ textAlign: "center" }}>
        Uncaught error!
      </Typography>
      <Typography variant="caption" sx={{ textAlign: "center" }}>
        {error.message || error.toString()}
      </Typography>
    </>
  );
}

export default AuthenticatedErrorPage;

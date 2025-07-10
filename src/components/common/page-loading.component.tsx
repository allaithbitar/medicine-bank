import { Box, CircularProgress } from "@mui/material";

const PageLoading = () => (
  <Box
    sx={{
      height: "80vh",
      width: "100%",
      display: "grid",
      placeItems: "center",
    }}
  >
    <CircularProgress size={100} />
  </Box>
);

export default PageLoading;

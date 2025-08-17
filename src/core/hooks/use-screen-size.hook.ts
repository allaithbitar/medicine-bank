import useMediaQuery from "@mui/material/useMediaQuery";
import theme from "../theme/index.theme";

export default function useScreenSize() {
  const isTablet = useMediaQuery(theme.breakpoints.up("sm"));

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return { isMobile, isTablet };
}

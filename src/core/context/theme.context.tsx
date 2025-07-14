import React, { type PropsWithChildren } from "react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";

import { ThemeProvider } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import theme from "../theme/index.theme";
// import ar from "date-fns/locale/ar";
// import en from "date-fns/locale/en-US";
// import createThemeWithDirection from "./index";
// import useAppContext from "../hooks/useAppContext";

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const RtlWrapper = ({
  isRtl,
  children,
}: React.PropsWithChildren<{ isRtl: boolean }>) =>
  isRtl ? (
    <CacheProvider value={cacheRtl}>
      <div dir={isRtl ? "rtl" : "ltr"}>{children}</div>
    </CacheProvider>
  ) : (
    <>{children}</>
  );

const ThemeContextProvider = ({ children }: PropsWithChildren) => {
  const isEN = false;
  // const themePalette = selectThemePalette();

  // const theme = useMemo(
  //   () => the,
  //   [isEN, themePalette],
  // );

  // const memoizedContextValue = useMemo(
  //   () => ({
  //     isEN,
  //     setIsEN: () => dispatch(setContext({ language: isEN ? "AR" : "EN" })),
  //   }),
  //   [dispatch, isEN],
  // );

  return (
    <>
      <RtlWrapper isRtl={!isEN}>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            {children}
          </LocalizationProvider>
        </ThemeProvider>
      </RtlWrapper>
    </>
  );
};

export default ThemeContextProvider;

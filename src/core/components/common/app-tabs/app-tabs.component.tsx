import { useEffect, type ReactElement, type ReactNode } from "react";
import {
  Tabs,
  Tab,
  Stack,
  Box,
  type TabsProps,
  type TabProps,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";

interface AppTabItem {
  value: string;
  label: ReactNode;
  icon?: ReactElement;
  tabProps?: Omit<TabProps, "value" | "label">;
}

interface AppTabsProps extends Omit<TabsProps, "value" | "onChange"> {
  tabs: AppTabItem[];
  queryParamName?: string;
}

const StyledTab = styled(Tab)(({ theme }) => ({
  color: theme.palette.text.primary,
  transition:
    "background-color 0.3s ease, color 0.3s ease, border-radius 0.3s ease",
  "&.Mui-selected": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "& .MuiTab-iconWrapper": {
      color: theme.palette.primary.contrastText,
    },
  },
  "&.Mui-selected:first-of-type": {
    borderTopLeftRadius: theme.shape.borderRadius,
    borderBottomLeftRadius: theme.shape.borderRadius,
  },
  "&.Mui-selected:last-of-type": {
    borderTopRightRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
  },
  "&.Mui-selected:not(:first-of-type):not(:last-of-type)": {
    borderRadius: 0,
  },
}));

const AppTabs = ({
  tabs,
  queryParamName = "tab",
  ...restTabsProps
}: AppTabsProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const urlSearchParams = new URLSearchParams(location.search);
  const currentQueryValue = urlSearchParams.get(queryParamName);
  const activeTabValue = currentQueryValue || tabs[0]?.value || "";

  const handleTabChange = (newValue: string) => {
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set(queryParamName, newValue);
    navigate(`${location.pathname}?${newSearchParams.toString()}`);
  };

  useEffect(() => {
    if (!currentQueryValue) {
      handleTabChange(activeTabValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQueryValue]);

  return (
    <Tabs
      value={activeTabValue}
      onChange={(_e, v) => handleTabChange(v)}
      aria-label="app navigation tabs"
      slotProps={{
        indicator: {
          style: { height: 0 },
        },
      }}
      sx={{
        "& .MuiTab-root": {
          flexGrow: 1,
          maxWidth: "none",
        },
      }}
      {...restTabsProps}
    >
      {tabs.map((tabItem) => (
        <StyledTab
          key={tabItem.value}
          value={tabItem.value}
          label={
            <Stack sx={{ flexDirection: "row", alignItems: "center" }}>
              {tabItem.icon && (
                <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                  {tabItem.icon}
                </Box>
              )}
              {tabItem.label}
            </Stack>
          }
          {...tabItem.tabProps}
        />
      ))}
    </Tabs>
  );
};

export default AppTabs;

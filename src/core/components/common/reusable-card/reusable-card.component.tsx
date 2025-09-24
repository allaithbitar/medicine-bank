import { memo, type ReactNode } from "react";
import { Card, Stack, Divider } from "@mui/material";
import theme from "@/core/theme/index.theme";

interface IReusableCardProps {
  headerBackground?: string;
  headerContent?: ReactNode;
  bodyContent?: ReactNode;
  footerContent?: ReactNode;
  cardSx?: object;
}

const ReusableCard = ({
  headerBackground,
  headerContent,
  bodyContent,
  footerContent,
  cardSx,
}: IReusableCardProps) => {
  return (
    <Card
      sx={{
        width: "100%",
        transition: "all 0.3s ease-in-out",
        // boxShadow: 3,
        ...cardSx,
      }}
    >
      {headerContent && (
        <Stack
          sx={{
            height: 70,
            width: "100%",
            justifyContent: "center",
            px: 2,
            background:
              headerBackground ||
              `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
          }}
        >
          {headerContent}
        </Stack>
      )}{" "}
      {bodyContent && <Stack sx={{ p: 2 }}>{bodyContent}</Stack>}
      {footerContent && (
        <>
          <Divider />
          <Stack
            sx={{
              p: 1.5,
              borderColor: "grey.100",
            }}
          >
            {footerContent}
          </Stack>
        </>
      )}
    </Card>
  );
};

export default memo(ReusableCard);

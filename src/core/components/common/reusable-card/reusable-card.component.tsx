import { memo, type ReactNode } from "react";
import { Card, CardHeader, CardContent, CardActions } from "@mui/material";

interface IReusableCardProps {
  headerBackground?: string;
  headerContent: ReactNode;
  bodyContent: ReactNode;
  footerContent: ReactNode;
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
        minWidth: 400,
        mx: "auto",
        transition: "all 0.3s ease-in-out",
        overflow: "hidden",
        boxShadow: 3,
        "&:hover": { boxShadow: 6 },
        ...cardSx,
      }}
    >
      <CardHeader
        title={headerContent}
        sx={{
          background: (theme) =>
            headerBackground ||
            `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
          "& .MuiCardHeader-title": {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          },
        }}
      />
      {bodyContent && <CardContent sx={{ pb: 0 }}>{bodyContent}</CardContent>}
      {footerContent && (
        <CardActions
          sx={{
            bgcolor: "grey.50",
            p: 2,
            borderTop: "1px solid",
            borderColor: "grey.100",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {footerContent}
        </CardActions>
      )}
    </Card>
  );
};

export default memo(ReusableCard);

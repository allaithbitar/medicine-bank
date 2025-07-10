import React, { memo } from "react";
import { Card, CardHeader, CardContent, CardActions } from "@mui/material";

interface ReusableCardProps {
  headerBackground?: string;
  headerContent: React.ReactNode;
  bodyContent: React.ReactNode;
  footerContent: React.ReactNode;
  cardSx?: object;
}

const ReusableCard: React.FC<ReusableCardProps> = ({
  headerBackground,
  headerContent,
  bodyContent,
  footerContent,
  cardSx,
}) => {
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
      <CardContent sx={{ pb: 0 }}>{bodyContent}</CardContent>
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
    </Card>
  );
};

export default memo(ReusableCard);

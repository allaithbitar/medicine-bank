import STRINGS from "@/core/constants/strings.constant";
import { Avatar, Box, Stack, Tooltip, Typography } from "@mui/material";
import { red, orange } from "@mui/material/colors";
import type { TRating } from "../types/rating.types";
import ReusableCardComponent from "@/core/components/common/reusable-card/reusable-card.component";
import DetailItemComponent from "@/core/components/common/detail-item/detail-item.component";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CodeIcon from "@mui/icons-material/Code";
import { memo } from "react";
import CustomIconButton from "@/core/components/common/custom-icon-button/custom-icon-button.component";
import { DeleteOutline, Edit, RateReview } from "@mui/icons-material";

const RatingCard = ({
  rating,
  onEdit,
}: {
  rating: TRating;
  onEdit: (r: TRating) => void;
}) => {
  const headerContent = (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <Box
        sx={{ display: "flex", alignItems: "center", flexGrow: 1, minWidth: 0 }}
      >
        <Avatar
          sx={{
            bgcolor: "rgba(255,255,255,0.2)",
            width: 48,
            height: 48,
            mr: 2,
          }}
        >
          <RateReview sx={{ color: "white" }} />
        </Avatar>
        <Typography
          variant="h6"
          component="div"
          color="white"
          fontWeight="semibold"
          noWrap
          sx={{ flexShrink: 1, overflow: "hidden", textOverflow: "ellipsis" }}
        >
          {rating.name}
        </Typography>
      </Box>
      <Stack
        direction="row"
        gap={1}
        sx={{ color: "white", flexShrink: 0, ml: 2 }}
      >
        <Tooltip title={STRINGS.delete} arrow>
          <CustomIconButton disabled size="small">
            <DeleteOutline sx={{ color: "white" }} />
          </CustomIconButton>
        </Tooltip>
        <Tooltip title={STRINGS.edit} arrow>
          <CustomIconButton onClick={() => onEdit(rating)} size="small">
            <Edit sx={{ color: "white" }} />
          </CustomIconButton>
        </Tooltip>
      </Stack>
    </Box>
  );

  return (
    <ReusableCardComponent
      headerContent={headerContent}
      headerBackground={`linear-gradient(to right, ${red[400]}, ${orange[400]})`}
      bodyContent={
        <Stack gap={2}>
          <DetailItemComponent
            label={STRINGS.code}
            icon={<CodeIcon />}
            value={rating.code}
          />
          <DetailItemComponent
            label={STRINGS.description}
            icon={<AssignmentIcon />}
            value={rating.description}
          />
        </Stack>
      }
      footerContent={null}
    />
  );
};

export default memo(RatingCard);

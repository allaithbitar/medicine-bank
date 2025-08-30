import { getErrorMessage } from "@/core/helpers/helpers";
import { Card, Stack, Typography } from "@mui/material";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import STRINGS from "@/core/constants/strings.constant";

const ErrorCard = ({ error }: { error: any }) => {
  return (
    <Card>
      <Stack alignItems="center">
        <SentimentDissatisfiedIcon color="primary" sx={{ fontSize: 100 }} />
        <Typography variant="body1">{STRINGS.something_went_wrong}</Typography>
        <Typography variant="body2" color="textSecondary">
          {getErrorMessage(error)}
        </Typography>
      </Stack>
    </Card>
  );
};

export default ErrorCard;

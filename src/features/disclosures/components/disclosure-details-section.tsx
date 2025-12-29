import { Stack, Typography, Box } from "@mui/material";
import Header from "@/core/components/common/header/header";
import STRINGS from "@/core/constants/strings.constant";
import theme from "@/core/theme/index.theme";

const DisclosureDetailsSection = ({
  details,
}: {
  details?: Record<string, any> | null;
}) => {
  if (!details || Object.keys(details).length === 0) return null;

  return (
    <>
      <Box sx={{ px: 2, pt: 1 }}>
        <Header title={STRINGS.disclosures_details} />
      </Box>

      <Stack gap={2} sx={{ p: 2 }}>
        {Object.entries(details).map(([key, val]) => (
          <Stack key={key} gap={1}>
            <Typography
              variant="body1"
              sx={{
                bgcolor: theme.palette.grey[200],
                px: 1,
                py: 0.5,
                borderRadius: 0.5,
              }}
            >
              {STRINGS[key as keyof typeof STRINGS] ?? key}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {val ? String(val) : STRINGS.none}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </>
  );
};

export default DisclosureDetailsSection;

import { RadioButtonUnchecked } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';

const CustomChartLegend = ({ items }: { items: { label: string; color: string }[] }) => {
  return (
    <Stack direction="row" flexWrap="wrap" gap={1} justifyContent="center">
      {items.map((i) => (
        <Stack gap={0.5} direction="row" alignItems="center" key={i.label} color={i.color} sx={{ fontSize: 12 }}>
          <RadioButtonUnchecked fontSize="inherit" />
          <Typography fontSize="inherit">{i.label}</Typography>
        </Stack>
      ))}
    </Stack>
  );
};

export default CustomChartLegend;

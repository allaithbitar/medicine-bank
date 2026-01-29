import { Tabs, Tab, Card, Stack } from '@mui/material';
// TODOD CHECK
const DisclosureTabs = ({
  value = 0,
  onChange,
  tabs = [],
}: {
  value?: number;
  onChange: (v: number) => void;
  tabs: { label: string; node: React.ReactNode }[];
}) => (
  <Stack gap={1}>
    <Card sx={{ p: 0, flexShrink: 0 }}>
      <Tabs variant="fullWidth" value={value} onChange={(_, v) => onChange(v)}>
        {tabs.map((t, i) => (
          <Tab key={i} label={t.label} />
        ))}
      </Tabs>
    </Card>
    <Stack sx={{ maxHeight: '80dvh', overflow: 'auto' }}>{tabs[value] ? tabs[value].node : null}</Stack>
  </Stack>
);

export default DisclosureTabs;

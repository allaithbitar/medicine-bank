import { Tabs, Tab, Box } from "@mui/material";

const DisclosureTabs = ({
  value = 0,
  onChange,
  tabs = [],
}: {
  value?: number;
  onChange: (v: number) => void;
  tabs: { label: string; node: React.ReactNode }[];
}) => (
  <>
    <Tabs variant="fullWidth" value={value} onChange={(_, v) => onChange(v)}>
      {tabs.map((t, i) => (
        <Tab key={i} label={t.label} />
      ))}
    </Tabs>
    <Box sx={{ p: 2 }}>{tabs[value] ? tabs[value].node : null}</Box>
  </>
);

export default DisclosureTabs;

import { Card, Grid, Typography } from '@mui/material';
import type { TSummaryReportResult } from '../types/satistics.types';
import STRINGS from '@/core/constants/strings.constant';
// import { BarChart } from '@mui/x-charts/BarChart';
import usePermissions from '@/core/hooks/use-permissions.hook';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { CHART_COLORS } from '@/core/constants/properties.constant';
import CustomChartLegend from './custom-chart-legend.component';

const SummaryReportResult = ({ result }: { result: TSummaryReportResult }) => {
  const { isScoutRole } = usePermissions();

  const dataCards = [
    ...(!isScoutRole
      ? [
          {
            label: STRINGS.added_disclosures,
            value: result.addedDisclosuresCount,
            // bgcolor: indigo[50],
            // textColor: indigo[500],
          },
        ]
      : []),

    {
      label: STRINGS.completed_visits,
      value: result.completedVisitsCount,
      // bgcolor: cyan[50],
      // textColor: cyan[500],
    },
    {
      label: STRINGS.not_completed_visits,
      value: result.uncompletedVisitsCount,
      // textColor: indigo[500],
    },
    {
      label: STRINGS.couldnt_be_completed_visits,
      value: result.cantBeCompletedVisitsCount,
      // bgcolor: indigo[50],
      // textColor: indigo[500],
    },
    {
      label: STRINGS.late_disclosures,
      value: result.lateDisclosuresCount,
      // bgcolor: indigo[50],
      // textColor: indigo[500],
    },
  ];
  return (
    <>
      <Grid container spacing={1}>
        {dataCards.map((i, idx, arr) => {
          const isLast = idx === arr.length - 1;
          const isOdd = idx % 2 === 0;
          return (
            <Grid size={isLast && isOdd ? 12 : 6}>
              <Card key={i.label} sx={{ textAlign: 'center', p: 1, py: 2 }}>
                <Typography variant="h4">{i.value}</Typography>
                <Typography color="textSecondary" variant="body2">
                  {i.label}
                </Typography>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {result && (
        <Card
          sx={{
            p: 1,
            py: 2,
            '.recharts-wrapper': {
              '*': {
                outline: 'none',
              },
            },
          }}
        >
          <BarChart
            height={400}
            style={{
              direction: 'ltr',
              fontFamily: 'alexandria',
              fontSize: 11,
            }}
            responsive
            data={[
              {
                label: STRINGS.added_disclosures,
                [STRINGS.the_count]: result.addedDisclosuresCount,
                fill: CHART_COLORS[0],
              },
              {
                label: STRINGS.late_disclosures,
                [STRINGS.the_count]: result.lateDisclosuresCount,
                fill: CHART_COLORS[2],
              },

              {
                label: STRINGS.completed_visits,
                [STRINGS.the_count]: result.completedVisitsCount,
                fill: CHART_COLORS[1],
              },
              {
                label: STRINGS.not_completed_visits,
                [STRINGS.the_count]: result.uncompletedVisitsCount,
                fill: CHART_COLORS[4],
              },
              {
                label: STRINGS.couldnt_be_completed_visits,
                [STRINGS.the_count]: result.cantBeCompletedVisitsCount,
                fill: CHART_COLORS[3],
              },
            ]}
          >
            <XAxis dataKey="label" reversed style={{ fontSize: 11 }} tickFormatter={() => ''} tickLine={false} />
            <YAxis width="auto" />
            <Tooltip wrapperStyle={{ direction: 'rtl' }} />
            <Bar dataKey={STRINGS.the_count} radius={[10, 10, 0, 0]} />
          </BarChart>
          <CustomChartLegend
            items={[
              {
                label: STRINGS.added_disclosures,
                color: CHART_COLORS[0],
              },
              {
                label: STRINGS.late_disclosures,
                color: CHART_COLORS[2],
              },

              {
                label: STRINGS.completed_visits,
                color: CHART_COLORS[1],
              },
              {
                label: STRINGS.not_completed_visits,
                color: CHART_COLORS[4],
              },
              {
                label: STRINGS.couldnt_be_completed_visits,
                color: CHART_COLORS[3],
              },
            ]}
          />
        </Card>
      )}
    </>
  );
};

export default SummaryReportResult;

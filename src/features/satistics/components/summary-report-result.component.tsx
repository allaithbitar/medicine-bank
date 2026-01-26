import { Card, Grid, Typography } from '@mui/material';
import type { TSummaryReportResult } from '../types/satistics.types';
import STRINGS from '@/core/constants/strings.constant';
import { BarChart } from '@mui/x-charts/BarChart';

const SummaryReportResult = ({ result }: { result: TSummaryReportResult }) => {
  const dataCards = [
    {
      label: STRINGS.added_disclosures,
      value: result.addedDisclosuresCount,
      // bgcolor: indigo[50],
      // textColor: indigo[500],
    },
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
          return (
            <Grid size={isLast ? 12 : 6}>
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
        <Card sx={{ p: 0, pt: 2 }}>
          <BarChart
            grid={{ horizontal: true }}
            yAxis={[{ disableLine: true }]}
            xAxis={[
              {
                scaleType: 'band',
                data: [''],
                label: '',
              },
            ]}
            series={[
              {
                data: [result.addedDisclosuresCount],
                color: '#9BBFE0',
                label: STRINGS.added_disclosures,
              },
              {
                data: [result.completedVisitsCount],
                color: '#C6D68F',
                label: STRINGS.completed_visits,
              },
              {
                data: [result.uncompletedVisitsCount],
                label: STRINGS.not_completed_visits,
                color: '#FBE29F',
              },
              {
                data: [result.cantBeCompletedVisitsCount],
                label: STRINGS.couldnt_be_completed_visits,
                color: '#E8A09A',
              },
            ]}
            height={400}
          />
        </Card>
      )}
    </>
  );
};

export default SummaryReportResult;

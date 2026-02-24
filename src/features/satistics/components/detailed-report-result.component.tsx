import { Card, Stack } from '@mui/material';
import type { TDetailedReportResult } from '../types/satistics.types';
// import { LineChart } from "@mui/x-charts/LineChart";
import STRINGS from '@/core/constants/strings.constant';
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Line } from 'recharts';
import { useMemo } from 'react';
import { CHART_COLORS } from '@/core/constants/properties.constant';
import CustomChartLegend from './custom-chart-legend.component';

const DetailedReportResult = ({ result }: { result: TDetailedReportResult }) => {
  const normalizedChartData = useMemo(() => {
    const dates = new Set<string>([
      ...Object.keys(result.addedDisclosures),
      ...Object.keys(result.completedVisits),
      ...Object.keys(result.uncompletedVisits),
      ...Object.keys(result.cantBeCompletedVisits),
    ]);

    const resultObj: Record<string, Record<string, number>> = {};

    dates.forEach((date) => {
      resultObj[date] = {};
    });

    dates.forEach((date) => {
      resultObj[date][STRINGS.added_disclosures] = result.addedDisclosures[date]?.length;
      resultObj[date][STRINGS.completed_visits] = result.completedVisits[date]?.length;
      resultObj[date][STRINGS.not_completed_visits] = result.uncompletedVisits[date]?.length;
      resultObj[date][STRINGS.couldnt_be_completed_visits] = result.cantBeCompletedVisits[date]?.length;
    });

    return Object.entries(resultObj).map(([date, counts]) => ({ date, ...counts }));
  }, [result]);
  console.log(normalizedChartData);

  const normalizedChartRatingsData = useMemo(() => {
    const dates = new Set<string>();

    result.ratings.forEach((rating) => {
      Object.keys(rating.data).forEach((date) => {
        dates.add(date);
      });
    });

    const resultObj: Record<string, Record<string, number>> = {};

    dates.forEach((date) => {
      resultObj[date] = {};
    });

    dates.forEach((date) => {
      result.ratings.forEach((rating) => {
        resultObj[date][rating.name === 'custom' ? STRINGS.custom_rating : rating.name] = rating.data[date]?.length;
      });
    });

    return Object.entries(resultObj)
      .map(([date, counts]) => ({ date, ...counts }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [result]);

  return (
    <>
      <Card sx={{ p: 1, py: 2 }}>
        <Stack gap={2}>
          <LineChart
            margin={{ bottom: 50 }}
            height={400}
            style={{
              direction: 'ltr',
              fontFamily: 'alexandria',
              fontSize: 11,
            }}
            responsive
            data={normalizedChartData}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" reversed style={{ fontSize: 11 }} angle={-90} dy={40} dx={-5} />
            <YAxis width="auto" />
            <Tooltip
              wrapperStyle={{ direction: 'rtl' }}
              formatter={(value) => {
                return Intl.NumberFormat('ar-SY').format(value as number);
              }}
            />
            <Line
              type="monotone"
              dataKey={STRINGS.added_disclosures}
              strokeWidth={2}
              stroke={CHART_COLORS[0]}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey={STRINGS.completed_visits}
              strokeWidth={2}
              stroke={CHART_COLORS[1]}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey={STRINGS.not_completed_visits}
              strokeWidth={2}
              stroke={CHART_COLORS[4]}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey={STRINGS.couldnt_be_completed_visits}
              strokeWidth={2}
              stroke={CHART_COLORS[3]}
              isAnimationActive={false}
            />
            {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" isAnimationActive={isAnimationActive} /> */}
          </LineChart>{' '}
          <CustomChartLegend
            items={[
              { label: STRINGS.added_disclosures, color: CHART_COLORS[0] },
              { label: STRINGS.completed_visits, color: CHART_COLORS[1] },
              { label: STRINGS.not_completed_visits, color: CHART_COLORS[4] },
              { label: STRINGS.couldnt_be_completed_visits, color: CHART_COLORS[3] },
            ]}
          />
        </Stack>
      </Card>
      <Card sx={{ p: 1, py: 2 }}>
        <Stack gap={2}>
          <LineChart
            margin={{ bottom: 50 }}
            height={400}
            style={{
              direction: 'ltr',
              fontFamily: 'alexandria',
              fontSize: 11,
            }}
            responsive
            data={normalizedChartRatingsData}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" reversed style={{ fontSize: 11 }} angle={-90} dy={40} dx={-5} />
            <YAxis width="auto" />
            <Tooltip
              wrapperStyle={{ direction: 'rtl' }}
              formatter={(value) => {
                return Intl.NumberFormat('ar-SY').format(value as number);
              }}
            />
            {result.ratings.map((r, idx) => (
              <Line
                key={r.id}
                type="monotone"
                dataKey={r.name === 'custom' ? STRINGS.custom_rating : r.name}
                strokeWidth={2}
                stroke={CHART_COLORS[idx as keyof typeof CHART_COLORS]}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
          <CustomChartLegend
            items={result.ratings.map((r, idx) => ({
              label: r.name === 'custom' ? STRINGS.custom_rating : r.name,
              color: CHART_COLORS[idx as keyof typeof CHART_COLORS],
            }))}
          />
        </Stack>
      </Card>
    </>
  );
};

export default DetailedReportResult;

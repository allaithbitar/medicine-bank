import { Card } from "@mui/material";
import type { TDetailedReportResult } from "../types/satistics.types";
import { LineChart } from "@mui/x-charts/LineChart";
import STRINGS from "@/core/constants/strings.constant";

const DetailedReportResult = ({
  result,
}: {
  result: TDetailedReportResult;
}) => {
  // const dataCards = [
  //   {
  //     label: STRINGS.added_disclosures,
  //     value: result.addedDisclosuresCount,
  //     // bgcolor: indigo[50],
  //     // textColor: indigo[500],
  //   },
  //   {
  //     label: STRINGS.completed_visits,
  //     value: result.completedVisitsCount,
  //     // bgcolor: cyan[50],
  //     // textColor: cyan[500],
  //   },
  //   {
  //     label: STRINGS.not_completed_visits,
  //     value: result.uncompletedVisitsCount,
  //     // textColor: indigo[500],
  //   },
  //   {
  //     label: STRINGS.couldnt_be_completed_visits,
  //     value: result.cantBeCompletedVisitsCount,
  //     // bgcolor: indigo[50],
  //     // textColor: indigo[500],
  //   },
  // ];

  // const radarSeries = useMemo(() => {
  //   const maxLength = 0;
  //   const s: { data: number[]; name: string }[];
  //   result.ratings.forEach((r) => {
  //     maxLength = Math.max(maxLength, Object.values(r.data).flat().length);
  //   });
  //   result.ratings.forEach((r) => {
  //     const _arr = Array.from({ length: maxLength }).fill(0);
  //
  //     Object.
  //
  //     // s.push({ data:  });
  //   });
  // }, []);
  return (
    <>
      <Card sx={{ p: 0, pt: 2 }}>
        <LineChart
          localeText={{ noData: STRINGS.no_data_found }}
          xAxis={[
            {
              scaleType: "band",
              data: Object.keys(result.addedDisclosures),
            },

            {
              scaleType: "band",
              data: Object.keys(result.completedVisits),
            },
            {
              scaleType: "band",
              data: Object.keys(result.uncompletedVisits),
            },
            {
              scaleType: "band",
              data: Object.keys(result.cantBeCompletedVisits),
            },
          ]}
          series={[
            {
              data: Object.values(result.addedDisclosures).map((v) => v.length),
              label: STRINGS.added_disclosures,
              color: "#9BBFE0",
            },
            {
              data: Object.values(result.completedVisits).map((v) => v.length),
              label: STRINGS.completed_visits,
              color: "#C6D68F",
            },
            {
              data: Object.values(result.uncompletedVisits).map(
                (v) => v.length,
              ),
              label: STRINGS.not_completed_visits,
              color: "#FBE29F",
            },
            {
              data: Object.values(result.cantBeCompletedVisits).map(
                (v) => v.length,
              ),
              label: STRINGS.couldnt_be_completed_visits,
              color: "#E8A09A",
            },
          ]}
          height={500}
        />
      </Card>
      <Card sx={{ p: 0, pt: 2 }}>
        <LineChart
          localeText={{ noData: STRINGS.no_data_found }}
          xAxis={result.ratings.map((r) => ({
            scaleType: "band",
            data: Object.keys(r.data),
          }))}
          series={result.ratings.map((r) => ({
            label: r.name === "custom" ? STRINGS.custom : r.name,
            data: Object.values(r.data).map((v) => v.length),
          }))}
          height={500}
        />
      </Card>{" "}
    </>
  );
};

export default DetailedReportResult;

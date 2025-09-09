import { Button, Card, Stack } from "@mui/material";
import satisticsApi from "../api/satistics.api";
import STRINGS from "@/core/constants/strings.constant";
import { useEffect, useState } from "react";
import { notifyError } from "@/core/components/common/toast/toast";
import { getErrorMessage } from "@/core/helpers/helpers";
import useUser from "@/core/hooks/user-user.hook";
import FormAutocompleteInput from "@/core/components/common/inputs/form-autocomplete-input.component";
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import type { TListItem } from "@/core/types/input.type";
import FormDateInput from "@/core/components/common/inputs/form-date-input-component";
import type {
  TDetailedReportResult,
  TSummaryReportResult,
} from "../types/satistics.types";
import {
  FRIDAY,
  SATISTICS_TYPE,
  TIME_PERIOD_TYPE,
} from "@/core/constants/properties.constant";
import SummaryReportResult from "../components/summary-report-result.component";
import DetailedReportResult from "../components/detailed-report-result.component";
import EmployeesAutocomplete from "@/features/employees/components/employees-autocomplete.component";
import type { TEmployee } from "@/features/employees/types/employee.types";
import LoadingOverlay from "@/core/components/common/loading-overlay/loading-overlay";

const SatisticsPage = () => {
  const [timePeriod, setTimePeriod] = useState<TListItem & { label: string }>({
    id: TIME_PERIOD_TYPE.THIS_MONTH,
    label: STRINGS.this_month,
  });

  const [satisticsType, setSatisticsType] = useState<
    (TListItem & { label: string }) | null
  >({ id: SATISTICS_TYPE.SUMMARY, label: STRINGS.summary });

  const user = useUser();

  const [customPeriod, setCustomPeriod] = useState({
    fromDate: "",
    toDate: "",
  });

  const [employee, setEmployee] = useState<TEmployee | null>(null);

  const [result, setResult] = useState<TSummaryReportResult | null>(null);

  const [detailedResult, setDetailedResult] =
    useState<TDetailedReportResult | null>(null);
  console.log({ detailedResult });

  const [getSatistics, { isFetching: isLoadingSummaryReport }] =
    satisticsApi.useLazyGetSummarySatisticsQuery();

  const [getDetailedSatistics, { isFetching: isLoadingDetailedReport }] =
    satisticsApi.useLazyGetDetailedSatisticsQuery();

  const handleGetSatistics = async () => {
    let fromDate = "";
    let toDate = "";

    switch (timePeriod.id) {
      case TIME_PERIOD_TYPE.THIS_WEEK: {
        fromDate = startOfWeek(new Date(), {
          weekStartsOn: FRIDAY,
        }).toISOString();

        toDate = endOfWeek(new Date(), {
          weekStartsOn: FRIDAY,
        }).toISOString();
        break;
      }

      case TIME_PERIOD_TYPE.THIS_MONTH: {
        fromDate = startOfMonth(new Date()).toISOString();
        toDate = endOfMonth(new Date()).toISOString();
        break;
      }

      case TIME_PERIOD_TYPE.THIS_YEAR: {
        fromDate = startOfYear(new Date()).toISOString();
        toDate = endOfYear(new Date()).toISOString();
        break;
      }

      case TIME_PERIOD_TYPE.CUSTOM: {
        fromDate = startOfDay(new Date(customPeriod.fromDate)).toISOString();
        toDate = endOfDay(new Date(customPeriod.toDate)).toISOString();
        break;
      }
    }

    try {
      if (satisticsType?.id === SATISTICS_TYPE.SUMMARY) {
        const _result = await getSatistics({
          fromDate,
          toDate,
          employeeId:
            user.role === "scout" ? user.id : (employee?.id ?? undefined),
        }).unwrap();
        setDetailedResult(null);
        setResult(_result);
      } else {
        const __result = await getDetailedSatistics({
          fromDate,
          toDate,
          employeeId:
            user.role === "scout" ? user.id : (employee?.id ?? undefined),
        }).unwrap();
        setResult(null);
        setDetailedResult(__result);
      }
    } catch (error: any) {
      notifyError(getErrorMessage(error));
    }
  };

  const disableGetButton =
    (timePeriod.id === TIME_PERIOD_TYPE.CUSTOM &&
      !Object.values(customPeriod).every(Boolean)) ||
    isLoadingDetailedReport ||
    isLoadingSummaryReport;

  useEffect(() => {
    handleGetSatistics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack gap={1}>
      <Card>
        <Stack gap={2}>
          <Stack direction="row" gap={1}>
            <FormAutocompleteInput
              label={STRINGS.satistics_type}
              options={[
                { id: SATISTICS_TYPE.SUMMARY, label: STRINGS.summary },
                { id: SATISTICS_TYPE.DETAILED, label: STRINGS.detailed },
              ]}
              value={satisticsType}
              onChange={(v) => setSatisticsType(v)}
            />
            <FormAutocompleteInput
              label={STRINGS.time_period}
              disableClearable
              options={[
                { id: TIME_PERIOD_TYPE.THIS_WEEK, label: STRINGS.this_week },
                { id: TIME_PERIOD_TYPE.THIS_MONTH, label: STRINGS.this_month },
                { id: TIME_PERIOD_TYPE.THIS_YEAR, label: STRINGS.this_year },
                { id: TIME_PERIOD_TYPE.CUSTOM, label: STRINGS.custom },
              ]}
              value={timePeriod}
              onChange={(v) => setTimePeriod(v!)}
            />
          </Stack>
          {timePeriod.id === TIME_PERIOD_TYPE.CUSTOM && (
            <>
              <FormDateInput
                label={STRINGS.from_date}
                value={customPeriod.fromDate}
                onChange={(fromDate) =>
                  setCustomPeriod((prev) => ({ ...prev, fromDate }))
                }
              />
              <FormDateInput
                label={STRINGS.to_date}
                value={customPeriod.toDate}
                onChange={(toDate) =>
                  setCustomPeriod((prev) => ({ ...prev, toDate }))
                }
              />
            </>
          )}
          {user.role === "manager" && (
            <EmployeesAutocomplete value={employee} onChange={setEmployee} />
          )}

          <Button disabled={disableGetButton} onClick={handleGetSatistics}>
            {STRINGS.view}
          </Button>
        </Stack>
      </Card>
      {result && <SummaryReportResult result={result} />}
      {detailedResult && <DetailedReportResult result={detailedResult} />}
      {(isLoadingDetailedReport || isLoadingSummaryReport) && (
        <LoadingOverlay />
      )}
    </Stack>
  );
};

export default SatisticsPage;

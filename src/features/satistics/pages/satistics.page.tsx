import { Button, Card, Stack } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from 'date-fns';
import type { TListItem } from '@/core/types/input.type';
import type { TAutocompleteItem } from '@/core/types/common.types';
import type {
  TDetailedReportResult,
  THalfDetailedStatisticsResult,
  THalfDetailedByAreaResult,
  TSummaryReportResult,
} from '../types/satistics.types';
import { FRIDAY, SATISTICS_TYPE, TIME_PERIOD_TYPE } from '@/core/constants/properties.constant';
import STRINGS from '@/core/constants/strings.constant';
import { notifyError } from '@/core/components/common/toast/toast';
import { getErrorMessage } from '@/core/helpers/helpers';
import useUser from '@/core/hooks/user-user.hook';
import usePermissions from '@/core/hooks/use-permissions.hook';
import satisticsApi from '../api/satistics.api';
import FormAutocompleteInput from '@/core/components/common/inputs/form-autocomplete-input.component';
import FormDateInput from '@/core/components/common/inputs/form-date-input-component';
import CustomAppBarComponent from '@/core/components/common/custom-app-bar/custom-app-bar.component';
import EmployeesAutocomplete from '@/features/employees/components/employees-autocomplete.component';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import SummaryReportResult from '../components/summary-report-result.component';
import DetailedReportResult from '../components/detailed-report-result.component';
import { HalfDetailed } from '../components/half-detailed.component';
import { HalfDetailedByArea } from '../components/half-detailed-by-area.component';

const getDateRange = (
  timePeriodId: string,
  customPeriod: { fromDate: string; toDate: string }
): { fromDate: string; toDate: string } => {
  const now = new Date();
  switch (timePeriodId) {
    case TIME_PERIOD_TYPE.THIS_WEEK:
      return {
        fromDate: startOfWeek(now, { weekStartsOn: FRIDAY }).toISOString(),
        toDate: endOfWeek(now, { weekStartsOn: FRIDAY }).toISOString(),
      };
    case TIME_PERIOD_TYPE.THIS_MONTH:
      return {
        fromDate: startOfMonth(now).toISOString(),
        toDate: endOfMonth(now).toISOString(),
      };
    case TIME_PERIOD_TYPE.THIS_YEAR:
      return {
        fromDate: startOfYear(now).toISOString(),
        toDate: endOfYear(now).toISOString(),
      };
    case TIME_PERIOD_TYPE.CUSTOM:
      return {
        fromDate: startOfDay(new Date(customPeriod.fromDate)).toISOString(),
        toDate: endOfDay(new Date(customPeriod.toDate)).toISOString(),
      };
    default:
      return { fromDate: '', toDate: '' };
  }
};

const SatisticsPage = () => {
  const { isScoutRole, isManagerRole } = usePermissions();
  const user = useUser();
  const [timePeriod, setTimePeriod] = useState<TListItem & { label: string }>({
    id: TIME_PERIOD_TYPE.THIS_MONTH,
    label: STRINGS.this_month,
  });
  const [satisticsType, setSatisticsType] = useState<(TListItem & { label: string }) | null>({
    id: SATISTICS_TYPE.SUMMARY,
    label: STRINGS.summary,
  });
  const [customPeriod, setCustomPeriod] = useState({ fromDate: '', toDate: '' });
  const [employee, setEmployee] = useState<TAutocompleteItem | null>(null);
  const [summaryResult, setSummaryResult] = useState<TSummaryReportResult | null>(null);
  const [detailedResult, setDetailedResult] = useState<TDetailedReportResult | null>(null);
  const [halfDetailedResult, setHalfDetailedResult] = useState<THalfDetailedStatisticsResult | null>(null);
  const [halfDetailedByAreaResult, setHalfDetailedByAreaResult] = useState<THalfDetailedByAreaResult | null>(null);
  const [getSummary, { isFetching: isLoadingSummary }] = satisticsApi.useLazyGetSummarySatisticsQuery();
  const [getDetailed, { isFetching: isLoadingDetailed }] = satisticsApi.useLazyGetDetailedSatisticsQuery();
  const [getHalfDetailed, { isFetching: isLoadingHalfDetailed }] = satisticsApi.useLazyGetHalfDetailedSatisticsQuery();
  const [getHalfDetailedByArea, { isFetching: isLoadingHalfDetailedByArea }] =
    satisticsApi.useLazyGetHalfDetailedByAreaQuery();

  const statisticsTypeOptions = useMemo(
    () => [
      { id: SATISTICS_TYPE.SUMMARY, label: STRINGS.summary },
      { id: SATISTICS_TYPE.DETAILED, label: STRINGS.detailed },
      ...(!isScoutRole
        ? [
            { id: SATISTICS_TYPE.HALF_DETAILED, label: STRINGS.half_detailed },
            { id: SATISTICS_TYPE.HALF_DETAILED_BY_AREA, label: STRINGS.half_detailed_by_area },
          ]
        : []),
    ],
    [isScoutRole]
  );
  const timePeriodOptions = useMemo(
    () => [
      { id: TIME_PERIOD_TYPE.THIS_WEEK, label: STRINGS.this_week },
      { id: TIME_PERIOD_TYPE.THIS_MONTH, label: STRINGS.this_month },
      { id: TIME_PERIOD_TYPE.THIS_YEAR, label: STRINGS.this_year },
      { id: TIME_PERIOD_TYPE.CUSTOM, label: STRINGS.custom },
    ],
    []
  );
  const isLoading = isLoadingSummary || isLoadingDetailed || isLoadingHalfDetailed || isLoadingHalfDetailedByArea;
  const isViewButtonDisabled =
    isLoading || (timePeriod.id === TIME_PERIOD_TYPE.CUSTOM && !Object.values(customPeriod).every(Boolean));

  const clearAllResults = () => {
    setSummaryResult(null);
    setDetailedResult(null);
    setHalfDetailedResult(null);
    setHalfDetailedByAreaResult(null);
  };
  const handleGetStatistics = async () => {
    if (!satisticsType?.id) return;
    const { fromDate, toDate } = getDateRange(timePeriod.id, customPeriod);
    const requestPayload = {
      fromDate,
      toDate,
      employeeId: isScoutRole ? user.id : (employee?.id ?? undefined),
    };
    try {
      clearAllResults();
      switch (satisticsType.id) {
        case SATISTICS_TYPE.SUMMARY: {
          const result = await getSummary(requestPayload).unwrap();
          setSummaryResult(result);
          break;
        }
        case SATISTICS_TYPE.DETAILED: {
          const result = await getDetailed(requestPayload).unwrap();
          setDetailedResult(result);
          break;
        }
        case SATISTICS_TYPE.HALF_DETAILED: {
          const result = await getHalfDetailed(requestPayload).unwrap();
          setHalfDetailedResult(result);
          break;
        }
        case SATISTICS_TYPE.HALF_DETAILED_BY_AREA: {
          const result = await getHalfDetailedByArea(requestPayload).unwrap();
          setHalfDetailedByAreaResult(result);
          break;
        }
        default:
          break;
      }
    } catch (error: any) {
      notifyError(getErrorMessage(error));
    }
  };

  useEffect(() => {
    handleGetStatistics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack gap={1}>
      <Stack gap={1}>
        <CustomAppBarComponent title={STRINGS.statistics} />
        <Card>
          <Stack gap={1}>
            <Stack direction="row" gap={1}>
              <FormAutocompleteInput
                label={STRINGS.satistics_type}
                options={statisticsTypeOptions}
                value={satisticsType}
                onChange={(v) => setSatisticsType(v)}
              />
              <FormAutocompleteInput
                label={STRINGS.time_period}
                disableClearable
                options={timePeriodOptions}
                value={timePeriod}
                onChange={(v) => setTimePeriod(v!)}
              />
            </Stack>
            {timePeriod.id === TIME_PERIOD_TYPE.CUSTOM && (
              <>
                <FormDateInput
                  label={STRINGS.from_date}
                  value={customPeriod.fromDate}
                  onChange={(fromDate) => setCustomPeriod((prev) => ({ ...prev, fromDate }))}
                />
                <FormDateInput
                  label={STRINGS.to_date}
                  value={customPeriod.toDate}
                  onChange={(toDate) => setCustomPeriod((prev) => ({ ...prev, toDate }))}
                />
              </>
            )}
            {isManagerRole && <EmployeesAutocomplete value={employee} onChange={setEmployee} />}
            <Button disabled={isViewButtonDisabled} onClick={handleGetStatistics}>
              {STRINGS.view}
            </Button>
          </Stack>
        </Card>
      </Stack>
      {summaryResult && <SummaryReportResult result={summaryResult} />}
      {detailedResult && <DetailedReportResult result={detailedResult} />}
      {halfDetailedResult && <HalfDetailed data={halfDetailedResult} />}
      {halfDetailedByAreaResult && <HalfDetailedByArea data={halfDetailedByAreaResult} />}
      {isLoading && <LoadingOverlay />}
    </Stack>
  );
};

export default SatisticsPage;

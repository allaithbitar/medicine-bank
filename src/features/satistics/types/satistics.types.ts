import type { TRating } from '@/features/ratings/types/rating.types';

export type TGetSatisticsDto = {
  fromDate: string;
  toDate: string;
  employeeId?: string;
};

export type TSummaryReportResult = {
  addedDisclosuresCount: number;
  completedVisitsCount: number;
  uncompletedVisitsCount: number;
  cantBeCompletedVisitsCount: number;
  lateDisclosuresCount: number;
};

export type TDetailedReportResult = {
  addedDisclosures: Record<string, string[]>;
  completedVisits: Record<string, string[]>;
  uncompletedVisits: Record<string, string[]>;
  cantBeCompletedVisits: Record<string, string[]>;
  ratings: (TRating & { data: Record<string, string[]> })[];
};

export type TPriorityDetail = {
  key: string;
  count: number;
};

export type TDisclosureTypeDetails = {
  count: number;
  details: TPriorityDetail[];
};

export type TMetricDetails = {
  count: number;
  details: {
    new?: TDisclosureTypeDetails;
    return?: TDisclosureTypeDetails;
    help?: TDisclosureTypeDetails;
  };
};

export type THalfDetailedStatisticsResult = {
  addedDisclosures: TMetricDetails;
  uncompletedVisits: TMetricDetails;
  completedVisits: TMetricDetails;
  cantBeCompletedVisits: TMetricDetails;
  lateDisclosures: TMetricDetails;
};

export type TAreaStatistics = {
  areaId: string;
  areaName: string;
  count: number;
  details: THalfDetailedStatisticsResult;
};

export type THalfDetailedByAreaResult = TAreaStatistics[];

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

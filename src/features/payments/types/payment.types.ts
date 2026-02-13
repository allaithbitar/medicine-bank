import type { TPaginationDto } from '@/core/types/common.types';

export type TPaymentScout = {
  id: string;
  name: string;
};
export type TPaymentPatient = TPaymentScout;

export type TPaymentRating = {
  id: string | null;
  name: string | null;
  isCustomRating: boolean;
  customRating: string | null;
  completedAt: string;
};

export type TPaymentEligibleItem = {
  disclosureId: string;
  scout: TPaymentScout;
  patient: TPaymentPatient;
  rating: TPaymentRating;
  paidAt: null;
};

export type TPaymentHistoryItem = {
  disclosureId: string;
  scout: TPaymentScout;
  patient: TPaymentPatient;
  rating: TPaymentRating;
  paidAt: string;
};

export type TGetEligiblePaymentsDto = TPaginationDto & {
  scoutIds?: string[];
  dateFrom?: string;
  dateTo?: string;
};

export type TGetPaymentHistoryDto = TPaginationDto & {
  scoutIds?: string[];
  dateFrom?: string;
  dateTo?: string;
};

export type TMarkAsPaidDto = {
  scoutId: string;
  dateFrom?: string;
  dateTo?: string;
};

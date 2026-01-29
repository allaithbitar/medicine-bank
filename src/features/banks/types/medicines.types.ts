import type { TPaginationDto } from '@/core/types/common.types';

export const ALLOWED_FORMS = ['pill', 'syrup', 'injection', 'capsule', 'ointment'] as const;
export type TFormValue = (typeof ALLOWED_FORMS)[number];

export const DOSE_OPTIONS = [100, 500, 1000, 1500, 20000] as const;

export type TMedicine = {
  id: string;
  name: string;
  form: TFormValue;
  doseVariants: number[];
};

export type TGetMedicinesDto = {
  name?: string | null;
  form?: TFormValue;
} & TPaginationDto;

export type TAddMedicinePayload = Omit<TMedicine, 'id'>;

export type TUpdateMedicinePayload = TMedicine;

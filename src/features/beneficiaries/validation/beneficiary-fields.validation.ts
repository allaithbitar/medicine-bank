import { z } from 'zod';
import STRINGS from '@/core/constants/strings.constant';

export const beneficiaryFieldSchemas = {
  name: z.string().min(1, STRINGS.schema_required).max(500, STRINGS.schema_max_500_chars),

  nationalNumber: z
    .string()
    .min(1, STRINGS.schema_required)
    .max(100, STRINGS.schema_max_500_chars)
    .nullable()
    .optional(),

  address: z.string().max(1000, STRINGS.schema_max_1000_chars).nullable().optional(),

  about: z.string().max(1000, STRINGS.schema_max_1000_chars).nullable().optional(),

  birthDate: z.string().nullable().optional(),

  job: z.string().max(500, STRINGS.schema_max_500_chars).nullable().optional(),

  gender: z.enum(['male', 'female']).nullable().optional(),

  areaId: z.string().uuid().nullable().optional(),
};

export type TBeneficiaryFieldSchemas = typeof beneficiaryFieldSchemas;

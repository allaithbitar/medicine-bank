import { z } from 'zod';
import STRINGS from '@/core/constants/strings.constant';

// Validation schemas for individual disclosure fields
export const disclosureFieldSchemas = {
  initialNote: z.string().max(1000, STRINGS.schema_max_1000_chars).nullable().optional(),

  visitNote: z.string().max(1000, STRINGS.schema_max_1000_chars).nullable().optional(),

  visitReason: z.string().max(1000, STRINGS.schema_max_1000_chars).nullable().optional(),

  visitResult: z.enum(['not_completed', 'cant_be_completed', 'completed']).nullable().optional(),

  ratingNote: z.string().max(1000, STRINGS.schema_max_1000_chars).nullable().optional(),

  customRating: z.string().max(500, STRINGS.schema_max_500_chars).nullable().optional(),

  ratingId: z.string().uuid().nullable().optional(),

  scoutId: z.string().uuid().nullable().optional(),

  priorityId: z.string().uuid(STRINGS.schema_required),

  type: z.enum(['new', 'help', 'return']),

  status: z.enum(['active', 'suspended', 'archived']),
};

export type TDisclosureFieldSchemas = typeof disclosureFieldSchemas;

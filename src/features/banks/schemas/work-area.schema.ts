import STRINGS from '@/core/constants/strings.constant';
import { z } from 'zod';

export const WorkAreaSchema = z.object({
  name: z.string().min(1, STRINGS.schema_required),
  cityId: z.string().uuid(STRINGS.schema_invalid_id_format).min(1, STRINGS.schema_required),
});

export const UpdateWorkAreaSchema = WorkAreaSchema.extend({
  id: z.string().uuid(STRINGS.schema_invalid_id_format),
});

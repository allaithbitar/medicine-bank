import STRINGS from '@/core/constants/strings.constant';
import { z } from 'zod';

export const RatingSchema = z.object({
  name: z.string().min(1, STRINGS.schema_required),
  code: z.string().min(1, STRINGS.schema_required),
  description: z.string().min(1, STRINGS.schema_required),
});

export const UpdateRatingSchema = RatingSchema.extend({
  id: z.string().uuid(STRINGS.schema_invalid_id_format),
});

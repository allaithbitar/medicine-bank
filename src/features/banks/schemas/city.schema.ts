import STRINGS from '@/core/constants/strings.constant';
import { z } from 'zod';

export const CitySchema = z.object({
  name: z.string().min(3, STRINGS.schema_city_name_min).trim(),
});

// export type TCity = z.infer<typeof CitySchema>;

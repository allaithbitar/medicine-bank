import { localDb } from '@/libs/sqlocal';
import { useQuery } from '@tanstack/react-query';
import type { TGetPriorityDegreesDto } from '../types/priority-degree.types';

export const useLocalPriorityDegreesLoader = (dto: TGetPriorityDegreesDto) => {
  const isOffline = true;
  const queryResult = useQuery({
    queryKey: ['LOCAL_PRIORITY_DEGREES', dto],
    queryFn: async () => {
      let query = localDb.selectFrom('priority_degrees').selectAll().orderBy('name', 'asc');

      if (dto.name) {
        query = query.where('name', 'like', `%${dto.name}%`);
      }

      const res = await query.execute();
      return res;
    },
    enabled: isOffline,
  });
  return queryResult;
};


import { localDb } from '@/libs/sqlocal';
import { useQuery } from '@tanstack/react-query';
import type { TGetRatingsDto } from '../types/rating.types';
import useIsOffline from '@/core/hooks/use-is-offline.hook';

export const useLocalRatingsLoader = (dto?: TGetRatingsDto) => {
  const isOffline = useIsOffline();
  const queryResult = useQuery({
    queryKey: ['LOCAL_RATINGS', dto],
    queryFn: async () => {
      let query = localDb.selectFrom('ratings').selectAll().orderBy('name', 'asc');

      if (dto?.code) {
        query = query.where('code', 'like', `%${dto.code}%`);
      }

      if (dto?.description) {
        query = query.where('description', 'like', `%${dto.description}%`);
      }

      if (dto?.name) {
        query = query.where('name', 'like', `%${dto.name}%`);
      }

      return await query.execute();
    },
    enabled: isOffline,
  });
  return queryResult;
};

import type { TLocalDb } from '@/libs/kysely/schema';
import { localDb } from '@/libs/sqlocal';
import { useQuery } from '@tanstack/react-query';

const useLocalUpdateLoader = (dto: Partial<TLocalDb['updates']>) => {
  return useQuery({
    queryKey: ['LOCAL_UPDATE', dto],
    queryFn: () => {
      let baseQuery = localDb.selectFrom('updates').selectAll();
      Object.entries(dto).forEach(([key, value]) => {
        baseQuery = baseQuery.where(key as keyof TLocalDb['updates'], '=', value);
      });
      return baseQuery.executeTakeFirstOrThrow();
    },
  });
};

export default useLocalUpdateLoader;

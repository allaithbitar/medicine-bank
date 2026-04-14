import type { TOfflineUpdate } from '@/core/types/common.types';
import type { TLocalDb } from '@/libs/kysely/schema';
import { localDb } from '@/libs/sqlocal';
import { useQuery } from '@tanstack/react-query';

export async function getLocalUpdate(dto: Partial<TLocalDb['updates']>): Promise<TOfflineUpdate | null> {
  let baseQuery = localDb.selectFrom('updates').selectAll();
  Object.entries(dto).forEach(([key, value]) => {
    baseQuery = baseQuery.where(key as keyof TLocalDb['updates'], '=', value);
  });
  const result = await baseQuery.executeTakeFirst();
  return (result as TOfflineUpdate) || null;
}

const useLocalUpdateLoader = (dto: Partial<TLocalDb['updates']>) => {
  return useQuery({
    queryKey: ['LOCAL_UPDATE', dto],
    queryFn: () => getLocalUpdate(dto),
  });
};

export default useLocalUpdateLoader;

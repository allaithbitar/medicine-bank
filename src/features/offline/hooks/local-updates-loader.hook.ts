import { localDb } from '@/libs/sqlocal';
import { useQuery } from '@tanstack/react-query';

export const useLocalUpdatesLoader = () => {
  const queryResult = useQuery({
    queryKey: ['LOCAL_UPDATES'],
    queryFn: async () => {
      return await localDb.selectFrom('updates').selectAll().orderBy('createdAt', 'asc').execute();
    },
  });
  return queryResult;
};

export const useLocalUpdatesCountLoader = () => {
  const queryResult = useQuery({
    queryKey: ['LOCAL_UPDATES_COUNT'],
    queryFn: async () => {
      const [{ count }] = await localDb
        .selectFrom('updates')
        .select((eb) => eb.fn.count('id').as('count'))
        .execute();
      return count;
    },
  });
  return queryResult;
};

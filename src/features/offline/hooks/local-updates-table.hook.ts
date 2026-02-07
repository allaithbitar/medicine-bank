import type { TLocalDb } from '@/libs/kysely/schema';
import { localDb } from '@/libs/sqlocal';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

type TInsertLocalUpdateDto = Omit<TLocalDb['updates'], 'id' | 'createdAt'> &
  Partial<Pick<TLocalDb['updates'], 'createdAt'>>;

type TUpdateLocalUpdateFn = (
  key: keyof TLocalDb['updates'],
  value: string,
  dto: Partial<TLocalDb['updates']>
) => Promise<TLocalDb['updates']>;

const useLocalUpdatesTable = () => {
  const queryClient = useQueryClient();

  const invalidateQueries = useCallback(
    (id?: string) => {
      if (id) {
        queryClient.invalidateQueries({
          queryKey: ['LOCAL_UPDATE', { id }],
        });
        queryClient.invalidateQueries({
          queryKey: ['LOCAL_UPDATE', { recordId: id }],
        });
        queryClient.invalidateQueries({
          queryKey: ['LOCAL_UPDATE', { parentId: id }],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ['LOCAL_UPDATES'],
      });
      queryClient.invalidateQueries({
        queryKey: ['LOCAL_UPDATES_COUNT'],
      });
    },
    [queryClient]
  );

  const getBy = useCallback(async (key: keyof TLocalDb['updates'], value: string) => {
    return await localDb.selectFrom('updates').selectAll().where(key, '=', value).executeTakeFirst();
  }, []);

  const getById = useCallback((id: string) => getBy('id', id), [getBy]);

  const getByRecordId = useCallback((recordId: string) => getBy('recordId', recordId), [getBy]);

  const create = useCallback(
    async (dto: TInsertLocalUpdateDto) => {
      const result = await localDb
        .insertInto('updates')
        .values({
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          ...dto,
          // operation: 'UPDATE',
          // table: 'patients',
          // status: 'pending',
          // recordId: beneficiaryId,
          // payload: JSON.stringify(restValues),
          // createdAt,
        })
        .returningAll()
        .executeTakeFirstOrThrow();
      invalidateQueries();
      return result;
    },
    [invalidateQueries]
  );

  const update: TUpdateLocalUpdateFn = useCallback(async (key, value, dto) => {
    const result = await localDb
      .updateTable('updates')
      .set(dto)
      .where(key, '=', value)
      .returningAll()
      .executeTakeFirstOrThrow();
    return result;
  }, []);

  const updateById = useCallback(
    async (id: string, dto: Partial<Omit<TLocalDb['updates'], 'id'>>) => {
      const result = await update('id', id, dto);
      invalidateQueries(id);
      return result;
    },
    [invalidateQueries, update]
  );

  const deleteBy = useCallback(async (key: keyof TLocalDb['updates'], value: string) => {
    return await localDb.deleteFrom('updates').where(key, '=', value).execute();
  }, []);

  const deleteById = useCallback(async (id: string) => deleteBy('id', id), [deleteBy]);

  const deleteByRecordId = useCallback(async (recordId: string) => deleteBy('recordId', recordId), [deleteBy]);

  const updatePayload = useCallback(
    async (id: string, payload: any, replace = false) => {
      let newPayload;

      if (!replace) {
        const { payload: oldPayload } = await localDb
          .selectFrom('updates')
          .select('payload')
          .where('id', '=', id)
          .executeTakeFirstOrThrow();
        newPayload = { ...(oldPayload as any), ...payload };
      } else {
        newPayload = payload;
      }
      await localDb.updateTable('updates').set({ payload: newPayload }).where('id', '=', id).execute();
      invalidateQueries(id);
    },
    [invalidateQueries]
  );

  const deleteAll = useCallback(async () => {
    await localDb.deleteFrom('updates').execute();
    invalidateQueries();
  }, [invalidateQueries]);

  return {
    getById,
    getByRecordId,
    updateById,
    create,
    deleteById,
    deleteByRecordId,
    updatePayload,
    deleteAll,
    invalidateQueries,
  };
};

export default useLocalUpdatesTable;

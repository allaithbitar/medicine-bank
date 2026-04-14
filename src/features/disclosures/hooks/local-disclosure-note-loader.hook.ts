import { localDb } from '@/libs/sqlocal';
import { useQuery } from '@tanstack/react-query';
import useIsOffline from '@/core/hooks/use-is-offline.hook';
import type { TDisclosureNote } from '../types/disclosure.types';

export const getLocalDisclosureNote = async (id: string): Promise<TDisclosureNote | null> => {
  const result = (await localDb
    .selectFrom('disclosure_notes')
    .selectAll()
    .where('id', '=', id!)
    .executeTakeFirst()) as unknown as TDisclosureNote;
  return result || null;
};

export const useLocalDisclosureNoteLoader = (id?: string, forceOffline = false) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isOffline = forceOffline || useIsOffline();
  const queryResult = useQuery({
    queryKey: ['LOCAL_DISCLOSURE_NOTE', id, forceOffline],
    queryFn: async () => getLocalDisclosureNote(id || ''),
    enabled: isOffline && !!id,
  });
  return queryResult;
};

import { localDb } from "@/libs/sqlocal";
import { useQuery } from "@tanstack/react-query";
import type { TDisclosure } from "../types/disclosure.types";
import STRINGS from "@/core/constants/strings.constant";
export const useLocalDisclosureLoader = ({ id }: { id?: string }) => {
  const isOffline = true;
  const queryResult = useQuery({
    queryKey: ["LOCAL_DISCLOSURE", id],
    queryFn: async () => {
      if (!id) return;

      const res = (await localDb
        .selectFrom("disclosures")
        .selectAll()
        .where("id", "=", id)
        .executeTakeFirstOrThrow(
          () => new Error(STRINGS.local_not_found_error),
        )) as TDisclosure;

      return res;
    },
    enabled: isOffline,
  });
  return queryResult;
};

import { rootApi } from "@/core/api/root.api";
import type {
  ApiResponse,
  TPaginatedResponse,
} from "@/core/types/common.types";
import type {
  TAddSystemBroadcastPayload,
  TSearchSystemBroadcastsPayload,
  TSystemBroadcast,
  TUpdateSystemBroadcastPayload,
} from "../types/system-broadcasts.types";

export const systemBroadcastsApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    searchSystemBroadcasts: builder.query<
      TPaginatedResponse<TSystemBroadcast>,
      TSearchSystemBroadcastsPayload
    >({
      query: (body) => ({
        url: "/system-broadcasts/search",
        method: "POST",
        body,
      }),
      providesTags: [{ type: "system_Broadcasts", id: "LIST" }],
      transformResponse: (
        res: ApiResponse<TPaginatedResponse<TSystemBroadcast>>
      ) => res.data,
    }),

    addSystemBroadcast: builder.mutation<
      TSystemBroadcast,
      TAddSystemBroadcastPayload
    >({
      query: (body) => ({
        url: "/system-broadcasts",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "system_Broadcasts", id: "LIST" }],
    }),

    updateSystemBroadcast: builder.mutation<
      void,
      TUpdateSystemBroadcastPayload
    >({
      query: (body) => ({
        url: "/system-broadcasts",
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, __, arg) => [
        { type: "system_Broadcasts", id: "LIST" },
        { type: "system_Broadcasts", id: arg.id },
      ],
    }),
  }),
  overrideExisting: false,
});

export default systemBroadcastsApi;

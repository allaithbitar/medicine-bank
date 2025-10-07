import { rootApi } from "@/core/api/root.api";
import type {
  ApiResponse,
  TPaginatedResponse,
} from "@/core/types/common.types";
import type { TAddMeetingPayload, TMeeting } from "../types/meetings.types";

export type TUpdateMeetingPayload = TAddMeetingPayload & { id: string };

export const meetingsApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getMeetings: builder.query<TPaginatedResponse<TMeeting>, undefined>({
      query: (params) => ({
        url: "/meetings",
        method: "GET",
        params,
      }),
      transformResponse: (res: ApiResponse<TPaginatedResponse<TMeeting>>) =>
        res.data,
      providesTags: (result) =>
        result
          ? [
              { type: "meetings", id: "LIST" },
              ...result.items.map((m) => ({
                type: "meetings" as const,
                id: m.id,
              })),
            ]
          : [{ type: "meetings", id: "LIST" }],
    }),

    addMeeting: builder.mutation<TMeeting, TAddMeetingPayload>({
      query: (body) => ({ url: "/meetings", method: "POST", body }),
      invalidatesTags: [{ type: "meetings", id: "LIST" }],
    }),

    updateMeeting: builder.mutation<void, TUpdateMeetingPayload>({
      query: (body) => ({ url: "/meetings", method: "PUT", body }),
      invalidatesTags: (_, __, arg) => [
        { type: "meetings", id: "LIST" },
        { type: "meetings", id: arg.id },
      ],
    }),
  }),
  overrideExisting: false,
});

export default meetingsApi;

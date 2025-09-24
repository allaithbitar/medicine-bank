import { rootApi } from "@/core/api/root.api";
import type {
  TAppointment,
  TGetCalendarAppointmentsDto,
  TGetCalendarAppointmentsResponse,
} from "../types/appointment.type";
import type { ApiResponse } from "@/core/types/common.types";

export const appointmentsApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getCalendarAppointments: builder.query<
      TGetCalendarAppointmentsResponse,
      TGetCalendarAppointmentsDto
    >({
      query: (data) => ({
        url: "appointments",
        params: data,
      }),
      providesTags: ["Calendar_Appointments"],
      transformResponse: (res: ApiResponse<TGetCalendarAppointmentsResponse>) =>
        res.data,
    }),
    getDateAppointments: builder.query<TAppointment[], string>({
      query: (date) => ({
        url: `appointments/date/${date}`,
      }),
      providesTags: ["Date_Appointments"],
      transformResponse: (res: ApiResponse<TAppointment[]>) => res.data,
    }),
  }),
});

export default appointmentsApi;

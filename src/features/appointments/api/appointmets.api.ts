import { rootApi } from "@/core/api/root.api";
import type {
  TAddDisclosureAppointmentDto,
  TAppointment,
  TGetCalendarAppointmentsDto,
  TGetCalendarAppointmentsResponse,
  TGetDisclosureAppointmentsResponse,
  TUpdateDisclosureAppointmentDto,
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
    getDisclosureAppointments: builder.query<
      TGetDisclosureAppointmentsResponse[],
      { disclosureId: string }
    >({
      query: ({ disclosureId }) => ({
        url: `appointments/disclosure/${disclosureId}`,
      }),
      providesTags: ["Disclosure_Appointment"],
      transformResponse: (
        res: ApiResponse<TGetDisclosureAppointmentsResponse[]>
      ) => res.data,
    }),
    addDisclosureAppointment: builder.mutation<
      void,
      TAddDisclosureAppointmentDto
    >({
      query: (data) => ({
        url: "appointments",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Disclosure_Appointment", "Calendar_Appointments"],
    }),
    updateDisclosureAppointment: builder.mutation<
      void,
      TUpdateDisclosureAppointmentDto
    >({
      query: (data) => ({
        url: "appointments",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Disclosure_Appointment", "Calendar_Appointments"],
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

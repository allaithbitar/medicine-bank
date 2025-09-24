import type { TCreatedBy, TUpdatedBy } from "@/core/types/common.types";
import type { TDisclosure } from "../../disclosures/types/disclosure.types";

export type TCalendarAppointment = Record<string, number>;

export type TGetCalendarAppointmentsResponse = {
  totalCount: number;
  appointments: TCalendarAppointment;
};

export type TGetCalendarAppointmentsDto = {
  fromDate: string;
  toDate: string;
};

export type TAppointment = {
  id: string;
  disclosureId: string;
  date: string;
  isCompleted: boolean;
  disclosure: TDisclosure | null;
  createdAt: string;
  updatedAt: string | null;
} & TCreatedBy &
  TUpdatedBy;

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
  // id: string;
  // disclosureId: string;
  appointmentDate: string;
  isAppointmentCompleted: boolean;
  // disclosure: TDisclosure | null;
  // createdAt: string;
  // updatedAt: string | null;
};

export type TCreatedBy = {
  id: string;
  name: string;
  password: string;
  phone: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

export type TGetDisclosureAppointmentsResponse = {
  id: string;
  disclosureId: string;
  date: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: TCreatedBy;
  updatedBy: any;
};

export type TAddDisclosureAppointmentDto = {
  disclosureId: string;
  date: string;
  isCompleted?: boolean;
};

export type TUpdateDisclosureAppointmentDto = TAddDisclosureAppointmentDto & {
  id: string;
};

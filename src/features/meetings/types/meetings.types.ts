export type TMeeting = {
  id: string;
  note: string;
  date: string;
  createdAt?: string;
};

export type TAddMeetingPayload = {
  note: string;
  date: string;
  createdAt?: string;
};

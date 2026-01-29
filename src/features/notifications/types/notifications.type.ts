import type { TNotificationType } from '@/libs/kysely/schema';

export type TNotification = {
  id: string;
  title?: string;
  body?: string;
  type: TNotificationType;
  from: string;
  to: string;
  fromEmployee: { id: string; name: string };
  toEmployee: { id: string; name: string };
  text: string | null;
  recordId: string | null;
  readAt: string | null;
};

export type TNotificationsPayload = {
  type?: string;
  isRead?: boolean;
  from?: string;
  to?: string;
};

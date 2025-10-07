export const BROADCAST_TYPES = ["meeting", "custom"] as const;
export type TBroadcastType = (typeof BROADCAST_TYPES)[number];

export const BROADCAST_AUDIENCES = ["all", "scouts", "supervisors"] as const;
export type TBroadcastAudience = (typeof BROADCAST_AUDIENCES)[number];

export type TSystemBroadcast = {
  id: string;
  type: TBroadcastType;
  title: string;
  details: string;
  audience: TBroadcastAudience;
  createdAt?: string;
};

export type TSearchSystemBroadcastsPayload = {
  type: TBroadcastType;
  audience?: TBroadcastAudience[];
  pageNumber?: number;
  pageSize?: number;
  title?: string | null;
};

export type TAddSystemBroadcastPayload = Omit<
  TSystemBroadcast,
  "id" | "createdAt"
>;
export type TUpdateSystemBroadcastPayload = TSystemBroadcast;

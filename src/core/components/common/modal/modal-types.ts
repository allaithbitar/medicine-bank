import { createPubsub } from "@/utils/pubsub";
import type { ComponentType } from "react";

export type ModalSeverity = "info" | "warning" | "error" | "success";

export type ModalPropsMap = {
  confirmation: {
    title?: string;
    message: string;
    description?: string | React.ReactNode;
    severity?: ModalSeverity;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => Promise<void> | void;
    onCancel?: () => void;
  };
};

export const MODAL_PUBSUB_EVENT_NAMES = {
  OPEN: "MODAL_OPEN",
  CLOSE: "MODAL_CLOSE",
} as const;

export type ModalPubsubEvent =
  | (typeof MODAL_PUBSUB_EVENT_NAMES)["OPEN"]
  | (typeof MODAL_PUBSUB_EVENT_NAMES)["CLOSE"];

export type ModalPubsubEvents = {
  [MODAL_PUBSUB_EVENT_NAMES.OPEN]: {
    type: keyof ModalPropsMap;
    props: ModalPropsMap[keyof ModalPropsMap];
  };
  [MODAL_PUBSUB_EVENT_NAMES.CLOSE]: boolean;
};

export type ModalsMap = {
  [K in keyof ModalPropsMap]: ComponentType<
    ModalPropsMap[K] & { _close: () => void }
  >;
};
export const modalPubsub = createPubsub<ModalPubsubEvents>();

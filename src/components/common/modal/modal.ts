import type { ComponentType } from "react";
import { createPubsub } from "../../../utils/pubsub";

export type ModalPropsMap = {
  confirmation: {
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
  };
  // to not error out if type not added yet
  [key: string]: any;
};

export type ModalPubsubEvents = {
  [MODAL_PUBSUB_EVENTS.OPEN]: {
    type: keyof ModalPropsMap;
    props: ModalPropsMap[keyof ModalPropsMap];
  };
  // true to close all  false undefined to close last
  [MODAL_PUBSUB_EVENTS.CLOSE]: boolean;
};
export const MODAL_PUBSUB_EVENT_NAMES = {
  OPEN: "MODAL_OPEN",
  CLOSE: "MODAL_CLOSE",
} as const;
export type ModalPubsubEventName =
  | (typeof MODAL_PUBSUB_EVENT_NAMES)["OPEN"]
  | (typeof MODAL_PUBSUB_EVENT_NAMES)["CLOSE"];

export const MODAL_PUBSUB_EVENTS = MODAL_PUBSUB_EVENT_NAMES;

export type ModalsMap = {
  [K in keyof ModalPropsMap]: ComponentType<
    ModalPropsMap[K] & { _close: () => void }
  >;
};

export const modalPubsub = createPubsub<ModalPubsubEvents>();

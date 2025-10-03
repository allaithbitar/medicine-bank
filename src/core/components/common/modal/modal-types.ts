import type { ComponentProps } from "react";
import type ConfirmModal from "../modals/confirm/confirm.modal";

export type TModalExtraProps = {
  // it will always be sent but just to stop the ts compiler from parking
  modalId?: number;
};

export const MODAL_NAMES = {
  CONFIRM_MODAL: "CONFIRM_MODAL",
} as const;

export type TOpenModalPayload = {
  name: typeof MODAL_NAMES.CONFIRM_MODAL;
  props: ComponentProps<typeof ConfirmModal>;
};

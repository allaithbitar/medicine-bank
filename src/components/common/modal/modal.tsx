import { useState, useLayoutEffect, useCallback } from "react";
import {
  MODAL_PUBSUB_EVENT_NAMES,
  type ModalPropsMap,
  type ModalsMap,
  modalPubsub,
} from "./modalTypes.ts";
import { Box } from "@mui/material";
import ConfirmModal from "./confirmModal.tsx";

const MODALS: ModalsMap = {
  confirmation: ConfirmModal,
};

interface OpenedModalInstance<T extends keyof ModalPropsMap> {
  id: string;
  type: T;
  props: ModalPropsMap[T];
}

const Modal = () => {
  const [openedModals, setOpenedModals] = useState<
    Array<OpenedModalInstance<keyof ModalPropsMap>>
  >([]);

  const close = useCallback((closeAll?: boolean) => {
    modalPubsub.publish(MODAL_PUBSUB_EVENT_NAMES.CLOSE, closeAll ?? false);
  }, []);

  useLayoutEffect(() => {
    const unsubOpen = modalPubsub.subscribe(
      MODAL_PUBSUB_EVENT_NAMES.OPEN,
      (state) => {
        setOpenedModals((prev) => [
          ...prev,
          {
            ...state,
            id: String((Math.random() + 1) * 100),
          } as OpenedModalInstance<keyof ModalPropsMap>,
        ]);
      }
    );

    const unsubClose = modalPubsub.subscribe(
      MODAL_PUBSUB_EVENT_NAMES.CLOSE,
      (closeAll) => {
        setOpenedModals((prev) => {
          if (closeAll) {
            return [];
          } else {
            return prev.slice(0, -1);
          }
        });
      }
    );

    return () => {
      unsubOpen();
      unsubClose();
    };
  }, []);

  if (!openedModals.length) return null;

  return (
    <Box>
      {openedModals.map((m) => {
        const { type, props, id } = m;
        const ModalComponent = MODALS[type];
        if (!ModalComponent) {
          console.warn(`No modal component found for type: ${type}`);
          return null;
        }
        return (
          <ModalComponent
            key={id}
            {...(props as any)}
            _close={() => close(false)}
          />
        );
      })}
    </Box>
  );
};

export default Modal;

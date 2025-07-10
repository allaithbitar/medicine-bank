import React, { useState, useLayoutEffect, useCallback } from "react";
import {
  ModalPropsMap,
  ModalsMap,
  modalPubsub,
  MODAL_PUBSUB_EVENTS,
} from "./modal.ts";
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
    modalPubsub.publish(MODAL_PUBSUB_EVENTS.CLOSE, closeAll ?? false);
  }, []);

  useLayoutEffect(() => {
    const unsubOpen = modalPubsub.subscribe(
      MODAL_PUBSUB_EVENTS.OPEN,
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
      MODAL_PUBSUB_EVENTS.CLOSE,
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
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      {openedModals.map((m) => {
        const { type, props, id } = m;
        const ModalComponent = MODALS[type];
        if (!ModalComponent) {
          console.warn(`No modal component found for type: ${type}`);
          return null;
        }
        return (
          <Box
            key={id}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              pointerEvents: "auto",
            }}
          >
            <ModalComponent {...(props as any)} _close={() => close(false)} />
          </Box>
        );
      })}
    </Box>
  );
};

export default Modal;

import {
  useState,
  useCallback,
  createContext,
  type ReactNode,
  useMemo,
  useContext,
} from "react";
import { MODAL_NAMES, type TOpenModalPayload } from "./modal-types";
import ConfirmModal from "../modals/confirm/confirm.modal";

const MODALS = {
  [MODAL_NAMES.CONFIRM_MODAL]: ConfirmModal,
} as const;

const ModalContext = createContext<{
  openModal: (payload: TOpenModalPayload) => void;
  closeModal: (modalId?: number) => void;
}>({
  openModal: () => {},
  closeModal: () => {},
});

const initialState: (TOpenModalPayload & { id: number })[] = [];

const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalState, setModalState] = useState(initialState);
  const openModal = useCallback((payload: TOpenModalPayload) => {
    setModalState((prev) => [...prev, { ...payload, id: Date.now() }]);
  }, []);

  const closeModal = useCallback((modalId?: number) => {
    if (modalId)
      return setModalState((prev) => prev.filter((m) => m.id !== modalId));
    setModalState((prev) => prev.slice(0, -1));
  }, []);

  const contextValue = useMemo(
    () => ({ openModal, closeModal }),
    [closeModal, openModal]
  );

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      {modalState.map((m) => {
        const ModalComponent = MODALS[m.name];
        return (
          <ModalComponent key={m.id} {...(m.props as any)} modalId={m.id} />
        );
      })}
    </ModalContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useModal = () => useContext(ModalContext);

export default ModalProvider;

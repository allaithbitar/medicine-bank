import { useState, useCallback, createContext, type ReactNode, useMemo, useContext } from 'react';
import { MODAL_NAMES, type TOpenModalPayload } from './modal-types';
import ConfirmModal from '../modals/confirm/confirm.modal';
import { useSearchParams } from 'react-router-dom';
import BeneficiariesFiltersModal from '@/features/beneficiaries/components/beneficiaries-filters.modal';
import useDebouncedEffect from '@/core/hooks/use-debounced-effect.hook';
import DisclosureFiltersModal from '@/features/disclosures/components/disclosure-filters.modal';

const MODALS = {
  [MODAL_NAMES.CONFIRM_MODAL]: ConfirmModal,
  [MODAL_NAMES.BENEFICIARIES_FILTERS_MODAL]: BeneficiariesFiltersModal,
  [MODAL_NAMES.DISCLOSURE_FILTERS_MODAL]: DisclosureFiltersModal,
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
  const [searchParams, setSearchParams] = useSearchParams();

  const [modalState, setModalState] = useState(initialState);

  const openModal = useCallback(
    (payload: TOpenModalPayload) => {
      const id = Date.now();
      searchParams.append('modal', String(id));
      setSearchParams(searchParams);
      setModalState((prev) => [...prev, { ...payload, id }]);
    },
    [searchParams, setSearchParams]
  );

  const closeModal = useCallback(
    (modalId?: number) => {
      let newModalsState = searchParams.getAll('modal');

      if (modalId) {
        newModalsState = newModalsState.filter((mid) => mid !== modalId.toString());
        setSearchParams((prev) => ({ ...prev, modal: newModalsState }));

        return setModalState((prev) => prev.filter((m) => newModalsState.includes(m.id.toString())));
      }
      newModalsState = newModalsState.slice(0, -1);
      setSearchParams((prev) => ({ ...prev, modal: newModalsState }));
      setModalState((prev) => prev.filter((m) => newModalsState.includes(m.id.toString())));
    },
    [searchParams, setSearchParams]
  );

  const contextValue = useMemo(() => ({ openModal, closeModal }), [closeModal, openModal]);

  const openedModals = useMemo(
    () => modalState.filter((m) => searchParams.getAll('modal').includes(m.id.toString())),
    [modalState, searchParams]
  );

  // useDebouncedEffect({
  //   func: () => {
  //     const modalIdToDelete = searchParams
  //       .getAll('modal')
  //       .slice()
  //       .filter((mid) => !modalState.some((m) => m.id.toString() === mid));
  //     setSearchParams((prev) => {
  //       modalIdToDelete.forEach((mid) => {
  //         prev.delete('modal', mid);
  //       });

  //       return prev;
  //     });
  //   },
  //   deps: [searchParams],
  // });

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      {openedModals.map((m) => {
        const ModalComponent = MODALS[m.name];
        return <ModalComponent key={m.id} {...(m.props as any)} modalId={m.id} />;
      })}
    </ModalContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useModal = () => useContext(ModalContext);

export default ModalProvider;

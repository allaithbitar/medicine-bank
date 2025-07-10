import {
  MODAL_PUBSUB_EVENT_NAMES,
  modalPubsub,
  type ModalPropsMap,
} from "../components/common/modal/modal";
import { removeAllToasts } from "../components/common/toast/toast";
import { indexApi } from "../redux/api/index.api";
import { logout } from "../redux/slices/auth.slice";
import { store } from "../redux/store";

/**
 * log out and delete local store
 */
export const handleLogout = () => {
  removeAllToasts();
  store.dispatch(logout());
  store.dispatch(indexApi.util.resetApiState());
  sessionStorage.clear();
};

/**
 * Opens a modal of the specified type with the given props.
 * @template T - The type of the modal (must be a key in ModalPropsMap).
 * @param {T} type - The key representing the modal component.
 * @param {ModalPropsMap[T]} props - The props specific to that modal type.
 */
export function openModal<T extends keyof ModalPropsMap>(
  type: T,
  props: ModalPropsMap[T],
): void {
  modalPubsub.publish(MODAL_PUBSUB_EVENT_NAMES.OPEN, { type, props });
}

/**
 * Closes the last opened modal, or all modals if `closeAll` is true.
 * @param {boolean} [closeAll=false] - If true, closes all currently open modals. Defaults to false.
 */
export function closeModal(closeAll: boolean = false): void {
  modalPubsub.publish(MODAL_PUBSUB_EVENT_NAMES.CLOSE, closeAll);
}

import { rootApi } from "@/core/api/root.api";
import { removeAllToasts } from "@/core/components/common/toast/toast";
import { logoutUser } from "@/core/slices/auth/auth.slice";
import { store } from "@/core/store/root.store";

/**
 * log out and delete local store
 */
export const handleLogout = () => {
  removeAllToasts();
  store.dispatch(logoutUser());
  store.dispatch(rootApi.util.resetApiState());
  sessionStorage.clear();
};

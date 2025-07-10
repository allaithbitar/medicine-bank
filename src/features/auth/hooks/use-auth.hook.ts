import {
  selectCurrentToken,
  selectCurrentUser,
} from "@/core/slices/auth/auth.slice";
import { useMemo } from "react";
import { useSelector } from "react-redux";

const useAuth = () => {
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);
  return useMemo(() => ({ user, token }), [user, token]);
};
export default useAuth;

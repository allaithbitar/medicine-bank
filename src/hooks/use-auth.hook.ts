import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  selectCurrentUser,
  selectCurrentToken,
} from "../redux/slices/auth.slice";

const useAuth = () => {
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);
  return useMemo(() => ({ user, token }), [user, token]);
};
export default useAuth;

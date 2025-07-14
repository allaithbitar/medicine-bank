import { selectUser } from "../slices/auth/auth.slice";

export default function useUser() {
  return selectUser();
}

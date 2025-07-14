import useUser from "@/core/hooks/user-user.hook";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const RequireAuth = () => {
  const { id } = useUser();

  const location = useLocation();

  return id ? (
    <Outlet />
  ) : (
    <Navigate
      to="/login"
      state={{ from: `${location.pathname}${location.search || ""}` }}
      replace
    />
  );
};

export default RequireAuth;

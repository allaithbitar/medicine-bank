import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/use-auth.hook";

const RequireAuth = () => {
  const { user } = useAuth();

  const location = useLocation();

  return user ? (
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

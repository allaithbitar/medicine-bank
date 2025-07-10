import { Login } from "@mui/icons-material";
import { Box } from "@mui/material";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import FallbackUI from "./components/errorBoundary/fallback-ui.component";
import AppUiWrapper from "./core/components/layout/app-ui-wrapper/app-ui-wrapper.component";
import Layout from "./core/components/layout/layout/layout.component";
import EmployeeAccountForm from "./features/accounts-management/pages/employee-account-form.page";
import RequireAuth from "./features/auth/components/require-auth/require-auth.component";
import CitiesManagement from "./features/banks/pages/cities-management.page";
import WorkAreaManagement from "./features/banks/pages/work-areas-management.page";
import EmployeeManagement from "./features/employees-management/pages/employees-management.page";
import ErrorPage from "./pages/error.page";
import Unauthorized from "./pages/unauthorized.page";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" errorElement={<FallbackUI />} element={<AppUiWrapper />}>
        <Route path="login" element={<Login />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Layout />} errorElement={<ErrorPage />}>
            <Route index path="/" element={<Box sx={{ p: 10 }}>home</Box>} />
            <Route
              path="/employee-management"
              element={<EmployeeManagement />}
            />
            <Route
              path="/employee-management/manage"
              element={<EmployeeAccountForm />}
            />
            <Route
              path="/beneficiary-management"
              element={<EmployeeManagement />}
            />
            <Route path="/area-management" element={<WorkAreaManagement />} />
            <Route path="/cities-management" element={<CitiesManagement />} />
          </Route>
        </Route>
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;

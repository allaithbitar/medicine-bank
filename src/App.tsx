import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import FallbackUI from "./components/errorBoundary/fallback-ui.component";
import Layout from "./components/layout/layout.component";
import RequireAuth from "./components/require-auth.component";
import Login from "./pages/login.page.tsx";
import Unauthorized from "./pages/unauthorized.page.tsx";
import { Box } from "@mui/material";
import AppUiWrapper from "./components/layout/app-ui-wrapper.component";
import ErrorPage from "./pages/error.page.tsx";
import EmployeeAccountForm from "./pages/accounts-management/employee-account-form.page.tsx";
import EmployeeManagement from "./pages/employees-management/employees-management.page.tsx";
import WorkAreaManagement from "./pages/banks/work-areas-management.page.tsx";
import CitiesManagement from "./pages/banks/cities-management.page.tsx";

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

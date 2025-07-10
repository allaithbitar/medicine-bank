import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import FallbackUI from "./components/errorBoundary/fallbackUI";
import Layout from "./components/layout/layout.component";
import RequireAuth from "./components/requireAuth";
import AuthenticatedErrorPage from "./pages/authenticatedErrorPage";
import Login from "./pages/login";
import Unauthorized from "./pages/unauthorized";
import { Box } from "@mui/material";
import AppUiWrapper from "./components/layout/appUiWrapper";
import EmployeeManagement from "./pages/employeeManagement";
import EmployeeAccountForm from "./pages/accountManagement/employeeAccountForm";
import WorkAreaManagement from "./pages/banks/workAreas";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" errorElement={<FallbackUI />} element={<AppUiWrapper />}>
        <Route path="login" element={<Login />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route element={<RequireAuth />}>
          <Route
            path="/"
            element={<Layout />}
            errorElement={<AuthenticatedErrorPage />}
          >
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
          </Route>
        </Route>
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;

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
import EmployeeAccountForm from "./features/accounts-forms/pages/employee-account-form.page";
import RequireAuth from "./features/auth/components/require-auth/require-auth.component";
import CitiesManagement from "./features/banks/pages/cities/cities-management.page";
import WorkAreaManagement from "./features/banks/pages/work-areas/work-areas-management.page";
import Unauthorized from "./pages/unauthorized.page";
import LoginPage from "./features/auth/pages/login.page";
import NotFoundPage from "./core/pages/not-found.page";
import DisclosuresPage from "./features/disclosures/pages/disclosures.page";
import DisclosureActionPage from "./features/disclosures/pages/disclosure-action.page";
import BeneficiariesPage from "./features/beneficiaries/pages/beneficiaries.page";
import BeneficiaryPage from "./features/beneficiaries/pages/beneficiary.page";
import EmployeesPage from "./features/employees/pages/employees.page";
import BeneficiaryActionPage from "./features/beneficiaries/pages/beneficiary-action.page";
import DisclosurePage from "./features/disclosures/pages/disclosure.page";
import DisclosureRatingActionPage from "./features/disclosures/pages/disclosure-rating-action.page";
import RatingsPage from "./features/ratings/pages/ratings.page";
import DisclosureVisitActionPage from "./features/disclosures/pages/disclosure-visit-action.page";
import SyncPage from "./features/offline/pages/sync.page";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" errorElement={<FallbackUI />} element={<AppUiWrapper />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Layout />}>
            <Route index path="/" element={<Box>home</Box>} />

            <Route path="/employee-management" element={<EmployeesPage />} />

            <Route
              path="/employee-management/manage/:type"
              element={<EmployeeAccountForm />}
            />

            <Route path="/disclosures" element={<DisclosuresPage />} />

            <Route
              path="/disclosures/action"
              element={<DisclosureActionPage />}
            />

            <Route
              path="/disclosures/:disclosureId"
              element={<DisclosurePage />}
            />

            <Route
              path="/disclosures/:disclosureId/rating/action"
              element={<DisclosureRatingActionPage />}
            />

            <Route
              path="/disclosures/:disclosureId/visit/action"
              element={<DisclosureVisitActionPage />}
            />

            <Route path="/beneficiaries" element={<BeneficiariesPage />} />

            <Route path="/beneficiaries/:id" element={<BeneficiaryPage />} />

            <Route
              path="/beneficiaries/:id/action"
              element={<BeneficiaryActionPage />}
            />

            <Route
              path="/work-area-management"
              element={<WorkAreaManagement />}
            />
            <Route path="/cities-management" element={<CitiesManagement />} />

            <Route path="/ratings" element={<RatingsPage />} />

            <Route path="/sync" element={<SyncPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>,
    ),
  );

  return <RouterProvider router={router} />;
}

export default App;

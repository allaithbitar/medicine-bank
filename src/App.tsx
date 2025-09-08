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
import Cities from "./features/banks/pages/cities/cities.page";
import WorkAreas from "./features/banks/pages/work-areas/work-areas.page";
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
import EmployeeActionPage from "./features/employees/pages/employee-action.page";
import PriorityDegreesPage from "./features/priority-degres/pages/priority-degrees.page";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" errorElement={<FallbackUI />} element={<AppUiWrapper />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Layout />}>
            <Route index path="/" element={<Box>home</Box>} />

            <Route path="/employees" element={<EmployeesPage />} />

            <Route path="/employees/action" element={<EmployeeActionPage />} />

            <Route
              path="/employee/manage/:type"
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
              path="/beneficiaries/action"
              element={<BeneficiaryActionPage />}
            />

            <Route path="/work-areas" element={<WorkAreas />} />
            <Route path="/cities" element={<Cities />} />

            <Route path="/ratings" element={<RatingsPage />} />
            <Route path="/priority-degrees" element={<PriorityDegreesPage />} />

            <Route path="/sync" element={<SyncPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;

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
import SatisticsPage from "./features/satistics/pages/satistics.page";
import MedicinesPage from "./features/banks/pages/medicines/medicines.page";
import AppointmentsPage from "./features/appointments/pages/appointments.page";
import DisclosureAppointmentActionPage from "./features/disclosures/pages/disclosure-appointment-action.page";
import PriorityDegreesActionPage from "./features/priority-degres/pages/priority-degrees-action.page";
import CityActionPage from "./features/banks/pages/cities/city-action.page";
import WorkAreaActionPage from "./features/banks/pages/work-areas/work-area-action.page";
import RatingActionPage from "./features/ratings/pages/rating-action.page";
import MedicineActionPage from "./features/banks/pages/medicines/medicine-action.page";
import BeneficiaryMedicineActionPage from "./features/beneficiaries/pages/beneficiary-medicine-action.page";
import BeneficiaryFamilyActionPage from "./features/beneficiaries/pages/beneficiary-family-action.page";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" errorElement={<FallbackUI />} element={<AppUiWrapper />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Layout />}>
            <Route index path="/" element={<SatisticsPage />} />

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

            <Route
              path="/disclosures/:disclosureId/appointment/action"
              element={<DisclosureAppointmentActionPage />}
            />
            <Route path="/beneficiaries" element={<BeneficiariesPage />} />

            <Route path="/beneficiaries/:id" element={<BeneficiaryPage />} />
            <Route
              path="/beneficiaries/:id/medicine/action"
              element={<BeneficiaryMedicineActionPage />}
            />
            <Route
              path="/beneficiaries/:id/family/action"
              element={<BeneficiaryFamilyActionPage />}
            />

            <Route
              path="/beneficiaries/action"
              element={<BeneficiaryActionPage />}
            />
            <Route path="/work-areas" element={<WorkAreas />} />
            <Route path="/work-areas/action" element={<WorkAreaActionPage />} />

            <Route path="/cities" element={<Cities />} />
            <Route path="/cities/action" element={<CityActionPage />} />

            <Route path="/ratings" element={<RatingsPage />} />
            <Route path="/ratings/action" element={<RatingActionPage />} />

            <Route path="/medicines" element={<MedicinesPage />} />
            <Route path="/medicines/action" element={<MedicineActionPage />} />

            <Route path="/priority-degrees" element={<PriorityDegreesPage />} />
            <Route
              path="/priority-degrees/action"
              element={<PriorityDegreesActionPage />}
            />

            <Route path="/sync" element={<SyncPage />} />
            <Route path="/calendar" element={<AppointmentsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;

// import ActionsFab from "@/core/components/common/actions-fab/actions-fab.component";
import ActionsFab from "@/core/components/common/actions-fab/actions-fab.component";
import STRINGS from "@/core/constants/strings.constant";
import { Add } from "@mui/icons-material";
import { useModal } from "@/core/components/common/modal/modal-provider.component";
import employeesApi from "../api/employees.api";
import { Grid } from "@mui/material";
import { DEFAULT_GRID_SIZES } from "@/core/constants/properties.constant";
import EmployeeCard from "../components/employee-card.component";

const EmployeesPage = () => {
  const { openModal } = useModal();

  const { data: { items: employees } = { items: [] } } =
    employeesApi.useGetEmployeesQuery({});

  return (
    <Grid container gap={2}>
      {employees.map((e) => (
        <Grid size={DEFAULT_GRID_SIZES} key={e.id}>
          <EmployeeCard
            employee={e}
            onEditClick={() =>
              openModal({
                name: "EMPLOYEE_ACTION_MODAL",
                props: { employeeData: e },
              })
            }
          />
        </Grid>
      ))}
      <ActionsFab
        actions={[
          {
            label: STRINGS.add_employee,
            icon: <Add />,
            onClick: () =>
              openModal({ name: "EMPLOYEE_ACTION_MODAL", props: {} }),
          },
        ]}
      />
    </Grid>
  );
};

export default EmployeesPage;

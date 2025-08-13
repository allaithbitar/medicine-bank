// import ActionsFab from "@/core/components/common/actions-fab/actions-fab.component";
import ActionsFab from "@/core/components/common/actions-fab/actions-fab.component";
import STRINGS from "@/core/constants/strings.constant";
import { Add } from "@mui/icons-material";
import employeesApi from "../api/employees.api";
import { Grid } from "@mui/material";
import { DEFAULT_GRID_SIZES } from "@/core/constants/properties.constant";
import EmployeeCard from "../components/employee-card.component";
import { useNavigate } from "react-router-dom";

const EmployeesPage = () => {
  const navigate = useNavigate();

  const { data: { items: employees } = { items: [] } } =
    employeesApi.useGetEmployeesQuery({});

  return (
    <Grid container spacing={2}>
      {employees.map((e) => (
        <Grid size={DEFAULT_GRID_SIZES} key={e.id}>
          <EmployeeCard employee={e} />
        </Grid>
      ))}
      <ActionsFab
        actions={[
          {
            label: STRINGS.add_employee,
            icon: <Add />,
            onClick: () => navigate("/employees/action"),
          },
        ]}
      />
    </Grid>
  );
};

export default EmployeesPage;

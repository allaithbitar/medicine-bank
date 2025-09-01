// import ActionsFab from "@/core/components/common/actions-fab/actions-fab.component";
import ActionsFab from "@/core/components/common/actions-fab/actions-fab.component";
import STRINGS from "@/core/constants/strings.constant";
import { Add } from "@mui/icons-material";
import employeesApi from "../api/employees.api";
import { Stack } from "@mui/material";
import EmployeeCard from "../components/employee-card.component";
import { useNavigate } from "react-router-dom";

const EmployeesPage = () => {
  const navigate = useNavigate();

  const { data: { items: employees } = { items: [] } } =
    employeesApi.useGetEmployeesQuery({});

  return (
    <Stack gap={2}>
      {employees.map((e) => (
        <EmployeeCard employee={e} key={e.id} />
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
    </Stack>
  );
};

export default EmployeesPage;

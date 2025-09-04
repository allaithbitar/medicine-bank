// import ActionsFab from "@/core/components/common/actions-fab/actions-fab.component";
import ActionsFab from "@/core/components/common/actions-fab/actions-fab.component";
import STRINGS from "@/core/constants/strings.constant";
import { Add } from "@mui/icons-material";
import employeesApi from "../api/employees.api";
import { Stack } from "@mui/material";
import EmployeeCard from "../components/employee-card.component";
import { useNavigate } from "react-router-dom";
import VirtualizedList from "@/core/components/common/virtualized-list/virtualized-list.component";

const EmployeesPage = () => {
  const navigate = useNavigate();

  const { data: { items: employees } = { items: [] } } =
    employeesApi.useGetEmployeesQuery({});

  return (
    <Stack gap={2} sx={{ height: "100%" }}>
      <VirtualizedList
        items={employees}
        containerStyle={{ flex: 1 }}
        virtualizationOptions={{
          count: employees.length,
        }}
      >
        {({ item: e }) => {
          return <EmployeeCard employee={e} key={e.id} />;
        }}
      </VirtualizedList>
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

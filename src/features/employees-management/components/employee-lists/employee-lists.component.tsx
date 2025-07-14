import { useState, useCallback } from "react";
import { Grid } from "@mui/material";
import { Person as UserIcon } from "@mui/icons-material";

import type { TEmployeeAccount } from "@/features/accounts-forms/types/employee.types";
import EmployeeCardComponent from "../employee-card/employee-card.component";
import Nodata from "@/core/components/common/no-data/no-data.component";
import { useModal } from "@/core/components/common/modal/modal-provider.component";
import { useNavigate } from "react-router-dom";

const employees: (TEmployeeAccount & { id: string })[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    password: "SecurePass123!",
    confirmPassword: "SecurePass123!",
    phone: "+1 (555) 123-4567",
    role: "manager",
    workArea: "street1",
  },
  {
    id: "2",
    name: "Michael Chen",
    password: "MyPassword456@",
    confirmPassword: "MyPassword456@",
    phone: "+1 (555) 234-5678",
    role: "manager",
    workArea: "street2",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    password: "StrongPass789#",
    confirmPassword: "StrongPass789#",
    phone: "+1 (555) 345-6789",
    role: "manager",
    workArea: "street2",
  },
  {
    id: "4",
    name: "David Thompson",
    password: "AdminPass321$",
    confirmPassword: "AdminPass321$",
    phone: "+1 (555) 456-7890",
    role: "scout",
    workArea: "street2",
  },
  {
    id: "5",
    name: "Lisa Wang",
    password: "UserPass654%",
    confirmPassword: "UserPass654%",
    phone: "+1 (555) 567-8901",
    role: "supervisor",
    workArea: "street3",
  },
  {
    id: "6",
    name: "James Wilson",
    password: "TechPass987^",
    confirmPassword: "TechPass987^",
    phone: "+1 (555) 678-9012",
    role: "supervisor",
    workArea: "street3",
  },
];

const EmployeesList = () => {
  const { openModal } = useModal();
  const navigate = useNavigate();
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(
    new Set(),
  );
  const togglePasswordVisibility = useCallback((employeeId: string) => {
    setVisiblePasswords((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(employeeId)) {
        newSet.delete(employeeId);
      } else {
        newSet.add(employeeId);
      }
      return newSet;
    });
  }, []);

  const maskPassword = useCallback((password: string) => {
    return "•".repeat(password.length);
  }, []);

  const handleEditEmployee = useCallback(
    (employeeData: TEmployeeAccount) => {
      navigate(`/employee-management/manage/edit`, {
        state: { employee: employeeData },
      });
    },
    [navigate],
  );

  const handleDeleteEmployeeClick = useCallback(
    (id: string) => {
      openModal({
        name: "CONFIRM_MODAL",
        props: {
          message: "Are you sure you want to delete this item?",
          onConfirm: () => {
            console.log("🚀 ~ handleDeleteEmployeeClick ~ id:", id);
          },
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <>
      <Grid container gap={2} justifyContent="center">
        {employees.map((employee) => (
          <Grid key={employee.id}>
            <EmployeeCardComponent
              employee={employee}
              isVisible={visiblePasswords.has(employee.id)}
              onToggleVisibility={togglePasswordVisibility}
              maskPassword={maskPassword}
              onEdit={() => handleEditEmployee(employee)}
              onDelete={() => handleDeleteEmployeeClick(employee.id)}
            />
          </Grid>
        ))}
      </Grid>
      {employees.length === 0 && <Nodata icon={<UserIcon />} />}
    </>
  );
};
export default EmployeesList;

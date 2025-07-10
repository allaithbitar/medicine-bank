import { useState, useCallback } from "react";
import { Box, Grid } from "@mui/material";
import { Person as UserIcon } from "@mui/icons-material";

import Nodata from "./common/nodata";
import EmployeeCard from "./employeeCard";
import type { TEmployeeAccount } from "../pages/accountManagement/schema/employeeSchema";
import { closeModal, openModal } from "../utils/helpers";

const employees: (TEmployeeAccount & { id: string })[] = [
  {
    id: "1",
    employeeName: "Sarah Johnson",
    password: "SecurePass123!",
    confirmPassword: "SecurePass123!",
    phone: "+1 (555) 123-4567",
    position: "Senior Software Engineer",
    workArea: "Development Team",
  },
  {
    id: "2",
    employeeName: "Michael Chen",
    password: "MyPassword456@",
    confirmPassword: "MyPassword456@",
    phone: "+1 (555) 234-5678",
    position: "Product Manager",
    workArea: "Product Strategy",
  },
  {
    id: "3",
    employeeName: "Emily Rodriguez",
    password: "StrongPass789#",
    confirmPassword: "StrongPass789#",
    phone: "+1 (555) 345-6789",
    position: "UX Designer",
    workArea: "Design Team",
  },
  {
    id: "4",
    employeeName: "David Thompson",
    password: "AdminPass321$",
    confirmPassword: "AdminPass321$",
    phone: "+1 (555) 456-7890",
    position: "DevOps Engineer",
    workArea: "Infrastructure",
  },
  {
    id: "5",
    employeeName: "Lisa Wang",
    password: "UserPass654%",
    confirmPassword: "UserPass654%",
    phone: "+1 (555) 567-8901",
    position: "Data Analyst",
    workArea: "Analytics Team",
  },
  {
    id: "6",
    employeeName: "James Wilson",
    password: "TechPass987^",
    confirmPassword: "TechPass987^",
    phone: "+1 (555) 678-9012",
    position: "Marketing Specialist",
    workArea: "Marketing Department",
  },
];

const EmployeeCards = () => {
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(
    new Set()
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

  const handleEditEmployee = useCallback((id: string) => {
    console.log("🚀 ~ handleEditEmployee ~ id:", id);
    // navigate(`/employees/edit/${employee.id}`);
  }, []);

  const handleDeleteEmployeeClick = useCallback((id: string) => {
    openModal("confirmation", {
      message: "Are you sure you want to delete this item?",
      onConfirm: () => {
        console.log("Item deleted!");
        closeModal();
      },
      onCancel: () => {
        console.log("Deletion cancelled.");
      },
    });
    console.log("🚀 ~ handleDeleteEmployeeClick ~ id:", id);
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
      }}
    >
      <Grid container spacing={2} justifyContent="center">
        {employees.map((employee) => (
          <Grid key={employee.id}>
            <EmployeeCard
              employee={employee}
              isVisible={visiblePasswords.has(employee.id)}
              onToggleVisibility={togglePasswordVisibility}
              maskPassword={maskPassword}
              onEdit={() => handleEditEmployee(employee.id)}
              onDelete={() => handleDeleteEmployeeClick(employee.id)}
            />
          </Grid>
        ))}
      </Grid>
      {employees.length === 0 && <Nodata icon={<UserIcon />} />}
    </Box>
  );
};
export default EmployeeCards;

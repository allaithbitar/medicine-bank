import STRINGS from "@/core/constants/strings.constant";
import { Card } from "@mui/material";

import { useRef } from "react";
import {
  notifyError,
  notifySuccess,
} from "@/core/components/common/toast/toast";
import employeesApi from "../api/employees.api";
import type { TAddEmployeeDto } from "../types/employee.types";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { TEmployeeFormHandlers } from "../components/employee-action-form.component";
import EmployeeActionForm from "../components/employee-action-form.component";
import LoadingOverlay from "@/core/components/common/loading-overlay/loading-overlay";
import ActionFab from "@/core/components/common/action-fab/acion-fab.component";
import { Save } from "@mui/icons-material";

const EmployeeActionPage = () => {
  const ref = useRef<TEmployeeFormHandlers | null>(null);

  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const employeeId = searchParams.get("employeeId");

  const [addEmployee, { isLoading: isAdding }] =
    employeesApi.useAddEmployeeMutation();

  const [updateEmployee, { isLoading: isUpdating }] =
    employeesApi.useUpdateEmployeeMutation();

  const { data: employeeData, isFetching: isGetting } =
    employeesApi.useGetEmployeeQuery(
      { id: employeeId! },
      { skip: !employeeId },
    );

  const isLoading = isAdding || isUpdating || isGetting;
  console.log({ employeeData });

  const handleSave = async () => {
    const { isValid, result } = await ref.current!.handleSubmit();
    console.log({ isValid, result });

    if (!isValid) return;
    try {
      const addDto: TAddEmployeeDto = {
        name: result.name,
        phone: result.phone,
        areaId: result.area?.id,
        password: result.password,
        role: result.role!.id,
      };

      if (!employeeId) {
        const { error } = await addEmployee(addDto);

        if (error) {
          notifyError(error);
        } else {
          notifySuccess(STRINGS.added_successfully);
          navigate(-1);
        }
      } else {
        const { error } = await updateEmployee({
          ...addDto,
          id: employeeId,
        });
        if (error) {
          notifyError(error);
        } else {
          notifySuccess(STRINGS.edited_successfully);
          navigate(-1);
        }
      }
    } catch (error: any) {
      notifyError(error);
    }
  };

  return (
    <Card>
      <EmployeeActionForm ref={ref} employeeData={employeeData} />
      <ActionFab
        icon={<Save />}
        color="success"
        onClick={handleSave}
        disabled={isLoading}
      />
      {isLoading && <LoadingOverlay />}
    </Card>
  );
};

export default EmployeeActionPage;

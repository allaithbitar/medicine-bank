import { useModal } from "@/core/components/common/modal/modal-provider.component";
import ModalWrapper from "@/core/components/common/modal/modal-wrapper.component";
import STRINGS from "@/core/constants/strings.constant";
import { Button, Stack } from "@mui/material";

import { useRef } from "react";
import {
  notifyError,
  notifySuccess,
} from "@/core/components/common/toast/toast";
import { getErrorMessage } from "@/core/helpers/helpers";
import type { TEmployeeFormHandlers } from "./employee-action-form.component";
import EmployeeActionForm from "./employee-action-form.component";
import employeesApi from "../api/employees.api";
import type { TAddEmployeeDto } from "../types/employee.types";

const EmployeeActionModal = ({ employeeData }: { employeeData?: any }) => {
  const { closeModal } = useModal();

  const ref = useRef<TEmployeeFormHandlers | null>(null);

  const [addEmployee, { isLoading: isAdding }] =
    employeesApi.useAddEmployeeMutation();

  const [updateEmployee, { isLoading: isUpdating }] =
    employeesApi.useUpdateEmployeeMutation();

  //
  // const [updateBeneficiary, { isLoading: isUpdating }] =
  //   beneficiaryApi.useUpdateBeneficiaryMutation();

  const isLoading = isAdding || isUpdating;

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

      if (!employeeData) {
        const { error } = await addEmployee(addDto);

        if (error) {
          notifyError(getErrorMessage(error));
        } else {
          notifySuccess(STRINGS.added_successfully);
        }
      } else {
        const { error } = await updateEmployee({
          ...addDto,
          id: employeeData.id,
        });
        if (error) {
          notifyError(getErrorMessage(error));
        } else {
          notifySuccess(STRINGS.edited_successfully);
        }
      }
    } catch (error: any) {
      notifyError(getErrorMessage(error));
    }
  };

  return (
    <ModalWrapper
      isLoading={isLoading}
      actionButtons={
        <Stack gap={1} sx={{ width: "100%" }}>
          <Button
            onClick={handleSave}
            variant="contained"
            // onClick={handleSubmit}
            // disabled={isLoading}
            sx={{ flexGrow: 1 }}
          >
            {employeeData ? STRINGS.save : STRINGS.add}
          </Button>

          <Button variant="outlined" onClick={() => closeModal()} color="error">
            {STRINGS.cancel}
          </Button>
        </Stack>
      }
    >
      <EmployeeActionForm ref={ref} employeeData={employeeData} />
    </ModalWrapper>
  );
};

export default EmployeeActionModal;

import {
  Box,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Button,
  Card,
} from "@mui/material";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { Check as CheckIcon, Close as XMarkIcon } from "@mui/icons-material";
import { EMPLOYEE_ROLE, type TEmployeeAccount } from "../types/employee.types";
import useReducerState from "@/core/hooks/use-reducer.hook";
import accountsManagementApi from "../api/accounts-forms.api";
import type { IOptions } from "@/core/types/common.types";
import {
  employeeAccountSchema,
  updateEmployeeAccountSchema,
} from "../schemas/employee-form-schema";
import { useLocation, useNavigate } from "react-router-dom";
// import WorkAreaAutoComplete from "@/features/banks/components/work-areas/work-area-autocomplete/work-area-autocomplete.component";
import CustomAppBar from "@/core/components/common/custom-app-bar/custom-app-bar.component";
import LoadingOverlay from "@/core/components/common/loading-overlay/loading-overlay";
import {
  notifyError,
  notifySuccess,
} from "@/core/components/common/toast/toast";

const initialEmployeeAccountData: TEmployeeAccount = {
  name: "",
  password: "",
  confirmPassword: "",
  phone: "",
  role: "manager",
  workArea: null,
};

const EmployeeAccountForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [employeeData, setEmployeeData] = useReducerState<TEmployeeAccount>(
    initialEmployeeAccountData,
  );
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);

  const [addEmployee, { isLoading: isAddingEmp }] =
    accountsManagementApi.useAddEmployeeMutation();
  // const [editEmployee, { isLoading: isEditingEmp }] =
  //   accountsManagementApi.useEditEmployeeMutation();

  const oldEmployeeData = (location.state as { employee?: TEmployeeAccount })
    ?.employee;

  useEffect(() => {
    if (oldEmployeeData) {
      setEmployeeData(oldEmployeeData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEmployeeChange = (
    field: keyof TEmployeeAccount,
    value: string | IOptions | null,
  ) => {
    setEmployeeData({ [field]: value });
    setErrors((prevErrors) =>
      prevErrors.filter((error) => error.path[0] !== field),
    );
  };

  const getErrorForField = (fieldName: keyof TEmployeeAccount) => {
    const error = errors.find((err) => err.path[0] === fieldName);
    return error ? error.message : "";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      employeeAccountSchema.parse(employeeData);
      console.log("🚀 ~ handleSubmit ~ employeeData:", employeeData);
      if (oldEmployeeData) {
        const validatedPayload =
          updateEmployeeAccountSchema.parse(employeeData);
        console.log("🚀 ~ handleSubmit ~ validatedPayload:", validatedPayload);

        // await editEmployee({
        //   ...validatedPayload,
        //   id: oldEmployeeData.id ?? "",
        // }).unwrap();
      } else {
        employeeAccountSchema.parse(employeeData);
        await addEmployee(employeeData).unwrap();
      }

      setErrors([]);
      await addEmployee(employeeData).unwrap();
      notifySuccess();
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setErrors(err.errors);
      } else {
        notifyError(err);
      }
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  const isLoading = isAddingEmp;

  return (
    <Stack maxWidth="lg" gap={2} sx={{ mt: 2, mx: "auto" }}>
      {isLoading && <LoadingOverlay />}
      <CustomAppBar title="Add Account" subtitle="Add an Employee Account" />
      <Card sx={{ p: 2 }}>
        <form onSubmit={handleSubmit}>
          <Stack gap={4}>
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Personal Information
              </Typography>
              <Stack gap={2}>
                <TextField
                  fullWidth
                  label="Employee Name"
                  value={employeeData.name}
                  onChange={(e) => handleEmployeeChange("name", e.target.value)}
                  error={!!getErrorForField("name")}
                  helperText={getErrorForField("name")}
                />
                <TextField
                  fullWidth
                  label="Phone"
                  type="tel"
                  value={employeeData.phone}
                  onChange={(e) =>
                    handleEmployeeChange("phone", e.target.value)
                  }
                  error={!!getErrorForField("phone")}
                  helperText={getErrorForField("phone")}
                />
              </Stack>
            </Box>
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Work Information
              </Typography>
              <Stack gap={2}>
                <TextField
                  fullWidth
                  select
                  label="role"
                  value={employeeData.role}
                  onChange={(e) => handleEmployeeChange("role", e.target.value)}
                  error={!!getErrorForField("role")}
                  helperText={getErrorForField("role")}
                >
                  {Object.values(EMPLOYEE_ROLE).map((er) => (
                    <MenuItem key={er} value={er}>
                      {er}
                    </MenuItem>
                  ))}
                </TextField>
                {/* <WorkAreaAutoComplete
                  autoCompleteProps={{
                    fullWidth: true,
                  }}
                  value={employeeData.workArea}
                  onChange={(o: any) => {
                    handleEmployeeChange("workArea", o);
                  }}
                  textFieldError={!!getErrorForField("workArea")}
                  helperText={getErrorForField("workArea")}
                /> */}
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={employeeData.password}
                  onChange={(e) =>
                    handleEmployeeChange("password", e.target.value)
                  }
                  error={!!getErrorForField("password")}
                  helperText={getErrorForField("password")}
                />
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  value={employeeData.confirmPassword}
                  onChange={(e) =>
                    handleEmployeeChange("confirmPassword", e.target.value)
                  }
                  error={!!getErrorForField("confirmPassword")}
                  helperText={getErrorForField("confirmPassword")}
                />
              </Stack>
            </Box>
            <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: "divider" }}>
              <Stack
                sx={{
                  flexDirection: "row",
                  gap: 1,
                  justifyContent: { sm: "flex-end" },
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<XMarkIcon />}
                  onClick={goBack}
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  go back
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<CheckIcon />}
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  submit
                </Button>
              </Stack>
            </Box>
          </Stack>
        </form>
      </Card>
    </Stack>
  );
};

export default EmployeeAccountForm;

import {
  Box,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Button,
  Card,
  AppBar,
  Toolbar,
} from "@mui/material";
import { useState } from "react";
import { z } from "zod";
import { Check as CheckIcon, Close as XMarkIcon } from "@mui/icons-material";

import useReducerState from "../../hooks/use-reducer.hook";
import {
  employeeAccountSchema,
  type TEmployeeAccount,
} from "../../form-schemas/employee-schema";
import accountManagementApi from "../../redux/api/account-management.api";
import { showError, showSuccess } from "../../components/common/toast/toast";
import WorkAreaAutoComplete from "../../components/autoComplete/work-area-autocomplete.component";
import type { IOptions } from "../../types/common.types";

const initialEmployeeAccountData: TEmployeeAccount = {
  employeeName: "",
  password: "",
  confirmPassword: "",
  phone: "",
  position: "manager",
  workArea: null,
};

const EmployeeAccountForm = () => {
  const [employeeData, setEmployeeData] = useReducerState<TEmployeeAccount>(
    initialEmployeeAccountData
  );
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);

  const [addEmployee] = accountManagementApi.useAddEmployeeMutation();

  const handleEmployeeChange = (
    field: keyof TEmployeeAccount,
    value: string | IOptions | null
  ) => {
    setEmployeeData({ [field]: value });
    setErrors((prevErrors) =>
      prevErrors.filter((error) => error.path[0] !== field)
    );
  };

  const getErrorForField = (fieldName: keyof TEmployeeAccount) => {
    const error = errors.find((err) => err.path[0] === fieldName);
    return error ? error.message : "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      employeeAccountSchema.parse(employeeData);
      setErrors([]);
      await addEmployee(employeeData).unwrap();
      showSuccess();
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setErrors(err.errors);
      } else {
        showError(err);
      }
    }
  };
  const resetForm = () => {
    setEmployeeData(initialEmployeeAccountData);
  };

  return (
    <Stack maxWidth="lg" gap={2} sx={{ mt: 2, mx: "auto" }}>
      <AppBar
        position="static"
        color="inherit"
        sx={{ borderRadius: 1, py: 1 }}
        elevation={0}
      >
        <Toolbar
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Stack>
            <Typography variant="h5" component="h3">
              Add Account
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              Add an Employee Account
            </Typography>
          </Stack>
        </Toolbar>
      </AppBar>
      <Card sx={{ p: 2 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Personal Information
              </Typography>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Employee Name"
                  value={employeeData.employeeName}
                  onChange={(e) =>
                    handleEmployeeChange("employeeName", e.target.value)
                  }
                  error={!!getErrorForField("employeeName")}
                  helperText={getErrorForField("employeeName")}
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
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  select
                  label="Position"
                  value={employeeData.position}
                  onChange={(e) =>
                    handleEmployeeChange("position", e.target.value)
                  }
                  error={!!getErrorForField("position")}
                  helperText={getErrorForField("position")}
                >
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="employee">Employee</MenuItem>
                  <MenuItem value="supervisor">Supervisor</MenuItem>
                </TextField>
                <WorkAreaAutoComplete
                  autoCompleteProps={{
                    fullWidth: true,
                  }}
                  value={employeeData.workArea}
                  onChange={(o) => {
                    console.log("first", o);
                    handleEmployeeChange("workArea", o);
                  }}
                  textFieldError={!!getErrorForField("workArea")}
                  helperText={getErrorForField("workArea")}
                />
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
                  onClick={resetForm}
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  Reset
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

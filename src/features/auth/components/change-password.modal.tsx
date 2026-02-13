import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, CircularProgress } from '@mui/material';
import { z } from 'zod';
import STRINGS from '@/core/constants/strings.constant';
import { useModal } from '@/core/components/common/modal/modal-provider.component';
import { notifyError, notifySuccess } from '@/core/components/common/toast/toast';
import FormTextFieldInput from '@/core/components/common/inputs/form-text-field-input.component';
import useForm from '@/core/hooks/use-form.hook';
import employeesApi from '@/features/employees/api/employees.api';
import { selectUser } from '@/core/slices/auth/auth.slice';
import type { TUpdateEmployeeDto } from '@/features/employees/types/employee.types';

const changePasswordSchema = z
  .object({
    // currentPassword: z.string().min(1, { message: STRINGS.schema_required }),
    newPassword: z.string().min(6, { message: STRINGS.schema_weak_password }),
    confirmPassword: z.string().min(1, { message: STRINGS.schema_required }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: STRINGS.schema_passwords_mismatch,
    path: ['confirmPassword'],
  });

const ChangePasswordModal = () => {
  const { closeModal } = useModal();
  const currentUser = selectUser();
  const [updateEmployee, { isLoading }] = employeesApi.useUpdateEmployeeMutation();
  const { formState, setValue, formErrors, handleSubmit } = useForm({
    schema: changePasswordSchema,
    initalState: {
      // currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  const handleSave = async () => {
    const { isValid, result } = await handleSubmit();
    if (!isValid) return;
    try {
      const updateDto: TUpdateEmployeeDto = {
        id: currentUser.id,
        name: currentUser.name,
        phone: currentUser.phone,
        role: currentUser.role,
        password: result.newPassword,
      };
      const { error } = await updateEmployee(updateDto);
      if (error) {
        notifyError(error);
      } else {
        notifySuccess(STRINGS.action_done_successfully);
        closeModal();
      }
    } catch (error: any) {
      notifyError(error);
    }
  };

  return (
    <Dialog
      open
      maxWidth="sm"
      fullWidth
      onClose={() => {
        if (!isLoading) closeModal();
      }}
    >
      <DialogTitle>{STRINGS.change_password}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {/* <FormTextFieldInput
            required
            type="password"
            label={STRINGS.current_password}
            value={formState.currentPassword}
            onChange={(v) => setValue({ currentPassword: v })}
            errorText={formErrors.currentPassword?.[0]?.message}
            disabled={isLoading}
          /> */}
          <FormTextFieldInput
            required
            type="password"
            label={STRINGS.new_password}
            value={formState.newPassword}
            onChange={(v) => setValue({ newPassword: v })}
            errorText={formErrors.newPassword?.[0]?.message}
            disabled={isLoading}
          />
          <FormTextFieldInput
            required
            type="password"
            label={STRINGS.confirm_password}
            value={formState.confirmPassword}
            onChange={(v) => setValue({ confirmPassword: v })}
            errorText={formErrors.confirmPassword?.[0]?.message}
            disabled={isLoading}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => closeModal()} disabled={isLoading} variant="outlined">
          {STRINGS.cancel}
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={isLoading}
          endIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          {STRINGS.save}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangePasswordModal;

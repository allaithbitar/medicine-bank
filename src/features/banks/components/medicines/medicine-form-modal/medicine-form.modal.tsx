import { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Chip,
  type SelectChangeEvent,
} from "@mui/material";
import { z } from "zod";
import {
  ALLOWED_FORMS,
  DOSE_OPTIONS,
  type TAddMedicinePayload,
  type TFormValue,
  type TMedicine,
  type TUpdateMedicinePayload,
} from "@/features/banks/types/medicines.types";
import { useModal } from "@/core/components/common/modal/modal-provider.component";
import medicinesApi from "@/features/banks/api/medicines-api/medicines-api";
import {
  notifyError,
  notifySuccess,
} from "@/core/components/common/toast/toast";
import STRINGS from "@/core/constants/strings.constant";
import ModalWrapper from "@/core/components/common/modal/modal-wrapper.component";
import useReducerState from "@/core/hooks/use-reducer.hook";

const MedicineSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).max(200),
  form: z.enum(ALLOWED_FORMS, {
    errorMap: () => ({ message: "Form is required" }),
  }),
  doseVariants: z.array(z.number()).min(1, {
    message: "At least one dose must be selected",
  }),
});

type TFormValues = z.infer<typeof MedicineSchema>;

const MedicineFormModal = ({ oldMedicine }: { oldMedicine?: TMedicine }) => {
  const { closeModal } = useModal();

  const [addMedicine, { isLoading: isAdding }] =
    medicinesApi.useAddMedicineMutation();
  const [updateMedicine, { isLoading: isUpdating }] =
    medicinesApi.useUpdateMedicineMutation();

  const [values, setValues] = useReducerState<TFormValues>({
    name: oldMedicine?.name ?? "",
    form: (oldMedicine?.form as TFormValue) ?? "pill",
    doseVariants: oldMedicine?.doseVariants ?? ([] as any),
  });

  const [errors, setErrors] = useState<z.ZodIssue[]>([]);

  const getErrorForField = (field: keyof TFormValues) => {
    const err = errors.find((e) => e.path[0] === field);
    return err ? err.message : "";
  };

  const handleNameChange = (v: string) => {
    setValues({ name: v });
    setErrors((prev) => prev.filter((e) => e.path[0] !== "name"));
  };

  const handleFormChange = (e: SelectChangeEvent<string>) => {
    const v = e.target.value as TFormValue;
    setValues((prev) => ({ ...prev, form: v }));
    setErrors((prev) => prev.filter((e) => e.path[0] !== "form"));
  };

  const handleDoseToggle = (dose: number) => {
    const exists = values.doseVariants.includes(dose);
    setValues({
      doseVariants: exists
        ? values.doseVariants.filter((d) => d !== dose)
        : [...values.doseVariants, dose].sort((a, b) => a - b),
    });
    setErrors((prev) => prev.filter((e) => e.path[0] !== "doseVariants"));
  };

  const handleSubmit = async () => {
    try {
      const parsed = MedicineSchema.parse(values);

      if (oldMedicine) {
        const payload: TUpdateMedicinePayload = {
          id: oldMedicine.id,
          name: parsed.name,
          form: parsed.form,
          doseVariants: parsed.doseVariants,
        };
        await updateMedicine(payload).unwrap();
      } else {
        const payload: TAddMedicinePayload = {
          name: parsed.name,
          form: parsed.form,
          doseVariants: parsed.doseVariants,
        };
        await addMedicine(payload).unwrap();
      }

      notifySuccess(
        oldMedicine ? STRINGS.edited_successfully : STRINGS.added_successfully
      );
      closeModal();
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setErrors(err.errors);
        return;
      }
      notifyError(err);
    }
  };

  const isLoading = isAdding || isUpdating;

  return (
    <ModalWrapper
      isLoading={isLoading}
      title={oldMedicine ? STRINGS.edit_medicine : STRINGS.add_medicine}
      actionButtons={
        <Stack flexDirection="row" gap={1}>
          <Button
            variant="outlined"
            onClick={() => closeModal()}
            color="error"
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            {STRINGS.cancel}
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            {oldMedicine ? STRINGS.edit : STRINGS.add}
          </Button>
        </Stack>
      }
    >
      <Stack gap={2}>
        <TextField
          fullWidth
          label={STRINGS.name}
          value={values.name}
          onChange={(e) => handleNameChange(e.target.value)}
          error={!!getErrorForField("name")}
          helperText={getErrorForField("name")}
        />

        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {STRINGS.med_form}
          </Typography>

          <Select
            fullWidth
            value={values.form}
            onChange={handleFormChange}
            displayEmpty
            sx={{ minWidth: 160 }}
          >
            {ALLOWED_FORMS.map((f) => (
              <MenuItem key={f} value={f}>
                <Typography sx={{ textTransform: "capitalize" }}>
                  {f}
                </Typography>
              </MenuItem>
            ))}
          </Select>
          <Typography color="error" variant="caption">
            {getErrorForField("form")}
          </Typography>
        </Box>

        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {STRINGS.dose_variants}
          </Typography>

          <Stack direction="row" gap={1} flexWrap="wrap">
            {DOSE_OPTIONS.map((d) => {
              const selected = values.doseVariants.includes(d);
              return (
                <Chip
                  key={d}
                  label={`${d} mg`}
                  color={selected ? "primary" : "default"}
                  onClick={() => handleDoseToggle(d)}
                  clickable
                  sx={{
                    cursor: "pointer",
                  }}
                />
              );
            })}
          </Stack>

          <Typography
            color="error"
            variant="caption"
            sx={{ display: "block", mt: 1 }}
          >
            {getErrorForField("doseVariants")}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 1 }}
          >
            {STRINGS.select_one_or_more_doses}
          </Typography>
        </Box>
      </Stack>
    </ModalWrapper>
  );
};

export default MedicineFormModal;

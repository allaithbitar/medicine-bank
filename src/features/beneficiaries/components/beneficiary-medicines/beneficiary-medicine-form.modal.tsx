import React, { useEffect } from "react";
import { Box, Button, Stack, TextField, Typography, Chip } from "@mui/material";
import { z } from "zod";
import { useModal } from "@/core/components/common/modal/modal-provider.component";
import ModalWrapper from "@/core/components/common/modal/modal-wrapper.component";
import {
  notifyError,
  notifySuccess,
} from "@/core/components/common/toast/toast";
import STRINGS from "@/core/constants/strings.constant";
import useReducerState from "@/core/hooks/use-reducer.hook";
import type {
  TAddBeneficiaryMedicinePayload,
  TBeneficiaryMedicine,
  TUpdateBeneficiaryMedicinePayload,
} from "../../types/beneficiary.types";
import {
  DOSE_OPTIONS,
  type TMedicine,
} from "@/features/banks/types/medicines.types";
import beneficiaryApi from "../../api/beneficiary.api";
import MedicinesAutocomplete from "@/features/banks/components/medicines/medicines-autocomplete/medicines-autocomplete.component";

const BeneficiaryMedicineSchema = z.object({
  patientId: z.string().min(1, { message: "Patient is required" }),
  medicineId: z.string().min(1, { message: "Medicine is required" }),
  dosePerIntake: z.number().gt(0, { message: "Dose is required" }),
  intakeFrequency: z
    .number({ invalid_type_error: "Intake frequency must be a number" })
    .min(0, { message: "Intake frequency must be >= 0" }),
  note: z.string().optional().nullable(),
});

type TFormValues = z.infer<typeof BeneficiaryMedicineSchema>;

const BeneficiaryMedicineFormModal = ({
  oldBeneficiaryMedicine,
  patientId: propPatientId,
}: {
  oldBeneficiaryMedicine?: TBeneficiaryMedicine;
  patientId?: string;
}) => {
  const { closeModal } = useModal();

  const [addPatientMedicine, { isLoading: isAdding }] =
    beneficiaryApi.useAddBeneficiaryMedicineMutation();
  const [updatePatientMedicine, { isLoading: isUpdating }] =
    beneficiaryApi.useUpdateBeneficiaryMedicineMutation();

  const [values, setValues] = useReducerState<
    TFormValues & { med: TMedicine | null }
  >({
    patientId: oldBeneficiaryMedicine?.patientId ?? propPatientId ?? "",
    medicineId: oldBeneficiaryMedicine?.medicineId ?? "",
    dosePerIntake: oldBeneficiaryMedicine?.dosePerIntake ?? 500,
    intakeFrequency: oldBeneficiaryMedicine?.intakeFrequency
      ? Number(oldBeneficiaryMedicine.intakeFrequency)
      : 1,
    note: oldBeneficiaryMedicine?.note ?? "",
    med: null,
  });

  const [errors, setErrors] = React.useState<z.ZodIssue[]>([]);

  useEffect(() => {
    if (oldBeneficiaryMedicine?.medicine?.doseVariants) {
      const dv = oldBeneficiaryMedicine.medicine.doseVariants;
      if (!dv.includes(oldBeneficiaryMedicine.dosePerIntake)) {
        setValues({ dosePerIntake: dv[0] ?? 0 });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getErrorForField = (field: keyof TFormValues) => {
    const err = errors.find((e) => e.path[0] === field);
    return err ? err.message : "";
  };

  const handleMedicineChange = (medicine: TMedicine | null) => {
    const medId = medicine?.id ?? "";
    setValues({ medicineId: medId, med: medicine });
    setErrors((prev) => prev.filter((er) => er.path[0] !== "medicineId"));

    if (medicine?.doseVariants?.length) {
      const curDose = values.dosePerIntake;
      if (!medicine.doseVariants.includes(curDose)) {
        setValues({ dosePerIntake: medicine.doseVariants[0] });
      }
    } else {
      setValues({ dosePerIntake: 0 });
    }
  };

  const handleDoseSelect = (dose: number) => {
    setValues({ dosePerIntake: dose });
    setErrors((prev) => prev.filter((er) => er.path[0] !== "dosePerIntake"));
  };

  const handleFrequencyChange = (v: string) => {
    const num = isNaN(Number(v)) ? 0 : Number(v);
    setValues({ intakeFrequency: num });
    setErrors((prev) => prev.filter((er) => er.path[0] !== "intakeFrequency"));
  };

  const handleNoteChange = (v: string) => setValues({ note: v });

  const handleSubmit = async () => {
    try {
      const toValidate = {
        ...values,
        intakeFrequency: Number(values.intakeFrequency),
      };
      const parsed = BeneficiaryMedicineSchema.parse(toValidate);

      if (oldBeneficiaryMedicine) {
        const payload: TUpdateBeneficiaryMedicinePayload = {
          id: oldBeneficiaryMedicine.id,
          patientId: parsed.patientId,
          medicineId: parsed.medicineId,
          dosePerIntake: parsed.dosePerIntake,
          intakeFrequency: String(parsed.intakeFrequency),
          note: parsed.note ?? "",
        };
        await updatePatientMedicine(payload).unwrap();
      } else {
        const payload: TAddBeneficiaryMedicinePayload = {
          patientId: parsed.patientId,
          medicineId: parsed.medicineId,
          dosePerIntake: parsed.dosePerIntake,
          intakeFrequency: String(parsed.intakeFrequency),
          note: parsed.note ?? "",
        };
        await addPatientMedicine(payload).unwrap();
      }
      notifySuccess(
        oldBeneficiaryMedicine
          ? STRINGS.edited_successfully
          : STRINGS.added_successfully
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
  const doseVariantsForSelected = DOSE_OPTIONS;

  return (
    <ModalWrapper
      isLoading={isLoading}
      title={
        oldBeneficiaryMedicine
          ? STRINGS.edit_beneficiary_medicine
          : STRINGS.add_beneficiary_medicine
      }
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
            {oldBeneficiaryMedicine ? STRINGS.edit : STRINGS.add}
          </Button>
        </Stack>
      }
    >
      <Stack gap={2}>
        <Stack sx={{ flexDirection: "row", gap: 1, alignItems: "end" }}>
          <MedicinesAutocomplete
            defaultValueId={oldBeneficiaryMedicine?.medicineId}
            value={values.med}
            onChange={(m) => handleMedicineChange(m)}
            errorText={getErrorForField("medicineId")}
          />
          <TextField
            fullWidth
            label={STRINGS.intake_frequency_per_day}
            value={values.intakeFrequency as unknown as string}
            onChange={(e) => handleFrequencyChange(e.target.value)}
            error={!!getErrorForField("intakeFrequency")}
            helperText={getErrorForField("intakeFrequency")}
            slotProps={{
              htmlInput: { inputMode: "numeric", pattern: "[0-9]*", min: 0 },
            }}
          />
        </Stack>
        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {STRINGS.dose_per_intake}
          </Typography>

          <Stack direction="row" gap={1} flexWrap="wrap">
            {doseVariantsForSelected.map((d) => {
              const selected = values.dosePerIntake === d;
              return (
                <Chip
                  key={d}
                  label={`${d} mg`}
                  color={selected ? "primary" : "default"}
                  onClick={() => handleDoseSelect(d)}
                  clickable
                />
              );
            })}
          </Stack>
          <Typography
            color="error"
            variant="caption"
            sx={{ display: "block", mt: 1 }}
          >
            {getErrorForField("dosePerIntake")}
          </Typography>
        </Box>

        <TextField
          fullWidth
          label={STRINGS.note}
          value={values.note ?? ""}
          onChange={(e) => handleNoteChange(e.target.value)}
          multiline
          minRows={2}
        />
      </Stack>
    </ModalWrapper>
  );
};

export default BeneficiaryMedicineFormModal;

import React, { useEffect, useMemo } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { z } from "zod";
import { useModal } from "@/core/components/common/modal/modal-provider.component";
import ModalWrapper from "@/core/components/common/modal/modal-wrapper.component";
import {
  notifyError,
  notifySuccess,
} from "@/core/components/common/toast/toast";
import STRINGS from "@/core/constants/strings.constant";
import useReducerState from "@/core/hooks/use-reducer.hook";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import type {
  TAddFamilyMemberPayload,
  TFamilyMember,
  TGender,
  TKinship,
  TUpdateFamilyMemberPayload,
} from "../../types/beneficiary.types";
import beneficiaryApi from "../../api/beneficiary.api";
import { formatDateToISO } from "@/core/helpers/helpers";
import { MobileDatePicker } from "@mui/x-date-pickers";

const FamilyMemberSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).max(200),
  birthDate: z.string().min(1, { message: "Birth date is required" }),
  gender: z.enum(["male", "female"], {
    errorMap: () => ({ message: "Gender is required" }),
  }),
  kinshep: z.enum(
    ["partner", "child", "parent", "brother", "grandparent", "grandchild"],
    { errorMap: () => ({ message: "Kinshep is required" }) }
  ),
  jobOrSchool: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
  patientId: z.string().min(1, { message: "Patient is required" }),
});

type TFormValues = z.infer<typeof FamilyMemberSchema> & {
  _birthDate?: Date | null;
};

const GENDERS: TGender[] = ["male", "female"];
const KINSHEP: TKinship[] = [
  "partner",
  "child",
  "parent",
  "brother",
  "grandparent",
  "grandchild",
];

const BeneficiaryFamilyMemberFormModal = ({
  oldFamilyMember,
  patientId: propPatientId,
}: {
  oldFamilyMember?: TFamilyMember;
  patientId?: string;
}) => {
  const { closeModal } = useModal();

  const [addFamilyMember, { isLoading: isAdding }] =
    beneficiaryApi.useAddFamilyMemberMutation();
  const [updateFamilyMember, { isLoading: isUpdating }] =
    beneficiaryApi.useUpdateFamilyMemberMutation();

  const initBirthDate = useMemo(() => {
    if (!oldFamilyMember?.birthDate) return null;
    const d = new Date(oldFamilyMember.birthDate);
    if (isNaN(d.getTime())) return null;
    return d;
  }, [oldFamilyMember]);

  const [values, setValues] = useReducerState<TFormValues>({
    name: oldFamilyMember?.name ?? "",
    _birthDate: initBirthDate,
    birthDate: oldFamilyMember?.birthDate ?? "",
    gender: (oldFamilyMember?.gender as TGender) ?? "male",
    kinshep: (oldFamilyMember?.kinshep as TKinship) ?? "partner",
    jobOrSchool: oldFamilyMember?.jobOrSchool ?? "",
    note: oldFamilyMember?.note ?? "",
    patientId: oldFamilyMember?.patientId ?? propPatientId ?? "",
  });

  const [errors, setErrors] = React.useState<z.ZodIssue[]>([]);

  useEffect(() => {
    if (!values._birthDate && oldFamilyMember?.birthDate) {
      const d = new Date(oldFamilyMember.birthDate);
      if (!isNaN(d.getTime())) {
        setValues({ _birthDate: d });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getErrorForField = (field: keyof TFormValues) => {
    const err = errors.find((e) => e.path[0] === field);
    return err ? err.message : "";
  };

  const handleSubmit = async () => {
    try {
      const birthDateStr = formatDateToISO(values._birthDate);
      const toValidate = { ...values, birthDate: birthDateStr };

      const parsed = FamilyMemberSchema.parse(toValidate);

      if (oldFamilyMember) {
        const payload: TUpdateFamilyMemberPayload = {
          id: oldFamilyMember.id,
          ...parsed,
        };
        await updateFamilyMember(payload).unwrap();
      } else {
        const payload: TAddFamilyMemberPayload = {
          ...parsed,
        };
        await addFamilyMember(payload).unwrap();
      }

      notifySuccess(
        oldFamilyMember
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

  return (
    <ModalWrapper
      isLoading={isLoading}
      title={
        oldFamilyMember ? STRINGS.edit_family_member : STRINGS.add_family_member
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
            {oldFamilyMember ? STRINGS.edit : STRINGS.add}
          </Button>
        </Stack>
      }
    >
      <Stack gap={2}>
        <TextField
          fullWidth
          label={STRINGS.name}
          value={values.name}
          onChange={(e) => {
            setValues({ name: e.target.value });
            setErrors((p) => p.filter((er) => er.path[0] !== "name"));
          }}
          error={!!getErrorForField("name")}
          helperText={getErrorForField("name")}
        />

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <MobileDatePicker
            label={STRINGS.birth_date}
            value={values._birthDate ?? null}
            onChange={(newDate) => {
              setValues({ _birthDate: newDate ?? null });
              setErrors((p) => p.filter((er) => er.path[0] !== "birthDate"));
            }}
            // renderInput={(params) => (
            //   <TextField
            //     {...params}
            //     fullWidth
            //     error={!!getErrorForField("birthDate")}
            //     helperText={getErrorForField("birthDate")}
            //   />
            // )}
          />
        </LocalizationProvider>
        <Stack sx={{ flexDirection: "row", gap: 2 }}>
          <Box sx={{ width: "100%" }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {STRINGS.gender}
            </Typography>
            <Select
              fullWidth
              value={values.gender}
              onChange={(e) => {
                setValues({ gender: e.target.value as TGender });
                setErrors((p) => p.filter((er) => er.path[0] !== "gender"));
              }}
            >
              {GENDERS.map((g) => (
                <MenuItem key={g} value={g}>
                  {g === "male" ? STRINGS.male : STRINGS.female}
                </MenuItem>
              ))}
            </Select>
            <Typography color="error" variant="caption">
              {getErrorForField("gender")}
            </Typography>
          </Box>

          <Box sx={{ width: "100%" }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {STRINGS.kinship}
            </Typography>
            <Select
              fullWidth
              value={values.kinshep}
              onChange={(e) => {
                setValues({ kinshep: e.target.value as TKinship });
                setErrors((p) => p.filter((er) => er.path[0] !== "kinshep"));
              }}
            >
              {KINSHEP.map((k) => {
                const labelKey = `kinship_${k}` as keyof typeof STRINGS;
                const label = STRINGS[labelKey] ?? k;
                return (
                  <MenuItem key={k} value={k}>
                    {label}
                  </MenuItem>
                );
              })}
            </Select>
            <Typography color="error" variant="caption">
              {getErrorForField("kinshep")}
            </Typography>
          </Box>
        </Stack>

        <TextField
          fullWidth
          label={STRINGS.job_or_school}
          value={values.jobOrSchool ?? ""}
          onChange={(e) => setValues({ jobOrSchool: e.target.value })}
        />

        <TextField
          fullWidth
          label={STRINGS.note}
          value={values.note ?? ""}
          onChange={(e) => setValues({ note: e.target.value })}
          multiline
          minRows={2}
        />
      </Stack>
    </ModalWrapper>
  );
};

export default BeneficiaryFamilyMemberFormModal;

import React, { useEffect, useMemo } from "react";
import {
  Box,
  Card,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { z } from "zod";
import {
  notifyError,
  notifySuccess,
} from "@/core/components/common/toast/toast";
import STRINGS from "@/core/constants/strings.constant";
import useReducerState from "@/core/hooks/use-reducer.hook";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import { formatDateToISO, getStringsLabel } from "@/core/helpers/helpers";
import { MobileDatePicker } from "@mui/x-date-pickers";
import type {
  TAddFamilyMemberPayload,
  TGender,
  TKinship,
  TUpdateFamilyMemberPayload,
} from "../types/beneficiary.types";
import beneficiaryApi from "../api/beneficiary.api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ActionFab from "@/core/components/common/action-fab/acion-fab.component";
import { Save } from "@mui/icons-material";
import LoadingOverlay from "@/core/components/common/loading-overlay/loading-overlay";

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

const BeneficiaryFamilyActionPage = () => {
  const navigate = useNavigate();
  const { state: old } = useLocation();
  const oldFamilyMember = old?.oldMember;
  const { id: patientId } = useParams();

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
    patientId: oldFamilyMember?.patientId ?? patientId ?? "",
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
      navigate(-1);
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
    <Card>
      <Typography sx={{ pb: 2 }}>
        {oldFamilyMember
          ? STRINGS.edit_family_member
          : STRINGS.add_family_member}
      </Typography>
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
                  {STRINGS[g]}
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
                return (
                  <MenuItem key={k} value={k}>
                    {getStringsLabel({ key: "kinship", val: k })}
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
      <ActionFab
        icon={<Save />}
        color="success"
        onClick={handleSubmit}
        disabled={isLoading}
      />
      {isLoading && <LoadingOverlay />}
    </Card>
  );
};

export default BeneficiaryFamilyActionPage;

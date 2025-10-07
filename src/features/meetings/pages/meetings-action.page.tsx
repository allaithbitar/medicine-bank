import { useState } from "react";
import { Card, Stack, TextField, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { Save } from "@mui/icons-material";
import z from "zod";
import {
  notifyError,
  notifySuccess,
} from "@/core/components/common/toast/toast";
import ActionFab from "@/core/components/common/action-fab/acion-fab.component";
import LoadingOverlay from "@/core/components/common/loading-overlay/loading-overlay";
import useReducerState from "@/core/hooks/use-reducer.hook";
import STRINGS from "@/core/constants/strings.constant";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import type { TMeeting } from "../types/meetings.types";
import meetingsApi from "../api/meetings.api";
import FormDateTimeInput from "@/core/components/common/inputs/form-date-time-input.componenet";

const MeetingSchema = z.object({
  note: z.string().min(1, { message: "note is required" }),
  date: z.string().min(1, { message: "date is required" }),
  createdAt: z.string().optional().nullable(),
});

const UpdateMeetingSchema = MeetingSchema.extend({ id: z.string().min(1) });

type TFormValues = z.infer<typeof MeetingSchema>;

const MeetingActionPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const oldMeeting: TMeeting | undefined = state?.oldMeeting;

  const [addMeeting, { isLoading: isAdding }] =
    meetingsApi.useAddMeetingMutation();
  const [updateMeeting, { isLoading: isUpdating }] =
    meetingsApi.useUpdateMeetingMutation();

  const initialValues: TFormValues = {
    note: oldMeeting?.note ?? "",
    date: oldMeeting?.date ?? "",
    createdAt: oldMeeting?.createdAt ?? "",
  };

  const [values, setValues] = useReducerState(initialValues);
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);

  const getErrorForField = (field: keyof TFormValues) => {
    const err = errors.find((e) => e.path[0] === field);
    return err ? err.message : "";
  };

  const handleSave = async () => {
    try {
      const toValidate = {
        note: values.note,
        date: values.date,
        // createdAt: dateStr,
      };

      if (oldMeeting) {
        const payload = { id: oldMeeting.id, ...toValidate };
        UpdateMeetingSchema.parse(payload);
        await updateMeeting(payload).unwrap();
      } else {
        MeetingSchema.parse(toValidate);
        const payload = { ...toValidate };
        await addMeeting(payload).unwrap();
      }

      notifySuccess(
        oldMeeting ? STRINGS.edited_successfully : STRINGS.added_successfully
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
    <Card sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ pb: 2 }}>
        {oldMeeting ? STRINGS.edit_meeting : STRINGS.add_meeting}
      </Typography>

      <Stack gap={2}>
        <TextField
          fullWidth
          label={STRINGS.note}
          value={values.note}
          onChange={(e) => {
            setValues({ note: e.target.value });
            setErrors((p) => p.filter((er) => er.path[0] !== "note"));
          }}
          error={!!getErrorForField("note")}
          helperText={getErrorForField("note")}
        />

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <FormDateTimeInput
            label={STRINGS.date}
            value={values.date}
            onChange={(newDate) => {
              setValues({ date: newDate });
              setErrors((p) => p.filter((er) => er.path[0] !== "date"));
            }}
          />
          {!!getErrorForField("date") && (
            <Typography variant="caption" color="error">
              {getErrorForField("date")}
            </Typography>
          )}
        </LocalizationProvider>
      </Stack>

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

export default MeetingActionPage;

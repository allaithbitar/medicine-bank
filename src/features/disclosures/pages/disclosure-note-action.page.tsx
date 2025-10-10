import { useLocation, useNavigate, useParams } from "react-router-dom";
import ActionFab from "@/core/components/common/action-fab/acion-fab.component";
import { Save } from "@mui/icons-material";
import { Card, TextField, Typography } from "@mui/material";
import {
  notifyError,
  notifySuccess,
} from "@/core/components/common/toast/toast";
import STRINGS from "@/core/constants/strings.constant";
import LoadingOverlay from "@/core/components/common/loading-overlay/loading-overlay";
import disclosuresApi from "../api/disclosures.api";
import type { TDisclosureNote } from "../types/disclosure.types";
import useReducerState from "@/core/hooks/use-reducer.hook";
import { useState } from "react";
import z from "zod";

const NoteSchema = z.object({
  note: z
    .string()
    .min(10, { message: "note is required to be at least 10 characters" }),
});

type TFormValues = z.infer<typeof NoteSchema>;

const DisclosureNoteActionPage = () => {
  const { disclosureId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const oldNote = state?.oldNote as TDisclosureNote;

  const [val, setVal] = useReducerState<TFormValues>({
    note: oldNote?.note ?? "",
  });
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);

  const [addDisclosureNote, { isLoading: isAddingDisclosureNote }] =
    disclosuresApi.useAddDisclosureNoteMutation();

  const [updateDisclosureNote, { isLoading: isUpdateDisclosureAppointment }] =
    disclosuresApi.useUpdateDisclosureNoteMutation();

  const getErrorForField = (fieldName: keyof TDisclosureNote) => {
    const error = errors.find((err) => err.path[0] === fieldName);
    return error ? error.message : "";
  };

  const handleFieldChange = (field: keyof TDisclosureNote, value: string) => {
    setVal({ [field]: value });
    setErrors((prevErrors) =>
      prevErrors.filter((error) => error.path[0] !== field)
    );
  };

  const handleSave = async () => {
    if (!disclosureId) return;
    const payload = {
      note: val.note,
      disclosureId,
    };
    try {
      NoteSchema.parse(val);

      if (oldNote) {
        const updatePayload = { ...payload, id: oldNote.id };
        await updateDisclosureNote(updatePayload).unwrap();
        notifySuccess(STRINGS.added_successfully);
      } else {
        await addDisclosureNote(payload).unwrap();
        notifySuccess(STRINGS.edited_successfully);
      }
      navigate(-1);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setErrors(err.errors);
        return;
      }
      notifyError(err);
    }
  };
  const isLoading = isAddingDisclosureNote || isUpdateDisclosureAppointment;
  return (
    <Card>
      <Typography sx={{ pb: 2 }}>
        {oldNote ? STRINGS.edit_note : STRINGS.add_note}
      </Typography>
      <TextField
        fullWidth
        label={STRINGS.note}
        value={val.note}
        onChange={(e) => handleFieldChange("note", e.target.value)}
        error={!!getErrorForField("note")}
        helperText={getErrorForField("note")}
      />
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

export default DisclosureNoteActionPage;

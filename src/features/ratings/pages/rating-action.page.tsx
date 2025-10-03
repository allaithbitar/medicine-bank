import STRINGS from "@/core/constants/strings.constant";
import { Stack, TextField, Card, Typography } from "@mui/material";
import useReducerState from "@/core/hooks/use-reducer.hook";
import z from "zod";
import { useState } from "react";
import {
  notifyError,
  notifySuccess,
} from "@/core/components/common/toast/toast";
import ratingsApi from "../api/ratings.api";
import { RatingSchema, UpdateRatingSchema } from "../schemas/rating.schema";
import { useLocation, useNavigate } from "react-router-dom";
import ActionFab from "@/core/components/common/action-fab/acion-fab.component";
import { Save } from "@mui/icons-material";
import LoadingOverlay from "@/core/components/common/loading-overlay/loading-overlay";

interface IRatingsData {
  name: string;
  code: string;
  description: string;
}
const RatingActionPage = () => {
  const navigate = useNavigate();

  const { state: old } = useLocation();
  const oldRating = old?.oldRating;

  const initialRatingsData: IRatingsData = {
    code: oldRating?.code || "",
    name: oldRating?.name || "",
    description: oldRating?.description || "",
  };
  const [state, setState] = useReducerState(initialRatingsData);
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);

  const [addRating, { isLoading: isAddingRating }] =
    ratingsApi.useAddRatingMutation();
  const [updateRating, { isLoading: isUpdatingRating }] =
    ratingsApi.useUpdateRatingMutation();

  const getErrorForField = (fieldName: keyof IRatingsData) => {
    const error = errors.find((err) => err.path[0] === fieldName);
    return error ? error.message : "";
  };

  const handleFieldChange = (field: keyof IRatingsData, value: string) => {
    setState({ [field]: value });
    setErrors((prevErrors) =>
      prevErrors.filter((error) => error.path[0] !== field)
    );
  };

  const handleSave = async () => {
    const addPayload = {
      name: state.name,
      code: state.code,
      description: state.description,
    };
    try {
      if (oldRating) {
        const editPayload = { ...addPayload, id: oldRating.id };
        UpdateRatingSchema.parse(editPayload);
        await updateRating(editPayload).unwrap();
      } else {
        RatingSchema.parse(addPayload);
        await addRating(addPayload).unwrap();
      }
      navigate(-1);
      notifySuccess();
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setErrors(err.errors);
      } else {
        notifyError(err);
      }
    }
  };

  const isLoading = isAddingRating || isUpdatingRating;
  return (
    <Card>
      <Typography sx={{ pb: 2 }}>
        {oldRating ? STRINGS.edit_rating : STRINGS.add_rating}
      </Typography>
      <Stack sx={{ flexDirection: "column", gap: 1 }}>
        <TextField
          fullWidth
          label={STRINGS.name}
          value={state.name}
          onChange={(e) => handleFieldChange("name", e.target.value)}
          error={!!getErrorForField("name")}
          helperText={getErrorForField("name")}
          disabled={false}
        />
        <TextField
          fullWidth
          label={STRINGS.description}
          value={state.description}
          onChange={(e) => handleFieldChange("description", e.target.value)}
          error={!!getErrorForField("description")}
          helperText={getErrorForField("description")}
          disabled={false}
        />
        <TextField
          fullWidth
          label={STRINGS.code}
          value={state.code}
          onChange={(e) => handleFieldChange("code", e.target.value)}
          error={!!getErrorForField("code")}
          helperText={getErrorForField("code")}
          disabled={false}
        />
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

export default RatingActionPage;

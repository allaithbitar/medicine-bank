import STRINGS from "@/core/constants/strings.constant";
import { Stack, TextField, Button } from "@mui/material";
import useReducerState from "@/core/hooks/use-reducer.hook";
import z from "zod";
import { useState } from "react";
import type { TRating } from "../types/rating.types";
import {
  notifyError,
  notifySuccess,
} from "@/core/components/common/toast/toast";
import ratingsApi from "../api/ratings.api";
import ModalWrapper from "@/core/components/common/modal/modal-wrapper.component";
import { useModal } from "@/core/components/common/modal/modal-provider.component";
import { RatingSchema, UpdateRatingSchema } from "../schemas/rating.schema";

interface IManageRatingsAccordionProps {
  oldRating?: TRating;
}

interface IRatingsData {
  name: string;
  code: string;
  description: string;
}
const RatingFormModal = ({ oldRating }: IManageRatingsAccordionProps) => {
  const initialRatingsData: IRatingsData = {
    code: oldRating?.code || "",
    name: oldRating?.name || "",
    description: oldRating?.description || "",
  };
  const { closeModal } = useModal();
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
      closeModal();
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
    <ModalWrapper
      isLoading={isLoading}
      title={oldRating ? STRINGS.edit_rating : STRINGS.add_rating}
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
            onClick={handleSave}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            {oldRating ? STRINGS.edit : STRINGS.add}
          </Button>
        </Stack>
      }
    >
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
    </ModalWrapper>
  );
};

export default RatingFormModal;

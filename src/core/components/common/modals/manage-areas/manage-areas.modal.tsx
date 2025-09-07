import { useState } from "react";
import { TextField, Stack, Button } from "@mui/material";
import {
  notifyError,
  notifySuccess,
} from "@/core/components/common/toast/toast";
import ModalWrapper from "@/core/components/common/modal/modal-wrapper.component";
import { useModal } from "@/core/components/common/modal/modal-provider.component";
import { z } from "zod";
import workAreasApi from "@/features/banks/api/work-areas/work-areas.api";
import {
  UpdateWorkAreaSchema,
  WorkAreaSchema,
} from "@/features/banks/schemas/work-area.schema";
import STRINGS from "@/core/constants/strings.constant";
import CitiesAutocomplete from "@/features/banks/components/cities/cities-autocomplete/cities-autocomplete.component";
import useReducerState from "@/core/hooks/use-reducer.hook";
import type { IOptions } from "@/core/types/common.types";
import type { TArea } from "@/features/banks/types/work-areas.types";

interface IWorkAreaFormModalProps {
  oldWorkAreaData?: TArea;
}

interface IAreaData {
  selectedCity: IOptions | null;
  workAreaName: string;
}

const WorkAreaFormModal = ({ oldWorkAreaData }: IWorkAreaFormModalProps) => {
  const initialAreaData: IAreaData = {
    selectedCity: null,
    workAreaName: oldWorkAreaData?.name || "",
  };
  const { closeModal } = useModal();
  const [state, setState] = useReducerState<IAreaData>(initialAreaData);
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);

  const [updateWorkArea, { isLoading: isUpdatingWorkArea }] =
    workAreasApi.useUpdateWorkAreaMutation();
  const [addWorkArea, { isLoading: isAddingWorkArea }] =
    workAreasApi.useAddWorkAreaMutation();

  const handleWorkAreaNameChange = (value: string) => {
    setState({ workAreaName: value });
    setErrors((prevErrors) =>
      prevErrors.filter((error) => error.path[0] !== "name")
    );
  };

  const getErrorForField = (fieldName: keyof IAreaData) => {
    const error = errors.find((err) => err.path[0] === fieldName);
    return error ? error.message : "";
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        name: state.workAreaName,
        cityId: state.selectedCity?.id,
      };
      if (oldWorkAreaData) {
        const validatedPayload = UpdateWorkAreaSchema.parse({
          ...payload,
          id: oldWorkAreaData.id,
        });
        await updateWorkArea(validatedPayload).unwrap();
      } else {
        const validatedPayload = WorkAreaSchema.parse(payload);
        await addWorkArea(validatedPayload).unwrap();
      }
      notifySuccess(
        oldWorkAreaData
          ? STRINGS.edited_successfully
          : STRINGS.added_successfully
      );
      closeModal();
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setErrors(err.errors);
        notifyError();
      } else {
        notifyError(err);
      }
    }
  };

  const isLoading = isUpdatingWorkArea || isAddingWorkArea;

  return (
    <ModalWrapper
      isLoading={isLoading}
      title={oldWorkAreaData ? STRINGS.edit_work_area : STRINGS.add_work_area}
      actionButtons={
        <Stack direction="row" gap={1}>
          <Button
            onClick={() => closeModal()}
            color="error"
            sx={{ flexGrow: 1 }}
          >
            {STRINGS.cancel}
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isLoading}
            sx={{ flexGrow: 1 }}
          >
            {oldWorkAreaData ? STRINGS.edit : STRINGS.add}
          </Button>
        </Stack>
      }
    >
      <Stack gap={3}>
        <CitiesAutocomplete
          disabled
          defaultValueId={oldWorkAreaData?.cityId}
          value={state.selectedCity}
          onChange={(v) => setState({ selectedCity: v })}
          errorText={getErrorForField("selectedCity")}
          helperText={getErrorForField("selectedCity")}
        />
        <TextField
          fullWidth
          label={STRINGS.work_area_name}
          value={state.workAreaName}
          onChange={(e) => handleWorkAreaNameChange(e.target.value)}
          error={!!getErrorForField("workAreaName")}
          helperText={getErrorForField("workAreaName")}
          disabled={isLoading}
        />
      </Stack>
    </ModalWrapper>
  );
};

export default WorkAreaFormModal;

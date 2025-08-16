import { useEffect, useState } from "react";
import { TextField, Stack, Button } from "@mui/material";
import {
  notifyError,
  notifySuccess,
} from "@/core/components/common/toast/toast";
import ModalWrapper from "@/core/components/common/modal/modal-wrapper.component";
import { useModal } from "@/core/components/common/modal/modal-provider.component";
import { z } from "zod";
import type { TArea } from "@/features/banks/types/work-areas.types";
import workAreasApi from "@/features/banks/api/work-areas/work-areas.api";
import {
  UpdateWorkAreaSchema,
  WorkAreaSchema,
} from "@/features/banks/schemas/work-area.schema";
import STRINGS from "@/core/constants/strings.constant";
import { getErrorMessage } from "@/core/helpers/helpers";

interface IWorkAreaFormModalProps {
  oldWorkArea?: TArea;
  defaultSelectedCity?: string;
}

const WorkAreaFormModal = ({
  oldWorkArea,
  defaultSelectedCity,
}: IWorkAreaFormModalProps) => {
  const { closeModal } = useModal();

  const [updateWorkArea, { isLoading: isUpdatingWorkArea }] =
    workAreasApi.useUpdateWorkAreaMutation();
  const [addWorkArea, { isLoading: isAddingWorkArea }] =
    workAreasApi.useAddWorkAreaMutation();

  const [workAreaName, setWorkAreaName] = useState<string>("");
  const [selectedCityId, setSelectedCityId] = useState<string>(
    defaultSelectedCity || ""
  );
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);

  useEffect(() => {
    if (oldWorkArea) {
      setWorkAreaName(oldWorkArea.name);
      setSelectedCityId(oldWorkArea.cityId);
    }
  }, [oldWorkArea]);

  const handleWorkAreaNameChange = (value: string) => {
    setWorkAreaName(value);
    setErrors((prevErrors) =>
      prevErrors.filter((error) => error.path[0] !== "name")
    );
  };

  // const handleCitySelectChange = (cityId: string) => {
  //   setSelectedCityId(cityId);
  //   setErrors((prevErrors) =>
  //     prevErrors.filter((error) => error.path[0] !== "cityId"),
  //   );
  // };

  const getErrorForField = (fieldName: string) => {
    const error = errors.find((err) => err.path[0] === fieldName);
    return error ? error.message : "";
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        name: workAreaName,
        cityId: selectedCityId,
      };
      if (oldWorkArea) {
        const validatedPayload = UpdateWorkAreaSchema.parse({
          ...payload,
          id: oldWorkArea.id,
        });
        await updateWorkArea(validatedPayload).unwrap();
      } else {
        const validatedPayload = WorkAreaSchema.parse(payload);
        await addWorkArea(validatedPayload).unwrap();
      }
      notifySuccess(
        oldWorkArea ? STRINGS.edited_successfully : STRINGS.added_successfully
      );
      closeModal();
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setErrors(err.errors);
        notifyError();
      } else {
        notifyError(getErrorMessage(err));
        console.error("error:", err);
      }
    }
  };

  const isLoading = isUpdatingWorkArea || isAddingWorkArea;

  return (
    <ModalWrapper
      isLoading={isLoading}
      title={oldWorkArea ? "Edit Work Area" : "Add Work Area"}
      actionButtons={
        <Stack direction="row" gap={1}>
          <Button
            onClick={() => closeModal()}
            color="error"
            sx={{ flexGrow: 1 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isLoading}
            sx={{ flexGrow: 1 }}
          >
            {oldWorkArea ? "Save Changes" : "Add Work Area"}
          </Button>
        </Stack>
      }
    >
      <Stack gap={3}>
        {/*  <CitiesAutocomplete
          value={selectedCityId}
          onChange={handleCitySelectChange}
          label="Select Parent City"
          error={!!getErrorForField("cityId")}
          helperText={getErrorForField("cityId")}
          disabled={isLoading}
        /> */}
        <TextField
          fullWidth
          label="Work Area Name"
          value={workAreaName}
          onChange={(e) => handleWorkAreaNameChange(e.target.value)}
          error={!!getErrorForField("name")}
          helperText={getErrorForField("name")}
          disabled={isLoading}
        />
      </Stack>
    </ModalWrapper>
  );
};

export default WorkAreaFormModal;

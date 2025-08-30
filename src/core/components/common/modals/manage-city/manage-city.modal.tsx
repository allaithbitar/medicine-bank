import { CitySchema } from "@/features/banks/schemas/city.schema";
import { TextField, Stack, Button } from "@mui/material";
import { useEffect, useState } from "react";
import z from "zod";
import ModalWrapper from "@/core/components/common/modal/modal-wrapper.component";
import { useModal } from "@/core/components/common/modal/modal-provider.component";
import type { TCity } from "@/features/banks/types/city.types";
import citiesApi from "@/features/banks/api/cities-api/cities.api";
import { notifyError, notifySuccess } from "../../toast/toast";
import STRINGS from "@/core/constants/strings.constant";

const CityFormModal = ({ oldCity }: { oldCity?: TCity }) => {
  const { closeModal } = useModal();
  const [updateCity, { isLoading: isUpdatingCity }] =
    citiesApi.useUpdateCityMutation({});
  const [addCity, { isLoading: isAddingCity }] = citiesApi.useAddCityMutation(
    {}
  );

  const [cityName, setCityName] = useState<string>("");
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);

  const handleCityNameChange = (value: string) => {
    setCityName(value);
    setErrors((prevErrors) =>
      prevErrors.filter((error) => error.path[0] !== "name")
    );
  };

  const getErrorForField = (fieldName: keyof TCity) => {
    const error = errors.find((err) => err.path[0] === fieldName);
    return error ? error.message : "";
  };

  const handleSubmit = async () => {
    try {
      CitySchema.parse({ name: cityName });
      if (oldCity) {
        await updateCity({ name: cityName, id: oldCity.id });
      } else {
        await addCity({ name: cityName });
      }
      notifySuccess();
      closeModal();
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setErrors(err.errors);
      } else {
        notifyError(err);
      }
    }
  };

  useEffect(() => {
    if (oldCity) {
      setCityName(oldCity.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ModalWrapper
      isLoading={isUpdatingCity || isAddingCity}
      title={oldCity ? STRINGS.edit_city : STRINGS.add_city}
      actionButtons={
        <Stack flexDirection="row" gap={1}>
          <Button
            variant="outlined"
            onClick={() => closeModal()}
            color="error"
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            {oldCity ? STRINGS.edit : STRINGS.add}
          </Button>
        </Stack>
      }
    >
      <TextField
        fullWidth
        label={STRINGS.city_name}
        value={cityName}
        onChange={(e) => handleCityNameChange(e.target.value)}
        error={!!getErrorForField("name")}
        helperText={getErrorForField("name")}
      />
    </ModalWrapper>
  );
};

export default CityFormModal;

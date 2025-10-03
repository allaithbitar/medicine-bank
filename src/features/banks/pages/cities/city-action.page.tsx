import { CitySchema } from "@/features/banks/schemas/city.schema";
import { TextField, Card, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import z from "zod";
import type { TCity } from "@/features/banks/types/city.types";
import citiesApi from "@/features/banks/api/cities-api/cities.api";
import STRINGS from "@/core/constants/strings.constant";
import { useLocation, useNavigate } from "react-router-dom";
import {
  notifyError,
  notifySuccess,
} from "@/core/components/common/toast/toast";
import ActionFab from "@/core/components/common/action-fab/acion-fab.component";
import { Save } from "@mui/icons-material";
import LoadingOverlay from "@/core/components/common/loading-overlay/loading-overlay";

const CityActionPage = () => {
  const navigate = useNavigate();
  const { state: old } = useLocation();
  const oldCity = old?.oldCity;
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
      navigate(-1);
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
    <Card>
      <Typography sx={{ pb: 2 }}>
        {oldCity ? STRINGS.edit_city : STRINGS.add_city}
      </Typography>
      <TextField
        fullWidth
        label={STRINGS.city_name}
        value={cityName}
        onChange={(e) => handleCityNameChange(e.target.value)}
        error={!!getErrorForField("name")}
        helperText={getErrorForField("name")}
      />
      <ActionFab
        icon={<Save />}
        color="success"
        onClick={handleSubmit}
        disabled={isUpdatingCity || isAddingCity}
      />
      {isUpdatingCity || (isAddingCity && <LoadingOverlay />)}
    </Card>
  );
};

export default CityActionPage;

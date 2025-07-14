import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Box,
  FormHelperText,
} from "@mui/material";
import citiesApi from "@/features/banks/api/cities-api/cities.api";
import type { TCity } from "@/features/banks/types/city.types";
import { useEffect } from "react";

interface ICitySelectProps {
  value: string;
  onChange: (cityId: string) => void;
  label?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
}

const CitySelect = ({
  value,
  onChange,
  label = "Select City",
  error = false,
  helperText,
  disabled = false,
}: ICitySelectProps) => {
  const {
    data: cities = [],
    isFetching,
    isLoading,
    error: fetchError,
  } = citiesApi.useGetCitiesQuery({ name: "" });

  const handleChange = (event: any) => {
    const selectedValue = event.target.value as string;
    onChange(selectedValue);
  };

  useEffect(() => {
    if (cities.length > 0 && !value) {
      onChange(cities[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cities]);

  const isDisabled = disabled || isLoading || isFetching;

  return (
    <FormControl
      fullWidth
      variant="outlined"
      sx={{ minWidth: 120 }}
      error={error || !!fetchError}
      disabled={isDisabled}
    >
      <InputLabel id="city-select-label">{label}</InputLabel>
      <Select
        labelId="city-select-label"
        id="city-select"
        value={value}
        onChange={handleChange}
        label={label}
        renderValue={(selected) => {
          const selectedCity = cities.find((city) => city.id === selected);
          return selectedCity ? selectedCity.name : "";
        }}
      >
        {cities.map((city: TCity) => (
          <MenuItem key={city.id} value={city.id}>
            {city.name}
          </MenuItem>
        ))}
      </Select>
      {(isLoading || isFetching) && (
        <Box
          sx={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            alignItems: "center",
          }}
        >
          <CircularProgress size={20} />
        </Box>
      )}
      {(helperText || fetchError) && (
        <FormHelperText>
          {helperText || (fetchError ? `Error Loading` : undefined)}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default CitySelect;

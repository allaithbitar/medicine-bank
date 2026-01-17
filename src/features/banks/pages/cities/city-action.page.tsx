import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, TextField, Typography } from '@mui/material';
import { Save } from '@mui/icons-material';
import z from 'zod';
import type { TCity } from '@/features/banks/types/city.types';
import citiesApi from '@/features/banks/api/cities-api/cities.api';
import { CitySchema } from '@/features/banks/schemas/city.schema';
import ActionFab from '@/core/components/common/action-fab/acion-fab.component';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import STRINGS from '@/core/constants/strings.constant';
import { notifyError, notifySuccess } from '@/core/components/common/toast/toast';

const CityActionPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id') ?? undefined;

  const { data: { items: cities = [] } = { items: [] }, isLoading: isLoadingCities } = citiesApi.useGetCitiesQuery(
    {
      pageSize: 1000,
    },
    { skip: !id }
  );

  const cachedCity = useMemo(
    () => (id ? (cities.find((c) => String(c.id) === String(id)) as TCity | undefined) : undefined),
    [cities, id]
  );

  const [updateCity, { isLoading: isUpdatingCity }] = citiesApi.useUpdateCityMutation();
  const [addCity, { isLoading: isAddingCity }] = citiesApi.useAddCityMutation();

  const [cityName, setCityName] = useState<string>('');
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);

  const handleCityNameChange = (value: string) => {
    setCityName(value);
    setErrors((prev) => prev.filter((err) => String(err.path[0]) !== 'name'));
  };

  const getErrorForField = (fieldName: keyof TCity) => {
    const error = errors.find((err) => err.path[0] === fieldName);
    return error ? error.message : '';
  };

  const handleSubmit = async () => {
    try {
      CitySchema.parse({ name: cityName });

      if (id) {
        await updateCity({ id, name: cityName }).unwrap();
      } else {
        await addCity({ name: cityName }).unwrap();
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

  const isBusy = isUpdatingCity || isAddingCity || isLoadingCities;

  useEffect(() => {
    if (cachedCity) {
      setCityName(cachedCity.name);
    }
  }, [cachedCity]);

  return (
    <Card sx={{ p: 2 }}>
      <Typography sx={{ pb: 2 }}>{id ? STRINGS.edit_city : STRINGS.add_city}</Typography>

      <TextField
        fullWidth
        label={STRINGS.city_name}
        value={cityName}
        onChange={(e) => handleCityNameChange(e.target.value)}
        error={!!getErrorForField('name')}
        helperText={getErrorForField('name')}
      />

      <ActionFab icon={<Save />} color="success" onClick={handleSubmit} disabled={isBusy} />

      {isBusy && <LoadingOverlay />}
    </Card>
  );
};

export default CityActionPage;

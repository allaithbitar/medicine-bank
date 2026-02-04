import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '@mui/material';
import { Save } from '@mui/icons-material';
import z from 'zod';
import type { TCity } from '@/features/banks/types/city.types';
import citiesApi from '@/features/banks/api/cities-api/cities.api';
import { CitySchema } from '@/features/banks/schemas/city.schema';
import ActionFab from '@/core/components/common/action-fab/acion-fab.component';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import STRINGS from '@/core/constants/strings.constant';
import { notifyError, notifySuccess } from '@/core/components/common/toast/toast';
import Header from '@/core/components/common/header/header';
import FormTextFieldInput from '@/core/components/common/inputs/form-text-field-input.component';

const CityActionPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id') ?? undefined;

  const { data: cityData, isFetching: isLoadingCity } = citiesApi.useGetCityByIdQuery({ id: id! }, { skip: !id });

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

  const isBusy = isUpdatingCity || isAddingCity || isLoadingCity;

  useEffect(() => {
    if (cityData) {
      setCityName(cityData.name);
    }
  }, [cityData]);

  return (
    <Card>
      <Header title={id ? STRINGS.edit_city : STRINGS.add_city} />
      <FormTextFieldInput
        required
        label={STRINGS.city_name}
        value={cityName}
        onChange={(val) => handleCityNameChange(val)}
        error={!!getErrorForField('name')}
        errorText={getErrorForField('name')}
      />

      <ActionFab icon={<Save />} color="success" onClick={handleSubmit} disabled={isBusy} />

      {isBusy && <LoadingOverlay />}
    </Card>
  );
};

export default CityActionPage;

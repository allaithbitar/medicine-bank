import { useEffect, useState } from 'react';
import { Stack, Card } from '@mui/material';
import { notifyError, notifySuccess } from '@/core/components/common/toast/toast';
import { z } from 'zod';
import workAreasApi from '@/features/banks/api/work-areas/work-areas.api';
import { UpdateWorkAreaSchema, WorkAreaSchema } from '@/features/banks/schemas/work-area.schema';
import STRINGS from '@/core/constants/strings.constant';
import CitiesAutocomplete from '@/features/banks/components/cities/cities-autocomplete/cities-autocomplete.component';
import useReducerState from '@/core/hooks/use-reducer.hook';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ActionFab from '@/core/components/common/action-fab/acion-fab.component';
import { Save } from '@mui/icons-material';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import { skipToken } from '@reduxjs/toolkit/query/react';
import citiesApi from '../../api/cities-api/cities.api';
import type { TAutocompleteItem } from '@/core/types/common.types';
import Header from '@/core/components/common/header/header';
import FormTextFieldInput from '@/core/components/common/inputs/form-text-field-input.component';

interface IAreaData {
  selectedCity: TAutocompleteItem | null;
  workAreaName: string;
}
const initialAreaData: IAreaData = {
  selectedCity: null,
  workAreaName: '',
};

const WorkAreaActionPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id') ?? undefined;

  const { data: workAreaById, isLoading: isLoadingById } = workAreasApi.useGetWorkAreaByIdQuery(
    id ? { id } : skipToken
  );
  const { data: cityById, isLoading: isLoadingCityById } = citiesApi.useGetCityByIdQuery(
    workAreaById?.cityId ? { id: workAreaById?.cityId } : skipToken,
    { skip: !id || !workAreaById }
  );

  const [state, setState] = useReducerState<IAreaData>(initialAreaData);

  useEffect(() => {
    if (!workAreaById || !cityById) return;
    setState({
      workAreaName: workAreaById.name ?? '',
      selectedCity: cityById,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityById, workAreaById]);

  const [errors, setErrors] = useState<z.ZodIssue[]>([]);

  const [updateWorkArea, { isLoading: isUpdatingWorkArea }] = workAreasApi.useUpdateWorkAreaMutation();
  const [addWorkArea, { isLoading: isAddingWorkArea }] = workAreasApi.useAddWorkAreaMutation();

  const handleWorkAreaNameChange = (value: string) => {
    setState({ workAreaName: value });
    setErrors((prevErrors) => prevErrors.filter((error) => error.path[0] !== 'name'));
  };

  const getErrorForField = (fieldName: keyof IAreaData) => {
    const error = errors.find((err) => err.path[0] === fieldName);
    return error ? error.message : '';
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        name: state.workAreaName,
        cityId: state.selectedCity?.id,
      };

      if (workAreaById) {
        const validatedPayload = UpdateWorkAreaSchema.parse({
          ...payload,
          id: workAreaById.id,
        });
        await updateWorkArea(validatedPayload).unwrap();
      } else {
        const validatedPayload = WorkAreaSchema.parse(payload);
        await addWorkArea(validatedPayload).unwrap();
      }

      notifySuccess(workAreaById ? STRINGS.edited_successfully : STRINGS.added_successfully);
      navigate(-1);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setErrors(err.errors);
        notifyError();
      } else {
        notifyError(err);
      }
    }
  };

  const isLoading = isUpdatingWorkArea || isAddingWorkArea || isLoadingById || isLoadingCityById;

  return (
    <Card>
      <Header title={workAreaById ? STRINGS.edit_work_area : STRINGS.add_work_area} />
      <Stack gap={3}>
        <CitiesAutocomplete
          multiple={false}
          disabled
          autoSelectFirst={workAreaById ? false : true}
          defaultValueId={workAreaById?.cityId}
          value={state.selectedCity}
          onChange={(v) => setState({ selectedCity: v })}
          errorText={getErrorForField('selectedCity')}
          helperText={getErrorForField('selectedCity')}
        />
        <FormTextFieldInput
          label={STRINGS.work_area_name}
          value={state.workAreaName}
          onChange={handleWorkAreaNameChange}
          error={!!getErrorForField('workAreaName')}
          errorText={getErrorForField('workAreaName')}
          disabled={isLoading}
        />
      </Stack>
      <ActionFab icon={<Save />} color="success" onClick={handleSubmit} disabled={isLoading} />
      {isLoading && <LoadingOverlay />}
    </Card>
  );
};

export default WorkAreaActionPage;

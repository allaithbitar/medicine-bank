import { useEffect, useState } from 'react';
import { TextField, Stack, Card, Typography } from '@mui/material';
import { notifyError, notifySuccess } from '@/core/components/common/toast/toast';
import { z } from 'zod';
import workAreasApi from '@/features/banks/api/work-areas/work-areas.api';
import { UpdateWorkAreaSchema, WorkAreaSchema } from '@/features/banks/schemas/work-area.schema';
import STRINGS from '@/core/constants/strings.constant';
import CitiesAutocomplete from '@/features/banks/components/cities/cities-autocomplete/cities-autocomplete.component';
import useReducerState from '@/core/hooks/use-reducer.hook';
import type { IOptions } from '@/core/types/common.types';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ActionFab from '@/core/components/common/action-fab/acion-fab.component';
import { Save } from '@mui/icons-material';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import { skipToken } from '@reduxjs/toolkit/query/react';
import citiesApi from '../../api/cities-api/cities.api';

interface IAreaData {
  selectedCity: IOptions | null;
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
      <Typography sx={{ pb: 2 }}>{workAreaById ? STRINGS.edit_city : STRINGS.add_city}</Typography>
      <Stack gap={3}>
        <CitiesAutocomplete
          disabled
          defaultValueId={workAreaById?.cityId}
          value={state.selectedCity}
          onChange={(v) => setState({ selectedCity: v })}
          errorText={getErrorForField('selectedCity')}
          helperText={getErrorForField('selectedCity')}
        />
        <TextField
          fullWidth
          label={STRINGS.work_area_name}
          value={state.workAreaName}
          onChange={(e) => handleWorkAreaNameChange(e.target.value)}
          error={!!getErrorForField('workAreaName')}
          helperText={getErrorForField('workAreaName')}
          disabled={isLoading}
        />
      </Stack>
      <ActionFab icon={<Save />} color="success" onClick={handleSubmit} disabled={isLoading} />
      {isLoading && <LoadingOverlay />}
    </Card>
  );
};

export default WorkAreaActionPage;

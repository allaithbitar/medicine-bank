import { useEffect, useMemo, useState } from 'react';
import STRINGS from '@/core/constants/strings.constant';
import { Stack, Card } from '@mui/material';
import useReducerState from '@/core/hooks/use-reducer.hook';
import z from 'zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { notifyError, notifySuccess } from '@/core/components/common/toast/toast';
import ratingsApi from '../api/ratings.api';
import { RatingSchema, UpdateRatingSchema } from '../schemas/rating.schema';
import ActionFab from '@/core/components/common/action-fab/acion-fab.component';
import { Save } from '@mui/icons-material';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import Header from '@/core/components/common/header/header';
import FormTextFieldInput from '@/core/components/common/inputs/form-text-field-input.component';
import FormTextAreaInput from '@/core/components/common/inputs/form-text-area-input.component';

interface IRatingsData {
  name: string;
  code: string;
  description: string;
}

const RatingActionPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id') ?? undefined;

  const { data: ratings = [], isLoading: isLoadingRatings } = ratingsApi.useGetRatingsQuery({}, { skip: !id });

  const fetchedRating = useMemo(() => {
    if (!id) return undefined;
    return ratings.find((r) => String(r.id) === String(id));
  }, [ratings, id]);

  const initialRatingsData: IRatingsData = {
    code: fetchedRating?.code || '',
    name: fetchedRating?.name || '',
    description: fetchedRating?.description || '',
  };

  const [state, setState] = useReducerState<IRatingsData>(initialRatingsData);
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);

  useEffect(() => {
    if (!fetchedRating) return;
    setState({
      code: fetchedRating.code ?? '',
      name: fetchedRating.name ?? '',
      description: fetchedRating.description ?? '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedRating?.id]);

  const [addRating, { isLoading: isAddingRating }] = ratingsApi.useAddRatingMutation();
  const [updateRating, { isLoading: isUpdatingRating }] = ratingsApi.useUpdateRatingMutation();

  const getErrorForField = (fieldName: keyof IRatingsData) => {
    const error = errors.find((err) => err.path[0] === fieldName);
    return error ? error.message : '';
  };

  const handleFieldChange = (field: keyof IRatingsData, value: string) => {
    setState({ [field]: value });
    setErrors((prevErrors) => prevErrors.filter((error) => error.path[0] !== field));
  };

  const handleSave = async () => {
    const addPayload = {
      name: state.name,
      code: state.code,
      description: state.description,
    };
    try {
      if (fetchedRating) {
        const editPayload = { ...addPayload, id: fetchedRating.id };
        UpdateRatingSchema.parse(editPayload);
        await updateRating(editPayload).unwrap();
      } else {
        RatingSchema.parse(addPayload);
        await addRating(addPayload).unwrap();
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

  const isLoading = isAddingRating || isUpdatingRating || isLoadingRatings;

  return (
    <Card>
      <Header title={id ? STRINGS.edit_rating : STRINGS.add_rating} />
      <Stack sx={{ flexDirection: 'column', gap: 1 }}>
        <FormTextFieldInput
          label={STRINGS.name}
          value={state.name}
          onChange={(value) => handleFieldChange('name', value)}
          error={!!getErrorForField('name')}
          errorText={getErrorForField('name')}
        />
        <FormTextAreaInput
          fullWidth
          label={STRINGS.description}
          value={state.description}
          onChange={(value) => handleFieldChange('description', value)}
          error={!!getErrorForField('description')}
          errorText={getErrorForField('description')}
        />
        <FormTextFieldInput
          label={STRINGS.code}
          value={state.code}
          onChange={(value) => handleFieldChange('code', value)}
          error={!!getErrorForField('code')}
          errorText={getErrorForField('code')}
        />
      </Stack>
      <ActionFab icon={<Save />} color="success" onClick={handleSave} disabled={isLoading} />
      {isLoading && <LoadingOverlay />}
    </Card>
  );
};

export default RatingActionPage;

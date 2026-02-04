import { useEffect, useState } from 'react';
import { Card, Stack } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Save } from '@mui/icons-material';
import z from 'zod';

import STRINGS from '@/core/constants/strings.constant';
import ActionFab from '@/core/components/common/action-fab/acion-fab.component';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import { notifyError, notifySuccess } from '@/core/components/common/toast/toast';

import useReducerState from '@/core/hooks/use-reducer.hook';
import {
  BROADCAST_AUDIENCES,
  BROADCAST_TYPES,
  type TBroadcastAudience,
  type TSystemBroadcast,
} from '../types/system-broadcasts.types';
import systemBroadcastsApi from '../api/system-broadcasts.api';
import { skipToken } from '@reduxjs/toolkit/query/react';
import Header from '@/core/components/common/header/header';
import FormSelectInput from '@/core/components/common/inputs/form-select-input.component';
import { getStringsLabel } from '@/core/helpers/helpers';
import FormTextFieldInput from '@/core/components/common/inputs/form-text-field-input.component';
import FormTextAreaInput from '@/core/components/common/inputs/form-text-area-input.component';

const BroadcastSchema = z.object({
  type: z.enum(BROADCAST_TYPES, {
    errorMap: () => ({ message: STRINGS.schema_required }),
  }),
  title: z.string().min(1, { message: STRINGS.schema_required }).max(500),
  details: z.string().min(1, { message: STRINGS.schema_required }).max(500),
  audience: z.enum(BROADCAST_AUDIENCES as unknown as [string, ...string[]], {
    errorMap: () => ({ message: STRINGS.schema_required }),
  }),
});

type TFormValues = z.infer<typeof BroadcastSchema>;

const SystemBroadcastActionPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id') ?? undefined;

  const { data: fetchedBroadcast, isLoading: isLoadingById } = systemBroadcastsApi.useGetSystemBroadcastByIdQuery(
    id ? { id } : skipToken
  );

  const initial: TFormValues = {
    type: fetchedBroadcast?.type ?? 'meeting',
    title: fetchedBroadcast?.title ?? '',
    details: fetchedBroadcast?.details ?? '',
    audience: (fetchedBroadcast?.audience as (typeof BROADCAST_AUDIENCES)[number]) ?? 'all',
  };

  const [values, setValues] = useReducerState<TFormValues>(initial);
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);

  const [addBroadcast, { isLoading: isAdding }] = systemBroadcastsApi.useAddSystemBroadcastMutation();
  const [updateBroadcast, { isLoading: isUpdating }] = systemBroadcastsApi.useUpdateSystemBroadcastMutation();

  useEffect(() => {
    if (!fetchedBroadcast) return;
    setValues({
      type: fetchedBroadcast.type ?? 'meeting',
      title: fetchedBroadcast.title ?? '',
      details: fetchedBroadcast.details ?? '',
      audience: (fetchedBroadcast.audience as (typeof BROADCAST_AUDIENCES)[number]) ?? 'all',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedBroadcast?.id]);

  const getErrorForField = (field: keyof TFormValues) => {
    const err = errors.find((e) => e.path[0] === field);
    return err ? err.message : '';
  };

  const handleFieldChange = (field: keyof TFormValues, value: any) => {
    setValues({ [field]: value });
    setErrors((prev) => prev.filter((err) => err.path[0] !== field));
  };

  const handleSave = async () => {
    try {
      const parsed = BroadcastSchema.parse(values);

      if (fetchedBroadcast) {
        const payload = {
          id: fetchedBroadcast.id,
          ...parsed,
          createdAt: fetchedBroadcast.createdAt,
        } as TSystemBroadcast;
        await updateBroadcast(payload).unwrap();
        notifySuccess(STRINGS.edited_successfully);
      } else {
        const payload = {
          ...parsed,
          audience: parsed.audience as TBroadcastAudience,
        };
        await addBroadcast(payload).unwrap();
        notifySuccess(STRINGS.added_successfully);
      }

      navigate(-1);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setErrors(err.errors);
        return;
      }
      notifyError(err);
    }
  };

  const isLoading = isAdding || isUpdating || isLoadingById;

  return (
    <Card>
      <Header title={id ? STRINGS.edit : STRINGS.add} />
      <Stack spacing={2}>
        <FormSelectInput
          value={values.type}
          required
          disableClearable
          label={STRINGS.type}
          options={BROADCAST_TYPES.map((t) => ({ id: t, label: getStringsLabel({ key: 'broadcast_type', val: t }) }))}
          onChange={(v) => handleFieldChange('type', v)}
          getOptionLabel={(option) => option.label}
          errorText={getErrorForField('type')}
        />
        <FormTextFieldInput
          label={STRINGS.title}
          value={values.title}
          onChange={(val) => handleFieldChange('title', val)}
          errorText={getErrorForField('title')}
          required
        />
        <FormSelectInput
          label={STRINGS.audience}
          value={values.audience}
          required
          disableClearable
          options={BROADCAST_AUDIENCES.map((a) => ({ id: a, label: getStringsLabel({ key: 'audience', val: a }) }))}
          onChange={(v) => handleFieldChange('audience', v)}
          getOptionLabel={(option) => option.label}
          errorText={getErrorForField('audience')}
        />

        <FormTextAreaInput
          label={STRINGS.details}
          value={values.details ?? ''}
          onChange={(value) => handleFieldChange('details', value)}
          error={!!getErrorForField('details')}
          errorText={getErrorForField('details')}
        />
      </Stack>

      <ActionFab icon={<Save />} color="success" onClick={handleSave} disabled={isLoading} />

      {isLoading && <LoadingOverlay />}
    </Card>
  );
};

export default SystemBroadcastActionPage;

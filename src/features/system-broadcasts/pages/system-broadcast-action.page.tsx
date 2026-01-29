import { useEffect, useState } from 'react';
import { Card, Stack, TextField, Typography, Box, Select, MenuItem } from '@mui/material';
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
    <Card sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ pb: 2 }}>
        {id ? STRINGS.edit : STRINGS.add}
      </Typography>

      <Stack gap={2}>
        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {STRINGS.type}
          </Typography>
          <Select fullWidth value={values.type} onChange={(e) => handleFieldChange('type', e.target.value as any)}>
            {BROADCAST_TYPES.map((t) => (
              <MenuItem key={t} value={t}>
                {STRINGS[`broadcast_type_${t}` as keyof typeof STRINGS] ?? t}
              </MenuItem>
            ))}
          </Select>
          <Typography color="error" variant="caption">
            {getErrorForField('type')}
          </Typography>
        </Box>

        <TextField
          fullWidth
          label={STRINGS.title}
          value={values.title}
          onChange={(e) => handleFieldChange('title', e.target.value)}
          error={!!getErrorForField('title')}
          helperText={getErrorForField('title')}
        />

        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {STRINGS.audience}
          </Typography>
          <Select
            fullWidth
            value={values.audience}
            onChange={(e) => handleFieldChange('audience', e.target.value as any)}
          >
            {BROADCAST_AUDIENCES.map((a) => (
              <MenuItem key={a} value={a}>
                {STRINGS[`audience_${a}` as keyof typeof STRINGS] ?? a}
              </MenuItem>
            ))}
          </Select>
          <Typography color="error" variant="caption">
            {getErrorForField('audience')}
          </Typography>
        </Box>

        <TextField
          fullWidth
          label={STRINGS.details}
          value={values.details ?? ''}
          onChange={(e) => handleFieldChange('details', e.target.value)}
          multiline
          minRows={3}
          error={!!getErrorForField('details')}
          helperText={getErrorForField('details')}
        />
      </Stack>

      <ActionFab icon={<Save />} color="success" onClick={handleSave} disabled={isLoading} />

      {isLoading && <LoadingOverlay />}
    </Card>
  );
};

export default SystemBroadcastActionPage;

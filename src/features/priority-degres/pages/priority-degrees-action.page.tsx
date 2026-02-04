import { useMemo, useState } from 'react';
import { Box, Stack, MenuItem, Select, type SelectChangeEvent, Typography, Card } from '@mui/material';
import { red, green, orange } from '@mui/material/colors';
import * as z from 'zod';
import type { TAddPriorityDegreeDto, TPriorityDegree, TUpdatePriorityDegreeDto } from '../types/priority-degree.types';
import priorityDegreesApi from '../api/priority-degrees.api';
import { notifyError, notifySuccess } from '@/core/components/common/toast/toast';
import STRINGS from '@/core/constants/strings.constant';
import useReducerState from '@/core/hooks/use-reducer.hook';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ActionFab from '@/core/components/common/action-fab/acion-fab.component';
import { Save } from '@mui/icons-material';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import FormNumberInput from '@/core/components/common/inputs/form-number-input.component';
import FormTextFieldInput from '@/core/components/common/inputs/form-text-field-input.component';
import Header from '@/core/components/common/header/header';

const PriorityDegreeSchema = z.object({
  name: z.string().min(1, { message: STRINGS.schema_required }).max(100),
  color: z.string().min(1, { message: STRINGS.schema_required }),
  durationInDays: z.number().int().positive().optional().or(z.literal(0)),
});

type TFormValues = z.infer<typeof PriorityDegreeSchema>;

const COLOR_GROUPS = {
  red: Object.values(red).filter((v) => typeof v === 'string') as string[],
  orange: Object.values(orange).filter((v) => typeof v === 'string') as string[],
  green: Object.values(green).filter((v) => typeof v === 'string') as string[],
};

const FLAT_COLORS: { color: string; group: string; label: string }[] = [
  ...COLOR_GROUPS.red.map((c, i) => ({
    color: c,
    group: 'red',
    label: `red-${i}`,
  })),

  ...COLOR_GROUPS.orange.map((c, i) => ({
    color: c,
    group: 'orange',
    label: `orange-${i}`,
  })),
  ...COLOR_GROUPS.green.map((c, i) => ({
    color: c,
    group: 'green',
    label: `green-${i}`,
  })),
];

const PriorityDegreesActionPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id') ?? undefined;

  const { data: priorityDegrees = [], isLoading: isLoadingPriorityDegrees } =
    priorityDegreesApi.useGetPriorityDegreesQuery({}, { skip: !id });

  const cachedPriorityDegree = useMemo(
    () => (id ? (priorityDegrees.find((c) => String(c.id) === String(id)) as TPriorityDegree | undefined) : undefined),
    [id, priorityDegrees]
  );

  const [updatePriorityDegree, { isLoading: isUpdating }] = priorityDegreesApi.useUpdatePriorityDegreeMutation({});
  const [addPriorityDegree, { isLoading: isAdding }] = priorityDegreesApi.useAddPriorityDegreeMutation({});

  const [values, setValues] = useReducerState<TFormValues>({
    name: cachedPriorityDegree?.name ?? '',
    color: cachedPriorityDegree?.color ?? green[700],
    durationInDays: cachedPriorityDegree?.durationInDays ?? undefined,
  });
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);

  const getErrorForField = (field: keyof TFormValues) => {
    const err = errors.find((e) => e.path[0] === field);
    return err ? err.message : '';
  };

  const handleNameChange = (val: string) => {
    setValues({ name: val });
    setErrors((prev) => prev.filter((e) => e.path[0] !== 'name'));
  };

  const handleColorChange = (e: SelectChangeEvent<string>) => {
    const v = e.target.value || '';
    setValues({ color: v });
  };

  const handleDurationChange = (val: string) => {
    const num = val === '' ? undefined : Number(val);
    setValues({ durationInDays: num });
    setErrors((prev) => prev.filter((e) => e.path[0] !== 'durationInDays'));
  };

  const handleSubmit = async () => {
    try {
      const parsed = PriorityDegreeSchema.parse(values);
      if (cachedPriorityDegree) {
        const payload: TUpdatePriorityDegreeDto = {
          id: cachedPriorityDegree.id,
          name: parsed.name,
          color: parsed.color ?? undefined,
          durationInDays: parsed.durationInDays,
        };
        await updatePriorityDegree(payload).unwrap();
      } else {
        const payload: TAddPriorityDegreeDto = {
          name: parsed.name,
          color: parsed.color ?? undefined,
          durationInDays: parsed.durationInDays,
        };
        await addPriorityDegree(payload).unwrap();
      }
      notifySuccess(cachedPriorityDegree ? STRINGS.edited_successfully : STRINGS.added_successfully);
      navigate(-1);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setErrors(err.errors);
        return;
      }
      notifyError(err);
    }
  };

  const isBusy = isAdding || isUpdating || isLoadingPriorityDegrees;

  return (
    <Card>
      <Header title={id ? STRINGS.edit_priority_degree : STRINGS.add_priority_degree} />
      <Stack gap={2}>
        <FormTextFieldInput
          required
          label={STRINGS.name}
          value={values.name}
          onChange={(value) => handleNameChange(value)}
          errorText={getErrorForField('name')}
        />
        <FormNumberInput
          value={values.durationInDays}
          label={STRINGS.duration_in_days}
          onChange={(v) => handleDurationChange(`${v}`)}
          errorText={getErrorForField('durationInDays')}
        />

        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {STRINGS.select_color_optional}
          </Typography>

          <Select
            fullWidth
            value={values.color}
            onChange={handleColorChange}
            displayEmpty
            renderValue={(selected) => {
              const found = FLAT_COLORS.find((f) => f.color === selected);
              const groupLabel = found ? found.group : 'color';
              return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 14,
                      bgcolor: selected as string,
                      borderRadius: 0.5,
                      border: '1px solid rgba(0,0,0,0.08)',
                    }}
                  />
                  <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                    {groupLabel} —{' '}
                    <Typography component="span" variant="body2">
                      {selected}
                    </Typography>
                  </Typography>
                </Box>
              );
            }}
            sx={{ minWidth: 160 }}
          >
            {FLAT_COLORS.map((c) => (
              <MenuItem key={c.color} value={c.color}>
                <Stack direction="row" gap={1} alignItems="center">
                  <Box
                    sx={{
                      width: 28,
                      height: 18,
                      bgcolor: c.color,
                      borderRadius: 0.5,
                      border: '1px solid rgba(0,0,0,0.08)',
                    }}
                  />
                  <Typography variant="body2" sx={{ textTransform: 'capitalize', minWidth: 60 }}>
                    {c.group}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {c.color}
                  </Typography>
                </Stack>
              </MenuItem>
            ))}
          </Select>
          <Typography>{STRINGS.quick_access}</Typography>
          <Stack direction="row" gap={1} mt={1} flexWrap="wrap">
            {[red[700], orange[700], green[700]].map((c) => (
              <Box
                key={c}
                onClick={() => setValues({ color: c })}
                sx={{
                  width: 28,
                  height: 28,
                  bgcolor: c,
                  borderRadius: 1,
                  cursor: 'pointer',
                  border: values.color === c ? '2px solid rgba(0,0,0,0.2)' : '1px solid rgba(0,0,0,0.08)',
                }}
                title={c}
              />
            ))}
          </Stack>
        </Box>
      </Stack>
      <ActionFab icon={<Save />} color="success" onClick={handleSubmit} disabled={isBusy} />
      {isBusy && <LoadingOverlay />}
    </Card>
  );
};

export default PriorityDegreesActionPage;

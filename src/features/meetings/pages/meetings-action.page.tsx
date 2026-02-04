import { useEffect, useState } from 'react';
import { Card, Stack } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Save } from '@mui/icons-material';
import z from 'zod';
import { notifyError, notifySuccess } from '@/core/components/common/toast/toast';
import ActionFab from '@/core/components/common/action-fab/acion-fab.component';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import useReducerState from '@/core/hooks/use-reducer.hook';
import STRINGS from '@/core/constants/strings.constant';
import meetingsApi from '../api/meetings.api';
import FormDateTimeInput from '@/core/components/common/inputs/form-date-time-input.componenet';
import { skipToken } from '@reduxjs/toolkit/query';
import Header from '@/core/components/common/header/header';
import FormTextAreaInput from '@/core/components/common/inputs/form-text-area-input.component';

const MeetingSchema = z.object({
  note: z.string().min(1, { message: STRINGS.schema_required }),
  date: z.string().min(1, { message: STRINGS.schema_required }),
  createdAt: z.string().optional().nullable(),
});

const UpdateMeetingSchema = MeetingSchema.extend({ id: z.string().min(1) });

type TFormValues = z.infer<typeof MeetingSchema>;

const MeetingActionPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id') ?? undefined;
  const { data: oldMeeting, isLoading: isLoadingById } = meetingsApi.useGetMeetingsByIdQuery(id ? { id } : skipToken);

  const [addMeeting, { isLoading: isAdding }] = meetingsApi.useAddMeetingMutation();
  const [updateMeeting, { isLoading: isUpdating }] = meetingsApi.useUpdateMeetingMutation();

  const initialValues: TFormValues = {
    note: '',
    date: '',
    createdAt: '',
  };

  const [values, setValues] = useReducerState(initialValues);
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);

  const getErrorForField = (field: keyof TFormValues) => {
    const err = errors.find((e) => e.path[0] === field);
    return err ? err.message : '';
  };

  useEffect(() => {
    if (oldMeeting) {
      setValues({
        note: oldMeeting?.note,
        createdAt: oldMeeting?.createdAt,
        date: oldMeeting?.date,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oldMeeting]);

  const handleSave = async () => {
    try {
      const toValidate = {
        note: values.note,
        date: values.date,
        // createdAt: dateStr,
      };

      if (oldMeeting) {
        const payload = { id: oldMeeting.id, ...toValidate };
        UpdateMeetingSchema.parse(payload);
        await updateMeeting(payload).unwrap();
      } else {
        MeetingSchema.parse(toValidate);
        const payload = { ...toValidate };
        await addMeeting(payload).unwrap();
      }

      notifySuccess(oldMeeting ? STRINGS.edited_successfully : STRINGS.added_successfully);
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
      <Header title={oldMeeting ? STRINGS.edit_meeting : STRINGS.add_meeting} />
      <Stack gap={2}>
        <FormTextAreaInput
          label={STRINGS.note}
          value={values.note}
          onChange={(value) => {
            setValues({ note: value });
            setErrors((p) => p.filter((er) => er.path[0] !== 'note'));
          }}
          error={!!getErrorForField('note')}
          errorText={getErrorForField('note')}
        />

        <FormDateTimeInput
          label={STRINGS.date}
          value={values.date}
          onChange={(newDate) => {
            setValues({ date: newDate });
            setErrors((p) => p.filter((er) => er.path[0] !== 'date'));
          }}
          errorText={getErrorForField('date')}
        />
      </Stack>

      <ActionFab icon={<Save />} color="success" onClick={handleSave} disabled={isLoading} />

      {isLoading && <LoadingOverlay />}
    </Card>
  );
};

export default MeetingActionPage;

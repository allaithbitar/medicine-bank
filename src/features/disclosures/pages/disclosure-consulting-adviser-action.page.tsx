import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import ActionFab from '@/core/components/common/action-fab/acion-fab.component';
import { Save } from '@mui/icons-material';
import { Card, Stack, Typography } from '@mui/material';
import STRINGS from '@/core/constants/strings.constant';
import AudioPlayer, { type TAudioFile } from '../components/audio-player.component';
import useReducerState from '@/core/hooks/use-reducer.hook';
import z from 'zod';
import { useEffect, useState } from 'react';
import type {
  TAddDisclosureAdviserConsultationPayload,
  TDisclosureAdviserConsultation,
} from '../types/disclosure.types';
import { notifyError, notifySuccess } from '@/core/components/common/toast/toast';
import disclosuresApi from '../api/disclosures.api';
import { skipToken } from '@reduxjs/toolkit/query';
import FormTextAreaInput from '@/core/components/common/inputs/form-text-area-input.component';

const AdviserConsultationSchema = z.object({
  consultationNote: z.string().min(0),
});

type TFormValues = z.infer<typeof AdviserConsultationSchema>;

const DisclosureConsultingAdviserActionPage = () => {
  const { disclosureId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id') ?? undefined;
  const { data: oldAdviserConsultation, isLoading: isLoadingById } =
    disclosuresApi.useGetDisclosureAdviserConsultationByIdQuery(id ? { id } : skipToken);

  const [addDisclosureAdviserConsultation, { isLoading: isAdding }] =
    disclosuresApi.useAddDisclosureAdviserConsultationMutation();

  const [updateDisclosureAdviserConsultation, { isLoading: isUpdating }] =
    disclosuresApi.useUpdateDisclosureAdviserConsultationMutation();
  const [val, setVal] = useReducerState<TFormValues>({
    consultationNote: '',
  });

  useEffect(() => {
    if (oldAdviserConsultation) {
      setVal({ consultationNote: oldAdviserConsultation.consultationNote });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oldAdviserConsultation]);

  const [errors, setErrors] = useState<z.ZodIssue[]>([]);
  console.log('🚀 ~ DisclosureConsultingAdviserActionPage ~ errors:', errors);

  const [audioFile, setAudioFile] = useState<TAudioFile>();

  const getErrorForField = (fieldName: keyof TDisclosureAdviserConsultation) => {
    const error = errors.find((err) => err.path[0] === fieldName);
    return error ? error.message : '';
  };

  const handleFieldChange = (field: keyof TDisclosureAdviserConsultation, value: string) => {
    setVal({ [field]: value });
    setErrors((prevErrors) => prevErrors.filter((error) => error.path[0] !== field));
  };

  const validateAtLeastOne = () => {
    const hasNote = (val.consultationNote || '').trim().length >= 10;
    const hasAudio = !!audioFile?.audioBlob;
    if (!hasNote && !hasAudio) {
      setErrors([
        {
          code: 'custom',
          message: STRINGS.schema_note_requirement,
          path: ['consultationNote'],
        },
      ]);
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!disclosureId) return;
    try {
      AdviserConsultationSchema.parse(val);
      if (!validateAtLeastOne()) return;
      // const fd = new FormData();
      // fd.append('disclosureId', disclosureId);
      // if (val.consultationNote && val.consultationNote.trim().length > 0)
      //   fd.append('consultationNote', val.consultationNote.trim());
      // if (audioFile?.audioBlob) {
      //   fd.append('deleteAudioFile', 'false');
      //   const name = audioFile.audioName ?? `audio-${Date.now()}.webm`;
      //   fd.append('consultationAudioFile', audioFile.audioBlob, name);
      // } else {
      //   fd.append('deleteAudioFile', 'true');
      // }
      const dto: TAddDisclosureAdviserConsultationPayload = {
        disclosureId,
        consultationAudioFile: audioFile?.audioBlob,
        consultationNote: val.consultationNote,
      };
      if (oldAdviserConsultation) {
        await updateDisclosureAdviserConsultation({ ...dto, id: oldAdviserConsultation.id }).unwrap();
        notifySuccess(STRINGS.edited_successfully);
      } else {
        await addDisclosureAdviserConsultation(dto).unwrap();
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
      <Typography sx={{ pb: 2 }}>{oldAdviserConsultation ? STRINGS.edit_note : STRINGS.add_note}</Typography>
      <Stack gap={2}>
        <FormTextAreaInput
          label={STRINGS.note}
          value={val.consultationNote}
          onChange={(value) => handleFieldChange('consultationNote', value)}
          error={!!getErrorForField('consultationNote')}
          errorText={getErrorForField('consultationNote')}
        />
        <AudioPlayer setAudioFile={setAudioFile} audioFile={audioFile} setErrors={setErrors} />
      </Stack>
      <ActionFab icon={<Save />} color="success" onClick={handleSave} disabled={isLoading} />
    </Card>
  );
};

export default DisclosureConsultingAdviserActionPage;

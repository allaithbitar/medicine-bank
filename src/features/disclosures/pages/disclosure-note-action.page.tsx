import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import ActionFab from '@/core/components/common/action-fab/acion-fab.component';
import { Save } from '@mui/icons-material';
import { Card, Stack } from '@mui/material';
import { notifyError, notifySuccess } from '@/core/components/common/toast/toast';
import STRINGS from '@/core/constants/strings.constant';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import type { TDisclosureNote } from '../types/disclosure.types';
import useReducerState from '@/core/hooks/use-reducer.hook';
import z from 'zod';
import AudioPlayer, { type TAudioFile } from '../components/audio-player.component';
import Header from '@/core/components/common/header/header';
import FormTextAreaInput from '@/core/components/common/inputs/form-text-area-input.component';
import useDisclsoureNoteMutation from '../hooks/disclosure-notes-mutation.hook';
import { useDisclosureNoteLoader } from '../hooks/disclosure-note-loader.hook';

const NoteSchema = z.object({
  noteText: z.string().min(0),
});

type TFormValues = z.infer<typeof NoteSchema>;

const DisclosureNoteActionPage = () => {
  const { disclosureId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id') ?? undefined;
  const { data: oldNote, isLoading: isLoadingById } = useDisclosureNoteLoader(id);

  const [val, setVal] = useReducerState<TFormValues>({
    noteText: '',
  });

  useEffect(() => {
    if (oldNote) {
      setVal({
        noteText: oldNote.noteText || '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oldNote]);

  const [errors, setErrors] = useState<z.ZodIssue[]>([]);

  const [mutateDisclosureNote, { isLoading: isMutatingDisclosureNote }] = useDisclsoureNoteMutation();

  // const [addDisclosureNote, { isLoading: isAddingDisclosureNote }] = disclosuresApi.useAddDisclosureNoteMutation();
  //
  // const [updateDisclosureNote, { isLoading: isUpdateDisclosureNote }] =
  //   disclosuresApi.useUpdateDisclosureNoteMutation();

  const [audioFile, setAudioFile] = useState<TAudioFile>();

  const getErrorForField = (fieldName: keyof TDisclosureNote) => {
    const error = errors.find((err) => err.path[0] === fieldName);
    return error ? error.message : '';
  };

  const handleFieldChange = (field: keyof TDisclosureNote, value: string) => {
    setVal({ [field]: value });
    setErrors((prevErrors) => prevErrors.filter((error) => error.path[0] !== field));
  };

  const validateAtLeastOne = () => {
    const hasNote = (val.noteText || '').trim().length >= 10;
    const hasAudio = !!audioFile?.audioBlob;
    if (!hasNote && !hasAudio) {
      setErrors([
        {
          code: 'custom',
          message: STRINGS.schema_note_requirement,
          path: ['noteText'],
        },
      ]);
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!disclosureId) return;
    try {
      NoteSchema.parse(val);
      if (!validateAtLeastOne()) return;
      // const fd = new FormData();
      // fd.append('disclosureId', disclosureId);
      // if (val.noteText && val.noteText.trim().length > 0) fd.append('noteText', val.noteText.trim());
      // if (audioFile?.audioBlob) {
      //   fd.append('deleteAudioFile', 'false');
      //   const name = audioFile.audioName ?? `audio-${Date.now()}.webm`;
      //   fd.append('audioFile', audioFile.audioBlob, name);
      // } else {
      //   fd.append('deleteAudioFile', 'true');
      // }
      if (oldNote) {
        await mutateDisclosureNote({
          type: 'UPDATE',
          dto: {
            id: oldNote.id,
            disclosureId,
            noteAudio: audioFile?.audioBlob,
            noteText: val.noteText,
          },
        });
        notifySuccess(STRINGS.edited_successfully);
      } else {
        await mutateDisclosureNote({
          type: 'INSERT',
          dto: {
            disclosureId,
            noteAudio: audioFile?.audioBlob,
            noteText: val.noteText,
          },
        });
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

  return (
    <Card sx={{ p: 2 }}>
      <Header title={oldNote ? STRINGS.edit_note : STRINGS.add_note} />
      <Stack gap={2}>
        <FormTextAreaInput
          label={STRINGS.note}
          value={val.noteText}
          onChange={(value) => handleFieldChange('noteText', value)}
          error={!!getErrorForField('noteText')}
          errorText={getErrorForField('noteText')}
        />
        <AudioPlayer setAudioFile={setAudioFile} audioFile={audioFile} setErrors={setErrors} />
      </Stack>
      <ActionFab icon={<Save />} color="success" onClick={handleSave} disabled={isMutatingDisclosureNote} />
      {(isMutatingDisclosureNote || isLoadingById) && <LoadingOverlay />}
    </Card>
  );
};

export default DisclosureNoteActionPage;

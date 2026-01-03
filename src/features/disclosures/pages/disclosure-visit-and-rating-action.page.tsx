import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import ActionFab from '@/core/components/common/action-fab/acion-fab.component';
import { Save } from '@mui/icons-material';
import disclosuresApi from '../api/disclosures.api';
import { notifyError, notifySuccess } from '@/core/components/common/toast/toast';
import STRINGS from '@/core/constants/strings.constant';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import type {
  TDisclosure,
  TDisclosureVisitResult,
  TUpdateDisclosureVisitAndRatingDto,
} from '../types/disclosure.types';
import { Card, Stack } from '@mui/material';
import z from 'zod';
import type { TRating } from '@/features/ratings/types/rating.types';
import useForm from '@/core/hooks/use-form.hook';
import DisclosureVisitResultAutocomplete from '../components/disclosure-visit-result-autocomplete.component';
import FormTextAreaInput from '@/core/components/common/inputs/form-text-area-input.component';
import FormCheckbxInput from '@/core/components/common/inputs/form-checkbox-input.component';
import RatingsAutocomplete from '@/features/ratings/components/ratings-autocomplete.component';

const schema = z
  .object({
    visitResult: z.custom<{
      id: NonNullable<TDisclosureVisitResult>;
      label: string;
    } | null>((data) => !!data, { message: 'required' }),
    visitReason: z.string(),
    visitNote: z.string(),
    rating: z.custom<TRating | null>(),
    isCustomRating: z.boolean(),
    customRating: z.string(),
    ratingNote: z.string(),
  })
  .superRefine((state, ctx) => {
    if (state.visitResult?.id !== 'completed' && !state.visitReason) {
      return ctx.addIssue({
        code: 'custom',
        path: ['visitReason'],
        message: 'required',
      });
    }
    if (state.isCustomRating) {
      if (!state.customRating)
        ctx.addIssue({
          code: 'custom',
          path: ['customRating'],
          message: 'required',
        });
      if (state.customRating.length < 5)
        ctx.addIssue({
          code: 'custom',
          path: ['customRating'],
          message: 'too_short',
        });
    } else {
      if (!state.rating)
        ctx.addIssue({
          code: 'custom',
          path: ['rating'],
          message: 'required',
        });
    }
  });

const DisclosureVisitAndRatingActionPage = () => {
  const { state } = useLocation();
  const disclosure: TDisclosure = state;

  const { formState, formErrors, setValue, handleSubmit } = useForm({
    schema,
    initalState: {
      isCustomRating: false,
      customRating: '',
      ratingNote: '',
      visitNote: '',
      visitReason: '',
      rating: null,
      visitResult: null,
    },
  });
  console.log({ formErrors });

  const navigate = useNavigate();

  const [updateDisclosureRating, { isLoading }] = disclosuresApi.useUpdateDisclosureMutation();

  const handleSave = async () => {
    const { isValid, result } = await handleSubmit();
    if (!isValid) return;

    try {
      const updateDto: TUpdateDisclosureVisitAndRatingDto = {
        id: disclosure.id,
        customRating: result.customRating || null,
        isCustomRating: result.isCustomRating,
        ratingId: result.rating?.id || null,
        ratingNote: result.ratingNote || null,
        visitNote: result.visitNote || null,
        visitReason: result.visitReason || null,
        visitResult: result.visitResult?.id || null,
      };

      if (updateDto.ratingId || updateDto.customRating) {
        updateDto.visitNote = null;
        updateDto.visitReason = null;
      } else {
        updateDto.ratingId = null;
        updateDto.ratingNote = null;
        updateDto.isCustomRating = false;
        updateDto.customRating = null;
      }

      const { error } = await updateDisclosureRating(updateDto);

      if (error) {
        notifyError(error);
      } else {
        navigate(-1);
        notifySuccess(STRINGS.edited_successfully);
      }
    } catch (error: any) {
      notifyError(error);
    }
  };

  useEffect(() => {
    if (disclosure) {
      setValue({
        customRating: disclosure.customRating ?? '',
        isCustomRating: disclosure.isCustomRating,
        rating: disclosure.rating ?? null,
        ratingNote: disclosure.ratingNote ?? '',
        visitNote: disclosure.visitNote ?? '',
        visitReason: disclosure.visitReason ?? '',
        visitResult: disclosure.visitResult
          ? {
              id: disclosure.visitResult,
              label: STRINGS[disclosure.visitResult],
            }
          : null,
      });
    }
  }, [disclosure, setValue]);

  return (
    <Card>
      <Stack gap={2}>
        <DisclosureVisitResultAutocomplete
          required
          multiple={false}
          value={formState.visitResult}
          onChange={(visitResult) => setValue({ visitResult })}
          errorText={formErrors.visitResult?.[0].message}
        />
        {formState.visitResult && formState.visitResult?.id !== 'completed' && (
          <>
            <FormTextAreaInput
              required
              label={STRINGS.visit_reason}
              value={formState.visitReason}
              onChange={(visitReason) => setValue({ visitReason })}
              errorText={formErrors.visitReason?.[0].message}
            />
            <FormTextAreaInput
              label={STRINGS.note}
              value={formState.visitNote}
              onChange={(visitNote) => setValue({ visitNote })}
            />
          </>
        )}
        {formState.visitResult?.id === 'completed' && (
          <>
            <FormCheckbxInput
              label={STRINGS.custom_rating}
              value={formState.isCustomRating}
              onChange={(isCustomRating) => setValue({ isCustomRating })}
            />
            {formState.isCustomRating ? (
              <FormTextAreaInput
                required
                label={STRINGS.the_custom_rating}
                value={formState.customRating}
                onChange={(customRating) => setValue({ customRating })}
                errorText={formErrors.customRating?.[0].message}
              />
            ) : (
              <RatingsAutocomplete
                multiple={false}
                required
                value={formState.rating}
                onChange={(rating) => setValue({ rating })}
                errorText={formErrors.rating?.[0].message}
              />
            )}

            <FormTextAreaInput
              label={STRINGS.note}
              value={formState.ratingNote}
              onChange={(ratingNote) => setValue({ ratingNote })}
            />
          </>
        )}

        <ActionFab color="success" icon={<Save />} disabled={isLoading} onClick={handleSave} />
        {isLoading && <LoadingOverlay />}
      </Stack>
    </Card>
  );
};

export default DisclosureVisitAndRatingActionPage;

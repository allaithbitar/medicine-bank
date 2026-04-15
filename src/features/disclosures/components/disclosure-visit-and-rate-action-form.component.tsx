import FormTextAreaInput from '@/core/components/common/inputs/form-text-area-input.component';
import STRINGS from '@/core/constants/strings.constant';
import useForm, { type TFormSubmitResult } from '@/core/hooks/use-form.hook';
import { Card, Stack, Alert, Box } from '@mui/material';
import { useEffect, useImperativeHandle, type Ref } from 'react';
import z from 'zod';
import type { TDisclosureRating, TDisclosureVisitResult, TVisit } from '../types/disclosure.types';
import DisclosureVisitResultAutocomplete from './disclosure-visit-result-autocomplete.component';
import Header from '@/core/components/common/header/header';
import FormCheckbxInput from '@/core/components/common/inputs/form-checkbox-input.component';
import RatingsAutocomplete from '@/features/ratings/components/ratings-autocomplete.component';
import type { TRating } from '@/features/ratings/types/rating.types';
import { useDisclosureConsultationsLoader } from '../hooks/disclosure-consultations-loader.hook';
import Calendar from '@/features/appointments/components/calendar/calendar.component';
import WarningNotice from '@/core/components/common/warning-notice/warning-notice.component';
import { notifyInfo } from '@/core/components/common/toast/toast';

const defaultRatingData = {
  rating: null,
  isCustomRating: false,
  customRating: '',
  ratingNote: '',
};

const schema = z
  .object({
    visitResult: z.custom<{
      id: NonNullable<TDisclosureVisitResult>;
      label: string;
    } | null>((data) => !!data, { message: STRINGS.schema_required }),

    visitReason: z.string().optional(),
    visitNote: z.string().optional(),
    rating: z.custom<TRating | null>().optional(),
    isCustomRating: z.boolean().optional(),
    customRating: z.string().optional(),
    ratingNote: z.string().optional(),
    appointmentDate: z.string().optional(),
  })
  .superRefine((state, ctx) => {
    const resultId = state.visitResult?.id;

    if (resultId !== 'completed') {
      if (!state.visitReason || String(state.visitReason).trim() === '') {
        ctx.addIssue({
          code: 'custom',
          path: ['visitReason'],
          message: STRINGS.schema_required,
        });
      }
      return;
    }

    if (state.isCustomRating) {
      if (!state.customRating || String(state.customRating).trim() === '') {
        ctx.addIssue({
          code: 'custom',
          path: ['customRating'],
          message: STRINGS.schema_required,
        });
      } else if (state.customRating.length < 5) {
        ctx.addIssue({
          code: 'custom',
          path: ['customRating'],
          message: 'too_short',
        });
      }
    } else {
      if (!state.rating) {
        ctx.addIssue({
          code: 'custom',
          path: ['rating'],
          message: STRINGS.schema_required,
        });
      }
    }
  });

export type TDisclosureVisitAndRateFormHandlers = {
  handleSubmit: () => Promise<TFormSubmitResult<z.infer<typeof schema>>>;
};

type TProps = {
  ref: Ref<TDisclosureVisitAndRateFormHandlers>;
  disclosureVisitRateData?: TDisclosureRating & TVisit;
  disclosureId: string;
};

const DisclosureVisitAndRateActionForm = ({ ref, disclosureVisitRateData, disclosureId }: TProps) => {
  const { formState, formErrors, setValue, handleSubmit, setFormState } = useForm({
    schema,
    initalState: {
      visitResult: null,
      visitReason: '',
      visitNote: '',
      appointmentDate: '',
      ...defaultRatingData,
    },
  });
  //  { items: groups = [] } = { items: [] },
  const { items: adviserConsultations, isFetching: isFetchingConsultations } = useDisclosureConsultationsLoader({
    disclosureId,
    consultationStatus: 'pending',
  });

  useImperativeHandle(
    ref,
    () => ({
      handleSubmit() {
        return handleSubmit();
      },
    }),
    [handleSubmit]
  );

  useEffect(() => {
    if (disclosureVisitRateData) {
      setFormState({
        visitResult: disclosureVisitRateData.visitResult
          ? {
              id: disclosureVisitRateData.visitResult,
              label: STRINGS[disclosureVisitRateData.visitResult as keyof typeof STRINGS],
            }
          : null,
        visitReason: disclosureVisitRateData.visitReason ?? '',
        visitNote: disclosureVisitRateData.visitNote ?? '',
        isCustomRating: disclosureVisitRateData?.isCustomRating,
        customRating: disclosureVisitRateData.customRating ?? '',
        ratingNote: disclosureVisitRateData.ratingNote ?? '',
        rating: disclosureVisitRateData.rating,
        appointmentDate: (disclosureVisitRateData as any).appointmentDate ?? '',
      });
    }
  }, [disclosureVisitRateData, setFormState]);

  const ratingEnabled =
    formState.visitResult?.id === 'completed' && !isFetchingConsultations && !adviserConsultations?.length;

  const appointmentEnabled = formState.visitResult?.id === 'completed';

  const handleSelectDate = ({ d, c }: { d: string; c?: number }) => {
    setValue({ appointmentDate: d });
    if (!!c && c >= 5) {
      notifyInfo(STRINGS.selected_date_cap_warning);
    }
  };

  return (
    <Stack gap={2}>
      <Card>
        <Header title={STRINGS.visit} showBackButton />
        <Stack gap={2}>
          <DisclosureVisitResultAutocomplete
            required
            multiple={false}
            value={formState.visitResult as any}
            onChange={(visitResult: any) => {
              setValue({ visitResult, ...defaultRatingData });
            }}
            errorText={formErrors.visitResult?.[0]?.message}
            filterOptions={(options) => options.filter((o) => o.id !== 'null')}
          />
          {formState.visitResult && formState.visitResult.id !== 'completed' && (
            <FormTextAreaInput
              required
              label={STRINGS.visit_reason}
              value={formState.visitReason}
              onChange={(visitReason) => setValue({ visitReason })}
              errorText={formErrors.visitReason?.[0]?.message}
            />
          )}
          <FormTextAreaInput
            label={STRINGS.note}
            value={formState.visitNote}
            onChange={(visitNote) => setValue({ visitNote })}
          />
        </Stack>
      </Card>
      {!ratingEnabled && (
        <Box>
          <Alert severity="info">{STRINGS.rating_available_when_visit_completed}</Alert>
        </Box>
      )}
      <Card
        sx={{
          opacity: ratingEnabled ? 1 : 0.6,
        }}
      >
        <Header title={STRINGS.rating} />

        <Stack gap={2}>
          <FormCheckbxInput
            label={STRINGS.custom_rating}
            value={formState.isCustomRating}
            onChange={(isCustomRating) => setValue({ isCustomRating, rating: null, customRating: '' })}
            disabled={!ratingEnabled}
          />

          {formState.isCustomRating ? (
            <FormTextAreaInput
              required={ratingEnabled}
              label={STRINGS.the_custom_rating}
              value={formState.customRating}
              onChange={(customRating) => setValue({ customRating })}
              errorText={formErrors.customRating?.[0]?.message}
              disabled={!ratingEnabled}
            />
          ) : (
            <RatingsAutocomplete
              multiple={false}
              required={ratingEnabled}
              value={formState.rating}
              onChange={(rating) => setValue({ rating })}
              errorText={formErrors.rating?.[0]?.message}
              disabled={!ratingEnabled}
            />
          )}

          <FormTextAreaInput
            label={STRINGS.note}
            value={formState.ratingNote}
            onChange={(ratingNote) => setValue({ ratingNote })}
            disabled={!ratingEnabled}
          />
        </Stack>
      </Card>
      {!appointmentEnabled && (
        <Box>
          <Alert severity="info">{STRINGS.appointment_available_when_visit_completed}</Alert>
        </Box>
      )}
      <Card
        sx={{
          opacity: appointmentEnabled ? 1 : 0.6,
          pointerEvents: appointmentEnabled ? 'auto' : 'none',
        }}
      >
        <Header title={STRINGS.appointment} />
        <Stack gap={2}>
          <Calendar selectedDate={formState.appointmentDate} onClick={(d, c) => handleSelectDate({ d, c })} />
          <WarningNotice title={STRINGS.warning} message={STRINGS.appointment_warning_message} variant="outlined" />
        </Stack>
      </Card>
    </Stack>
  );
};

export default DisclosureVisitAndRateActionForm;

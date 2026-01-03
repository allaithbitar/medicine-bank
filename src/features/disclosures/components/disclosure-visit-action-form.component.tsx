import FormTextAreaInput from '@/core/components/common/inputs/form-text-area-input.component';
import useForm, { type TFormSubmitResult } from '@/core/hooks/use-form.hook';
import { Card, Stack } from '@mui/material';
import { useImperativeHandle, type Ref } from 'react';
import z from 'zod';
import type { TDisclosureVisitResult, TVisit } from '../types/disclosure.types';
import Header from '@/core/components/common/header/header';
import STRINGS from '@/core/constants/strings.constant';

const schema = z
  .object({
    result: z.custom<{
      id: TDisclosureVisitResult;
      label: string;
    } | null>((data) => !!data, { message: 'required' }),
    reason: z.string(),
    note: z.string(),
  })
  .superRefine((state, ctx) => {
    if (state.result?.id !== 'completed' && !state.reason) {
      return ctx.addIssue({
        code: 'custom',
        path: ['reason'],
        message: 'required',
      });
    }
  });
export type TDisclosureVisitFormHandlers = {
  handleSubmit: () => Promise<TFormSubmitResult<z.infer<typeof schema>>>;
  formState: z.infer<typeof schema>;
};

type TProps = {
  ref: Ref<TDisclosureVisitFormHandlers>;
  disclosureVisitData?: TVisit;
};

const DisclosureVisitActionForm = ({ ref }: TProps) => {
  const { formState, formErrors, setValue, handleSubmit } = useForm({
    schema,
    initalState: {
      result: null,
      reason: '',
      note: '',
    },
  });

  useImperativeHandle(
    ref,
    () => ({
      handleSubmit() {
        return handleSubmit();
      },
      formState,
    }),
    [handleSubmit, formState]
  );

  // useEffect(() => {
  //   if (disclosureVisitData) {
  //     setFormState({
  //       result: {
  //         id: disclosureVisitData?.visitResult,
  //         label: STRINGS[disclosureVisitData?.visitResult],
  //       },
  //       reason: disclosureVisitData.visitReason ?? "",
  //       note: disclosureVisitData.visitNote ?? "",
  //     });
  //   }
  // }, [disclosureVisitData, setFormState]);

  return (
    <Card sx={{ px: 2, py: 1 }}>
      <Header title={STRINGS.visit} />
      <Stack gap={2}>
        {/*  <DisclosureVisitResultAutocomplete
          required
          multiple={false}
          value={formState.result}
          onChange={(result) => setValue({ result })}
          errorText={formErrors.result?.[0].message}
        /> */}
        {formState.result && formState.result?.id !== 'completed' && (
          <FormTextAreaInput
            required
            label={STRINGS.visit_reason}
            value={formState.reason}
            onChange={(reason) => setValue({ reason })}
            errorText={formErrors.reason?.[0].message}
          />
        )}
        <FormTextAreaInput label={STRINGS.note} value={formState.note} onChange={(note) => setValue({ note })} />
      </Stack>
    </Card>
  );
};

export default DisclosureVisitActionForm;

import useForm, { type TFormSubmitResult } from "@/core/hooks/use-form.hook";

import { Stack } from "@mui/material";
import z from "zod";
import { type TDisclosure } from "../types/disclosure.types";
import STRINGS from "@/core/constants/strings.constant";
import { useEffect, useImperativeHandle, type Ref } from "react";
import FormTextAreaInput from "@/core/components/common/inputs/form-text-area-input.component";

const createDisclosureDetailsSchema = () =>
  z.object({
    residential: z.string().optional(),
    expenses: z.string().optional(),
    home_condition: z.string().optional(),
    electricity: z.string().optional(),
    pons: z.string().optional(),
    cons: z.string().optional(),
  });

export type TDisclosureDetailsFormHandlers = {
  handleSubmit: () => Promise<
    TFormSubmitResult<z.infer<ReturnType<typeof createDisclosureDetailsSchema>>>
  >;
};

type TProps = {
  ref: Ref<TDisclosureDetailsFormHandlers>;
  disclosureData?: TDisclosure;
};

const DisclosureDetailsActionForm = ({ ref, disclosureData }: TProps) => {
  const { formState, setValue, handleSubmit, setFormState } = useForm({
    schema: createDisclosureDetailsSchema(),
    initalState: {
      // electricity: undefined,
      // expenses: undefined,
      // homeCondition: undefined,
      // residential: undefined,
      // cons: undefined,
      // pons: undefined,
    },
  });

  useEffect(() => {
    if (disclosureData?.details) {
      setFormState(disclosureData?.details);
    }
  }, [disclosureData?.details, setFormState]);

  useImperativeHandle(
    ref,
    () => ({
      handleSubmit() {
        return handleSubmit();
      },
    }),
    [handleSubmit]
  );

  return (
    <Stack gap={2}>
      <FormTextAreaInput
        label={STRINGS.residential}
        name="residential"
        value={formState.residential}
        onChange={(v) => setValue({ residential: v })}
      />
      <FormTextAreaInput
        label={STRINGS.expenses}
        name="expenses"
        value={formState.expenses}
        onChange={(v) => setValue({ expenses: v })}
      />
      <FormTextAreaInput
        label={STRINGS.home_condition}
        name="home_condition"
        value={formState.home_condition}
        onChange={(v) => setValue({ home_condition: v })}
      />
      <FormTextAreaInput
        label={STRINGS.electricity}
        name="electricity"
        value={formState.electricity}
        onChange={(v) => setValue({ electricity: v })}
      />
      <FormTextAreaInput
        label={STRINGS.pons}
        name="pons"
        value={formState.pons}
        onChange={(v) => setValue({ pons: v })}
      />
      <FormTextAreaInput
        label={STRINGS.cons}
        name="cons"
        value={formState.cons}
        onChange={(v) => setValue({ cons: v })}
      />
    </Stack>
  );
};

export default DisclosureDetailsActionForm;

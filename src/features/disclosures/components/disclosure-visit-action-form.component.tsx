import FormTextAreaInput from "@/core/components/common/inputs/form-text-area-input.component";
import STRINGS from "@/core/constants/strings.constant";
import useForm, { type TFormSubmitResult } from "@/core/hooks/use-form.hook";
import { Card, Stack } from "@mui/material";
import { useEffect, useImperativeHandle, type Ref } from "react";
import z from "zod";
import type {
  TDisclosureVisit,
  TDisclosureVisitResult,
} from "../types/disclosure.types";
import DisclosureVisitResultAutocomplete from "./disclosure-visit-result-autocomplete.component";

const schema = z
  .object({
    result: z.custom<{
      id: TDisclosureVisitResult;
      label: string;
    } | null>((data) => !!data, { message: "required" }),
    reason: z.string(),
    note: z.string(),
  })
  .superRefine((state, ctx) => {
    if (state.result?.id !== "completed" && !state.reason) {
      return ctx.addIssue({
        code: "custom",
        path: ["reason"],
        message: "required",
      });
    }
  });
export type TDisclosureVisitFormHandlers = {
  handleSubmit: () => Promise<TFormSubmitResult<z.infer<typeof schema>>>;
};

type TProps = {
  ref: Ref<TDisclosureVisitFormHandlers>;
  disclosureVisitData?: TDisclosureVisit;
};

const DisclosureVisitActionForm = ({ ref, disclosureVisitData }: TProps) => {
  const { formState, formErrors, setValue, handleSubmit, setFormState } =
    useForm({
      schema,
      initalState: {
        result: null,
        reason: "",
        note: "",
      },
    });

  useImperativeHandle(
    ref,
    () => ({
      handleSubmit() {
        return handleSubmit();
      },
    }),
    [handleSubmit],
  );

  useEffect(() => {
    if (disclosureVisitData) {
      setFormState({
        result: {
          id: disclosureVisitData?.result,
          label: STRINGS[disclosureVisitData?.result],
        },
        reason: disclosureVisitData.reason ?? "",
        note: disclosureVisitData.note ?? "",
      });
    }
  }, [disclosureVisitData, setFormState]);

  return (
    <Card>
      <Stack gap={2}>
        <DisclosureVisitResultAutocomplete
          required
          multiple={false}
          value={formState.result}
          onChange={(result) => setValue({ result })}
          errorText={formErrors.result?.[0].message}
        />
        {formState.result && formState.result?.id !== "completed" && (
          <FormTextAreaInput
            required
            label={STRINGS.visit_reason}
            value={formState.reason}
            onChange={(reason) => setValue({ reason })}
            errorText={formErrors.reason?.[0].message}
          />
        )}
        <FormTextAreaInput
          label={STRINGS.note}
          value={formState.note}
          onChange={(note) => setValue({ note })}
        />
      </Stack>
    </Card>
  );
};

export default DisclosureVisitActionForm;

import FormCheckbxInput from "@/core/components/common/inputs/form-checkbox-input.component";
import FormTextAreaInput from "@/core/components/common/inputs/form-text-area-input.component";
import STRINGS from "@/core/constants/strings.constant";
import useForm, { type TFormSubmitResult } from "@/core/hooks/use-form.hook";
import RatingsAutocomplete from "@/features/ratings/components/ratings-autocomplete.component";
import type { TRating } from "@/features/ratings/types/rating.types";
import { Card, Stack } from "@mui/material";
import { useEffect, useImperativeHandle, type Ref } from "react";
import z from "zod";
import type { TDisclosureRating } from "../types/disclosure.types";
import Header from "@/core/components/common/header/header";

const schema = z
  .object({
    rating: z.custom<TRating | null>(),
    isCustomRating: z.boolean(),
    customRating: z.string(),
    note: z.string(),
  })
  .superRefine((state, ctx) => {
    if (state.isCustomRating) {
      if (!state.customRating)
        return ctx.addIssue({
          code: "custom",
          path: ["customRating"],
          message: "required",
        });
      if (state.customRating.length < 5)
        return ctx.addIssue({
          code: "custom",
          path: ["customRating"],
          message: "too_short",
        });
    } else {
      if (!state.rating)
        return ctx.addIssue({
          code: "custom",
          path: ["rating"],
          message: "required",
        });
    }
  });

export type TDisclosureRatingFormHandlers = {
  handleSubmit: () => Promise<TFormSubmitResult<z.infer<typeof schema>>>;
};

type TProps = {
  ref: Ref<TDisclosureRatingFormHandlers>;
  disclosureRatingData?: TDisclosureRating;
};

const DisclosureRatingActionForm = ({ ref, disclosureRatingData }: TProps) => {
  const { formState, formErrors, setValue, handleSubmit, setFormState } =
    useForm({
      schema,
      initalState: {
        rating: null,
        isCustomRating: false,
        customRating: "",
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
    [handleSubmit]
  );

  useEffect(() => {
    if (disclosureRatingData) {
      console.log(disclosureRatingData);

      setFormState({
        isCustomRating: disclosureRatingData?.isCustom,
        customRating: disclosureRatingData.customRating ?? "",
        note: disclosureRatingData.note ?? "",
        rating: disclosureRatingData.rating,
      });
    }
  }, [disclosureRatingData, setFormState]);

  return (
    <Card sx={{ px: 2, py: 1 }}>
      <Header title={STRINGS.rating} />
      <Stack gap={2}>
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
          value={formState.note}
          onChange={(note) => setValue({ note })}
        />
      </Stack>
    </Card>
  );
};

export default DisclosureRatingActionForm;

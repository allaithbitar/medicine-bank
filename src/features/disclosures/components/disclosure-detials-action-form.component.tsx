import useForm, { type TFormSubmitResult } from "@/core/hooks/use-form.hook";
import {
  Stack,
  Autocomplete,
  TextField,
  Typography,
  Divider,
  Card,
} from "@mui/material";
import z from "zod";
import { type TDisclosure } from "../types/disclosure.types";
import STRINGS from "@/core/constants/strings.constant";
import { useEffect, useImperativeHandle, type Ref } from "react";
import FormTextAreaInput from "@/core/components/common/inputs/form-text-area-input.component";
import theme from "@/core/theme/index.theme";

const HomeConditionStatusSchema = z
  .object({
    id: z.string(),
    label: z.string(),
  })
  .optional();

const createDisclosureDetailsSchema = () =>
  z.object({
    job_or_school: z.string().optional(),
    diseases_or_Surgeries: z.string().optional(),
    expenses: z.string().optional(),
    home_condition_status: HomeConditionStatusSchema,
    home_condition_note: z.string().optional(),
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
const HOME_CONDITION_OPTIONS = [
  {
    id: "bad",
    label: STRINGS.common_bad,
  },
  {
    id: "normal",
    label: STRINGS.common_normal,
  },
  {
    id: "good",
    label: STRINGS.common_good,
  },
  {
    id: "excellent",
    label: STRINGS.common_excellent,
  },
];

const DisclosureDetailsActionForm = ({ ref, disclosureData }: TProps) => {
  const { formState, setValue, handleSubmit, setFormState } = useForm({
    schema: createDisclosureDetailsSchema(),
    initalState: {
      home_condition_status: HOME_CONDITION_OPTIONS[1],
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
        label={STRINGS.diseases_or_Surgeries}
        name="diseases_or_Surgeries"
        value={formState.diseases_or_Surgeries}
        onChange={(v) => setValue({ diseases_or_Surgeries: v })}
      />

      <FormTextAreaInput
        label={STRINGS.job_or_school}
        name="job_or_school"
        value={formState.job_or_school}
        onChange={(v) => setValue({ job_or_school: v })}
      />

      <FormTextAreaInput
        label={STRINGS.electricity}
        name="electricity"
        value={formState.electricity}
        onChange={(v) => setValue({ electricity: v })}
      />

      <FormTextAreaInput
        label={STRINGS.expenses}
        name="expenses"
        value={formState.expenses}
        onChange={(v) => setValue({ expenses: v })}
      />
      <Divider />
      <Card sx={{ bgcolor: theme.palette.grey[100], p: 1 }}>
        <Stack sx={{ gap: 2 }}>
          <Typography>{STRINGS.home_condition}</Typography>
          <Autocomplete
            options={HOME_CONDITION_OPTIONS}
            value={formState.home_condition_status}
            onChange={(_, newValue) =>
              setValue({
                home_condition_status: newValue ?? HOME_CONDITION_OPTIONS[1],
              })
            }
            getOptionLabel={(option) => (option ? option.label : "")}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            renderInput={(params) => (
              <TextField
                {...params}
                label={STRINGS.home_condition}
                variant="outlined"
                size="small"
              />
            )}
            clearOnEscape
            freeSolo={false}
          />
          <FormTextAreaInput
            placeholder={`${STRINGS.note} ${STRINGS.home_condition}`}
            name="home_condition_note"
            value={formState.home_condition_note}
            onChange={(v) => setValue({ home_condition_note: v })}
          />
        </Stack>
      </Card>
      <Divider />

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

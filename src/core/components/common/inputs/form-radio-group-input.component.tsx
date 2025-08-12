import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
} from "@mui/material";
import RequiredLabel from "./required-label.component";
import type {
  TListItem,
  TSharedFormComponentProps,
  TSharedFormComponentValidation,
} from "@/core/types/input.type";

type Props = TSharedFormComponentProps<TListItem> &
  TSharedFormComponentValidation & {
    options?: TListItem[];
  };

const FormRadioGroupInput = ({
  label,
  helperText,
  value,
  onChange,
  required,
  options,
}: Props) => {
  return (
    <FormControl fullWidth>
      <RequiredLabel required={required}>{label}</RequiredLabel>
      <RadioGroup value={value?.id}>
        {options?.map((o) => (
          <FormControlLabel
            onClick={() => onChange?.(o)}
            value={o.id}
            control={<Radio />}
            label={o.id}
          />
        ))}
      </RadioGroup>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default FormRadioGroupInput;

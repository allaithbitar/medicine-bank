import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
} from "@mui/material";
import type {
  TListItem,
  TSharedFormComponentProps,
  TSharedFormComponentValidation,
} from "../../types";
import RequiredLabel from "../shared/required-label.component";

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
      <RadioGroup value={value?.value}>
        {options?.map((o) => (
          <FormControlLabel
            onClick={() => onChange?.(o)}
            value={o.value}
            control={<Radio />}
            label={o.label}
          />
        ))}
      </RadioGroup>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default FormRadioGroupInput;

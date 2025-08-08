import { FormControl, FormHelperText, OutlinedInput } from "@mui/material";
import type { ComponentProps } from "react";
import RequiredLabel from "./required-label.component";
import type { TSharedFormComponentProps } from "@/core/types/input.type";

type Props = Omit<ComponentProps<typeof OutlinedInput>, "value" | "onChange"> &
  TSharedFormComponentProps<string>;

const FormTextFieldInput = ({
  label,
  helperText,
  value,
  onChange,
  required,
  disabled,
  errorText,
  ...props
}: Props) => {
  return (
    <FormControl fullWidth disabled={disabled} error={!!errorText}>
      <RequiredLabel required={required}>{label ?? "Text Field"}</RequiredLabel>
      <OutlinedInput
        disabled={disabled}
        notched={false}
        fullWidth
        {...props}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
      {(errorText || helperText) && (
        <FormHelperText color="error">{errorText || helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

export default FormTextFieldInput;

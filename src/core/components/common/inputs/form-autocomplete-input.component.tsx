import type {
  TListItem,
  TSharedFormComponentProps,
  TSharedFormComponentValidation,
} from "@/core/types/input.type";
import {
  Autocomplete,
  FormControl,
  FormHelperText,
  TextField,
} from "@mui/material";
import type { ComponentProps } from "react";
import RequiredLabel from "./required-label.component";

type Props<
  T extends TListItem,
  V extends boolean = false,
  Y extends boolean = false,
> = Omit<
  ComponentProps<typeof Autocomplete<T, V, Y>>,
  "renderInput" | "options" | "value" | "onChange" | "multiple"
> &
  TSharedFormComponentValidation &
  Omit<TSharedFormComponentProps<TListItem>, "value" | "onChange"> & {
    options?: T[];
    textFieldProps?: ComponentProps<typeof TextField>;
    multiple?: V;
    onChange?: V extends true
      ? (value: T[]) => void
      : (value: T | null) => void;
    value?: V extends true ? T[] : T | null;
  };

function FormAutocompleteInput<
  T extends TListItem,
  V extends boolean = false,
  Y extends boolean = false,
>({
  label,
  helperText,
  textFieldProps,
  options,
  value,
  onChange,
  multiple,
  loading,
  disabled,
  errorText,
  required,
  ...props
}: Props<T, V, Y>) {
  return (
    <FormControl
      fullWidth
      error={!!errorText}
      disabled={disabled}
      sx={{
        opacity: disabled ? 0.7 : 1,
      }}
    >
      <RequiredLabel required={required}>{label}</RequiredLabel>
      <Autocomplete
        disabled={disabled}
        loading={loading}
        multiple={multiple}
        options={options ?? []}
        value={(multiple ? (Array.isArray(value) ? value : []) : value) as any}
        sx={{ width: "100%" }}
        {...props}
        onChange={(_, v) => onChange?.(v as any)}
        renderInput={(renderInputProps) => (
          <TextField
            error={!!errorText}
            {...renderInputProps}
            {...textFieldProps}
          />
        )}
      />
      {(errorText || helperText) && (
        <FormHelperText>{errorText || helperText}</FormHelperText>
      )}
    </FormControl>
  );
}

export default FormAutocompleteInput;

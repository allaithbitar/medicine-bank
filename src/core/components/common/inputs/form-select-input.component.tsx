import type { TListItem, TSharedFormComponentProps, TSharedFormComponentValidation } from '@/core/types/input.type';
import { FormControl, FormHelperText, MenuItem, Select, TextField } from '@mui/material';
import type { ComponentProps } from 'react';
import RequiredLabel from './required-label.component';
import STRINGS from '@/core/constants/strings.constant';

type Props<T extends TListItem> = Omit<ComponentProps<typeof Select<T>>, 'value' | 'onChange'> &
  TSharedFormComponentValidation &
  Omit<TSharedFormComponentProps<TListItem>, 'value' | 'onChange'> & {
    options?: T[];
    textFieldProps?: ComponentProps<typeof TextField>;
    onChange?: (value: string) => void;
    value?: string;
    getOptionLabel?: (option: T) => string;
    getOptionValue?: (option: T) => string | number;
  };

function FormSelectInput<T extends TListItem>({
  label,
  helperText,
  options,
  value,
  onChange,
  getOptionLabel,
  disabled,
  errorText,
  required,
  ...props
}: Props<T>) {
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
      <Select value={value} {...(props as any)}>
        <MenuItem value="" onClick={() => onChange?.('')}>
          {STRINGS.none}
        </MenuItem>

        {options?.map((o) => (
          <MenuItem value={o.id} onClick={() => onChange?.(o.id)}>
            {getOptionLabel?.(o)}
          </MenuItem>
        ))}
      </Select>
      {/*  <Autocomplete
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
      /> */}
      {(errorText || helperText) && <FormHelperText>{errorText || helperText}</FormHelperText>}
    </FormControl>
  );
}

export default FormSelectInput;

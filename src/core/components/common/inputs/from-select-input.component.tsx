import { FormControl, FormHelperText, MenuItem, Select } from "@mui/material";
import type { ComponentProps } from "react";
import type { TListItem, TSharedFormComponentProps } from "../../types";
import RequiredLabel from "../shared/required-label.component";

type Props = Omit<
  ComponentProps<typeof Select>,
  "value" | "onChange" | "multiple"
> &
  TSharedFormComponentProps<TListItem | null> & {
    options?: TListItem[];
  };

const FormSelectInput = ({
  label,
  helperText,
  value,
  onChange,
  options,
  required,
  ...props
}: Props) => {
  return (
    <FormControl fullWidth>
      <RequiredLabel required={required}>{label ?? "Text Field"}</RequiredLabel>
      <Select value={value?.value ?? ""} {...props}>
        {(options ?? []).map((o) => (
          <MenuItem key={o.value} value={o.value} onClick={() => onChange?.(o)}>
            {o.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default FormSelectInput;

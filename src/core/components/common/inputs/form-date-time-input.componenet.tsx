import { FormControl, FormHelperText } from "@mui/material";
import {
  DesktopDateTimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import type { ComponentProps } from "react";

import { isValid, parseISO } from "date-fns";
import type {
  TSharedFormComponentProps,
  TSharedFormComponentValidation,
} from "@/core/types/input.type";
import RequiredLabel from "./required-label.component";

type Props = Omit<
  ComponentProps<typeof DesktopDateTimePicker>,
  "value" | "onChange"
> &
  TSharedFormComponentProps<string> &
  TSharedFormComponentValidation;

const FormDateTimeInput = ({
  label,
  helperText,
  value,
  required,
  onChange,
  ...props
}: Props) => {
  return (
    <FormControl fullWidth>
      <RequiredLabel required={required}>{label ?? "Date Time"}</RequiredLabel>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DesktopDateTimePicker
          format={"yyyy-MM-dd hh:mm aa"}
          value={!!value && isValid(new Date(value)) ? parseISO(value) : null}
          onChange={(val) => onChange?.(val?.toISOString() ?? "")}
          {...props}
        />
      </LocalizationProvider>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default FormDateTimeInput;

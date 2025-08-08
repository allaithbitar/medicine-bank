import { FormControl, FormHelperText } from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import type { ComponentProps } from "react";
import { isValid, parseISO } from "date-fns";
import type {
  TSharedFormComponentProps,
  TSharedFormComponentValidation,
} from "@/core/types/input.type";
import RequiredLabel from "./required-label.component";

type Props = Omit<
  ComponentProps<typeof DesktopDatePicker>,
  "value" | "onChange"
> &
  TSharedFormComponentProps<string> &
  TSharedFormComponentValidation;

const FormDateInput = ({
  label,
  helperText,
  value,
  onChange,
  required,
  ...props
}: Props) => {
  return (
    <FormControl fullWidth>
      <RequiredLabel required={required}>{label ?? "Date"}</RequiredLabel>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DesktopDatePicker
          format={"yyyy-MM-dd"}
          value={!!value && isValid(new Date(value)) ? parseISO(value) : null}
          onChange={(val) => onChange?.(val?.toISOString() ?? "")}
          {...props}
        />
      </LocalizationProvider>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default FormDateInput;

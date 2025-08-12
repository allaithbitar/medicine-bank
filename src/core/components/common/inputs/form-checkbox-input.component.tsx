import type { TSharedFormComponentProps } from "@/core/types/input.type";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
} from "@mui/material";
import type { ComponentProps } from "react";

type Props = Omit<ComponentProps<typeof Checkbox>, "value" | "onChange"> &
  TSharedFormComponentProps<boolean>;
const FormCheckbxInput = ({
  label,
  helperText,
  value,
  onChange,
  disabled,
  ...props
}: Props) => {
  return (
    <FormControl disabled={disabled}>
      <FormControlLabel
        sx={{ width: "100%" }}
        control={
          <Checkbox
            checked={value}
            onChange={(_, v) => onChange?.(v)}
            {...props}
          />
        }
        label={label ?? "Checkbox"}
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default FormCheckbxInput;

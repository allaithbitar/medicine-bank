import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
} from "@mui/material";
import type { ComponentProps } from "react";
import type { TSharedFormComponentProps } from "../../types";

type Props = Omit<ComponentProps<typeof Checkbox>, "value" | "onChange"> &
  TSharedFormComponentProps<boolean>;
const FormCheckbxInput = ({
  label,
  helperText,
  value,
  onChange,
  ...props
}: Props) => {
  return (
    <FormControl>
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

import type { ComponentProps } from "react";
import FormTextFieldInput from "./form-text-field-input.component";
import type { TSharedFormComponentProps } from "@/core/types/input.type";

type Props = Omit<
  ComponentProps<typeof FormTextFieldInput>,
  "value" | "onChange"
> &
  TSharedFormComponentProps<number | string> & {
    allowDecimals?: boolean;
  };

function FormNumberInput({
  onChange,
  value,
  allowDecimals = false,
  ...props
}: Props) {
  return (
    <FormTextFieldInput
      {...props}
      label={props.label ?? "Number Input"}
      value={value as any}
      onChange={(value) => {
        let _val: string | number = value;

        const isEmpty = _val.trim() === "";
        const isNumber = !isNaN(Number(_val));
        if (isEmpty) return onChange?.("");
        if (!allowDecimals) {
          _val = parseInt(_val);
        }
        if (isNumber) onChange?.(Number(isEmpty ? null : Number(_val)));
      }}
    />
  );
}

export default FormNumberInput;

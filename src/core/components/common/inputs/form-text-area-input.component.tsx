import type { ComponentProps } from "react";
import FormTextFieldInput from "./form-text-field-input.component";

type Props = ComponentProps<typeof FormTextFieldInput>;

const FormTextAreaInput = ({ rows = 5, ...props }: Props) => {
  return (
    <FormTextFieldInput {...props} label={props.label} multiline rows={rows} />
  );
};

export default FormTextAreaInput;

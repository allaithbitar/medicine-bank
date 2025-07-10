import type { IOptions } from "@/core/types/common.types";
import type { AutocompleteProps } from "@mui/material";

export interface IWorkArea {
  id: string;
  name: string;
  city: string;
  employeeCount: number;
  createdDate: string;
}

export interface IOcrMappingAutoCompleteProps {
  value: IOptions | null;
  onChange: (value: IOptions | null) => void;
  autoCompleteProps?: Partial<AutocompleteProps<IOptions, false, false, false>>;
  defaultValueId?: string;
  helperText?: string;
  textFieldError?: boolean;
}

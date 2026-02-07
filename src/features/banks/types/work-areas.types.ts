import type { IOptions } from '@/core/types/common.types';
import type { AutocompleteProps } from '@mui/material';
import type { TCity } from './city.types';

export type TArea = {
  id: string;
  name: string;
  cityId: string;
};

export type TAddWorkAreaPayload = {
  name: string;
  cityId: string;
};

export type TUpdateWorkAreaPayload = {
  id: string;
  name: string;
  cityId: string;
};

export interface IOcrMappingAutoCompleteProps {
  value: IOptions | null;
  onChange: (value: IOptions | null) => void;
  autoCompleteProps?: Partial<AutocompleteProps<IOptions, false, false, false>>;
  defaultValueId?: string;
  helperText?: string;
  textFieldError?: boolean;
}

export type TAreaWithData = TArea & { city?: TCity; patientsCount?: number };

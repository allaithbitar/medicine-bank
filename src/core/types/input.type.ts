export interface TListItem {
  id: string;
}

export type TSharedFormComponentProps<T> = {
  label?: string;
  helperText?: string;
  value?: T;
  onChange?: (value: T) => void;
  disabled?: boolean;
  loading?: boolean;
  errorText?: string;
};

export type TSharedFormComponentValidation = {
  required?: boolean;
};

export type ITextFormComponentValidation = {
  minLength?: number;
  maxLength?: number;
};

export type TNumberFormComponentValidation = {
  minValue?: number;
  maxValue?: number;
};

export type TDateFormComponentValidation = {
  maxDate?: string;
  minDate?: string;
};

type StaticSourceOptions = {
  items: TListItem[];
};

type LookupSourceOptions = {
  items: TListItem[];
  lookupId: string;
};

type SourceConfig =
  | {
      sourceType: "static";
      sourceOptions: StaticSourceOptions;
    }
  | {
      sourceType: "lookup";
      sourceOptions: LookupSourceOptions;
    };

export type TAutocompleteFormComponentProps = {
  type: "autocomplete";
  config: { isMulti: boolean } & SourceConfig;
};

export type ITextFormComponentProps = {
  type: "text-field";
  validation?: TSharedFormComponentValidation & ITextFormComponentValidation;
};

export type ITextAreaFormComponentProps = {
  type: "text-area";
  validation?: TSharedFormComponentValidation & ITextFormComponentValidation;
  config?: {
    rows?: number;
  };
};

export type TNumberFormComponentProps = {
  type: "number";
  validation?: TSharedFormComponentValidation & TNumberFormComponentValidation;
};

export type TDateFormComponentProps = {
  type: "date";
  validation?: TSharedFormComponentValidation & TDateFormComponentValidation;
};

export type TDateTimeFormComponentProps = {
  type: "date-time";
  validation?: TSharedFormComponentValidation & TDateFormComponentValidation;
};

export type TRadioGroupFormComponentProps = {
  type: "radio-group";
  validation: TSharedFormComponentValidation;
  config?: Omit<TAutocompleteFormComponentProps["config"], "isMulti">;
};

export type TSelectFormComponentProps = {
  type: "select";
  validation: TSharedFormComponentValidation;
  config: Omit<TAutocompleteFormComponentProps["config"], "isMulti">;
};

export type TFormComponent = {
  enLabel: string;
  arLabel: string;
  description: string;
  id: string;
  layout: {
    columnSize: number;
  };
  disabled?: boolean;
  hidden?: boolean;
  conditons?: TCondition[];
  validation?: TSharedFormComponentValidation;
} & (
  | ITextFormComponentProps
  | ITextAreaFormComponentProps
  | TNumberFormComponentProps
  | TDateFormComponentProps
  | TDateTimeFormComponentProps
  | TRadioGroupFormComponentProps
  | {
      type: "checkbox";
    }
  | TSelectFormComponentProps
  | TAutocompleteFormComponentProps
);

export type TConditionalActionType = "property" | "value";

export type TPropertyConditionAction = {
  type: "property";
  config: {
    propertyKey: "label" | "description" | "required" | "hidden" | "disabled";
    propertyValue: string | TListItem<string, boolean>;
    propertyType: "text-field" | "text-area" | "checkbox";
  };
};

export type TValueConditionAction = {
  type: "value";
  config: {
    newValue: string | number | TListItem<string, string | boolean>;
  };
};

export type TConditionAction = TPropertyConditionAction | TValueConditionAction;
export type TConditionalActionProperty =
  | "label"
  | "description"
  | "required"
  | "hidden"
  | "disabled"
  | "list_items";

export type TCondition = {
  id: string;
  when: string;
  operator: string;
  equalsValue: string | number | TListItem;
  actions: TConditionAction[];
};

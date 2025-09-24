import medicinesApi from "@/features/banks/api/medicines-api/medicines-api";
import type { TMedicine } from "@/features/banks/types/medicines.types";
import { useEffect, type ComponentProps } from "react";
import FormAutocompleteInput from "@/core/components/common/inputs/form-autocomplete-input.component";
import { getErrorMessage } from "@/core/helpers/helpers";
import STRINGS from "@/core/constants/strings.constant";

type TMedicinesAutocompleteProps = Partial<
  ComponentProps<typeof FormAutocompleteInput<TMedicine, false>>
> & {
  defaultValueId?: string;
};

const MedicinesAutocomplete = ({
  defaultValueId,
  ...props
}: TMedicinesAutocompleteProps) => {
  const {
    data: { items: medicines = [] } = { items: [] },
    isFetching,
    isLoading,
    error,
  } = medicinesApi.useGetMedicinesQuery({ name: "" });

  useEffect(() => {
    if (defaultValueId) {
      const dVal = medicines.find((m) => m.id === defaultValueId);
      if (dVal) {
        props.onChange?.(dVal);
      }
    }
    if (medicines.length > 0 && !props?.value && !defaultValueId) {
      props.onChange?.(medicines[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medicines]);

  return (
    <FormAutocompleteInput
      label={STRINGS.medicines}
      loading={isFetching || isLoading}
      getOptionKey={(option) => option.id}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      options={medicines}
      errorText={error ? getErrorMessage(error) : props.errorText || ""}
      {...props}
    />
  );
};

export default MedicinesAutocomplete;

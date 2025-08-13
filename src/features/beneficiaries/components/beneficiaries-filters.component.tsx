import { Stack } from "@mui/material";
import { useCallback, useImperativeHandle, useState, type Ref } from "react";
import STRINGS from "@/core/constants/strings.constant";
import type { TGetBeneficiariesDto } from "@/features/beneficiaries/types/beneficiary.types";
import AreasAutocomplete from "@/features/banks/components/work-areas/work-area-autocomplete/work-area-autocomplete.component";
import type { TArea } from "@/features/banks/types/work-areas.types";
import FormTextFieldInput from "@/core/components/common/inputs/form-text-field-input.component";
import { Search } from "@mui/icons-material";

export type TBeneficiariesFiltersHandlers = {
  getValues: () => Omit<TGetBeneficiariesDto, "pageSize" | "pageNumber">;
};

type TProps = {
  ref: Ref<TBeneficiariesFiltersHandlers>;
};

const BeneficiariesFilters = ({ ref }: TProps) => {
  const [filters, setFilters] = useState<{
    areas: TArea[];
    query: string;
  }>({
    areas: [],
    query: "",
  });

  const handleSubmit = useCallback(() => {
    const result: Omit<TGetBeneficiariesDto, "pageSize" | "pageNumber"> = {
      areaIds: filters.areas.map((a) => a.id),
      query: filters.query,
    };

    return result;
  }, [filters]);

  useImperativeHandle(
    ref,
    () => ({
      getValues() {
        return handleSubmit();
      },
    }),
    [handleSubmit],
  );

  return (
    <Stack gap={2}>
      <FormTextFieldInput
        placeholder={`${STRINGS.name}, ${STRINGS.national_number}, ${STRINGS.phone_numbers}, ${STRINGS.patient_address} ${STRINGS.patient_about}`}
        endAdornment={<Search />}
        value={filters.query}
        onChange={(query) => setFilters((prev) => ({ ...prev, query }))}
      />
      <AreasAutocomplete
        multiple
        value={filters.areas}
        onChange={(areas) => setFilters((prev) => ({ ...prev, areas }))}
      />

      {/*  <FieldSet label={STRINGS.created_at}>
        <Stack gap={1}>
          <FormDateInput
            label={STRINGS.from_date}
            value={filters.createdAtStart}
            onChange={(createdAtStart) =>
              setFilters((prev) => ({ ...prev, createdAtStart }))
            }
          />
          <FormDateInput
            label={STRINGS.to_date}
            value={filters.createdAtEnd}
            onChange={(createdAtEnd) =>
              setFilters((prev) => ({ ...prev, createdAtEnd }))
            }
          />
        </Stack>
      </FieldSet> */}
    </Stack>
  );
};

export default BeneficiariesFilters;

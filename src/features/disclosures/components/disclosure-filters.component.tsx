import { Stack } from "@mui/material";
import { useCallback, useImperativeHandle, useState, type Ref } from "react";
import type {
  TDisclosureStatus,
  TGetDisclosuresDto,
} from "../types/disclosure.types";
import DisclosureStatusAutocomplete from "./disclosure-status-autocomplete";
import FormDateInput from "@/core/components/common/inputs/form-date-input-component";
import STRINGS from "@/core/constants/strings.constant";
import FieldSet from "@/core/components/common/fieldset/fieldset.component";
import EmployeesAutocomplete from "@/features/employees/components/employees-autocomplete.component";
import { type TEmployee } from "@/features/employees/types/employee.types";
import PriorityDegreesAutocomplete from "@/features/priority-degres/components/priority-degees-autocomplete.component";
import type { TPriorityDegree } from "@/features/priority-degres/types/priority-degree.types";
import type { TRating } from "@/features/ratings/types/rating.types";
import RatingsAutocomplete from "@/features/ratings/components/ratings-autocomplete.component";
import type { TBenefieciary } from "@/features/beneficiaries/types/beneficiary.types";
import BeneficiariesAutocomplete from "@/features/beneficiaries/components/beneficiaries-autocomplete.component";

export type TDisclosureFiltesHandlers = {
  getValues: () => Omit<TGetDisclosuresDto, "pageSize" | "pageNumber">;
};

type TProps = {
  ref: Ref<TDisclosureFiltesHandlers>;
};

const DisclosureFilters = ({ ref }: TProps) => {
  const [filters, setFilters] = useState<
    {
      status: { id: TDisclosureStatus; label: string }[];
      employees: TEmployee[];
      priorityDegrees: TPriorityDegree[];
      ratings: TRating[];
      beneficiary: TBenefieciary | null;
    } & Pick<TGetDisclosuresDto, "createdAtStart" | "createdAtEnd">
  >({
    status: [],
    createdAtStart: "",
    createdAtEnd: "",
    employees: [],
    priorityDegrees: [],
    ratings: [],
    beneficiary: null,
  });

  const handleSubmit = useCallback(() => {
    const result: Omit<TGetDisclosuresDto, "pageSize" | "pageNumber"> = {
      employeeIds: filters.employees.map((e) => e.id),
      priorityIds: filters.priorityDegrees.map((pd) => pd.id),
      ratingIds: filters.ratings.map((r) => r.id),
      status: filters.status.map((s) => s.id),
    };
    if (filters.beneficiary) {
      result.patientId = filters.beneficiary.id;
    }

    if (filters.createdAtStart) {
      result.createdAtStart = filters.createdAtStart;
    }

    if (filters.createdAtEnd) {
      result.createdAtEnd = filters.createdAtEnd;
    }

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
      <DisclosureStatusAutocomplete
        multiple
        value={filters.status}
        onChange={(status) => setFilters((prev) => ({ ...prev, status }))}
      />

      <BeneficiariesAutocomplete
        multiple={false}
        value={filters.beneficiary}
        onChange={(beneficiary) =>
          setFilters((prev) => ({ ...prev, beneficiary }))
        }
      />

      <EmployeesAutocomplete
        roles={["scout"]}
        label={STRINGS.the_scout}
        multiple
        value={filters.employees}
        onChange={(employees) => setFilters((prev) => ({ ...prev, employees }))}
      />

      <PriorityDegreesAutocomplete
        multiple
        value={filters.priorityDegrees}
        onChange={(priorityDegrees) =>
          setFilters((prev) => ({ ...prev, priorityDegrees }))
        }
      />
      <RatingsAutocomplete
        multiple
        value={filters.ratings}
        onChange={(ratings) => setFilters((prev) => ({ ...prev, ratings }))}
      />

      <FieldSet label={STRINGS.created_at}>
        <Stack direction="row" alignItems="center" gap={1}>
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
      </FieldSet>
    </Stack>
  );
};

export default DisclosureFilters;

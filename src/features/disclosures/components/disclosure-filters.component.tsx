import { Stack } from "@mui/material";

import { useCallback, useImperativeHandle, type Ref } from "react";
import type {
  TDisclosureStatus,
  TDisclosureType,
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
import FormCheckbxInput from "@/core/components/common/inputs/form-checkbox-input.component";
import DisclosureTypeAutocomplete from "./disclosure-type-autocomplete.component";
import useStorage from "@/core/hooks/use-storage.hook";
import FormSelectInput from "@/core/components/common/inputs/form-select-input.component";

const parseStringBooleanValue = (value: "true" | "false" | string) => {
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
};

type TNormalizedFormValues = Omit<
  TGetDisclosuresDto,
  "pageSize" | "pageNumber"
>;

export type TDisclosureFiltesHandlers = {
  getValues: () => TNormalizedFormValues;
  reset: () => void;
};

type TProps = {
  ref: Ref<TDisclosureFiltesHandlers>;
};

const defaultValues = {
  status: [],
  type: [],
  createdAtStart: "",
  createdAtEnd: "",
  scouts: [],
  priorityDegrees: [],
  ratings: [],
  beneficiary: null,
  undelivered: false,
  isCustomRating: false,
  isAppointmentCompleted: "",
  isReceived: "",
  appointmentDate: "",
};

const DisclosureFilters = ({ ref }: TProps) => {
  const [filters, setFilters] = useStorage<
    {
      type: { id: TDisclosureType; label: string }[];
      status: { id: TDisclosureStatus; label: string }[];
      scouts: TEmployee[];
      priorityDegrees: TPriorityDegree[];
      ratings: TRating[];
      isCustomRating: boolean;
      beneficiary: TBenefieciary | null;
      undelivered: boolean;
      appointmentDate: string;
      isAppointmentCompleted: string;
      isReceived: string;
    } & Pick<TGetDisclosuresDto, "createdAtStart" | "createdAtEnd">
  >("disclosure-filters", defaultValues);

  const handleSubmit = useCallback(() => {
    const result: TNormalizedFormValues = {
      scoutIds: filters.scouts.map((e) => e.id),
      priorityIds: filters.priorityDegrees.map((pd) => pd.id),
      ratingIds: filters.ratings.map((r) => r.id),
      status: filters.status.map((s) => s.id),
      type: filters.type.map((s) => s.id),
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
    result.undelivered = filters.undelivered;

    if (result.appointmentDate)
      result.appointmentDate = filters.appointmentDate;

    if (parseStringBooleanValue(filters.isAppointmentCompleted) !== null)
      result.isAppointmentCompleted = parseStringBooleanValue(
        filters.isAppointmentCompleted,
      ) as boolean;

    if (parseStringBooleanValue(filters.isReceived) !== null)
      result.isReceived = parseStringBooleanValue(
        filters.isReceived,
      ) as boolean;

    if (filters.isCustomRating) result.isCustomRating = filters.isCustomRating;

    // if (filters.isReceived) result.isReceived = filters.isReceived;

    return result;
  }, [filters]);

  const handleReset = useCallback(() => {
    setFilters(defaultValues);
  }, [setFilters]);

  useImperativeHandle(
    ref,
    () => ({
      getValues() {
        return handleSubmit();
      },
      reset() {
        return handleReset();
      },
    }),
    [handleSubmit, handleReset],
  );

  return (
    <Stack gap={2}>
      <DisclosureTypeAutocomplete
        multiple
        value={filters.type}
        onChange={(type) => setFilters((prev) => ({ ...prev, type }))}
      />

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
      <FormCheckbxInput
        label={STRINGS.undelivered}
        value={filters.undelivered}
        onChange={(undelivered) =>
          setFilters((prev) => ({ ...prev, undelivered }))
        }
      />

      <EmployeesAutocomplete
        disabled={filters.undelivered}
        roles={["scout"]}
        label={STRINGS.the_scout}
        multiple
        value={filters.scouts}
        onChange={(employees) =>
          setFilters((prev) => ({ ...prev, scouts: employees }))
        }
      />

      <PriorityDegreesAutocomplete
        multiple
        value={filters.priorityDegrees}
        onChange={(priorityDegrees) =>
          setFilters((prev) => ({ ...prev, priorityDegrees }))
        }
      />
      <RatingsAutocomplete
        disabled={filters.isCustomRating}
        multiple
        value={filters.ratings}
        onChange={(ratings) => setFilters((prev) => ({ ...prev, ratings }))}
      />
      <FormCheckbxInput
        label={STRINGS.custom_rating}
        value={filters.isCustomRating}
        onChange={(value) => {
          setFilters((prev) => ({
            ...prev,
            isCustomRating: value,
            ...(value && { ratings: [] }),
          }));
        }}
      />

      <FieldSet label={STRINGS.created_at}>
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
      </FieldSet>

      <FormDateInput
        label={STRINGS.appointment_date}
        value={filters.appointmentDate}
        onChange={(appointmentDate) =>
          setFilters((prev) => ({ ...prev, appointmentDate }))
        }
      />

      <FormSelectInput
        label={"is_appointment_completed"}
        value={filters.isAppointmentCompleted}
        getOptionLabel={(option) => option.label}
        onChange={(value) => {
          setFilters((prev) => ({
            ...prev,
            isAppointmentCompleted: value,
          }));
        }}
        options={[
          { id: "true", label: "true" },
          { id: "false", label: "false" },
        ]}
      />

      {/* <FormCheckbxInput */}
      {/*   label="is_received" */}
      {/*   value={filters.isReceived} */}
      {/*   onChange={(value) => { */}
      {/*     setFilters((prev) => ({ */}
      {/*       ...prev, */}
      {/*       isReceived: value, */}
      {/*     })); */}
      {/*   }} */}
      {/* /> */}

      <FormSelectInput
        label={"is_received"}
        value={filters.isReceived}
        getOptionLabel={(option) => option.label}
        onChange={(value) => {
          setFilters((prev) => ({
            ...prev,
            isReceived: value,
          }));
        }}
        options={[
          { id: "true", label: "true" },
          { id: "false", label: "false" },
        ]}
      />
    </Stack>
  );
};

export default DisclosureFilters;

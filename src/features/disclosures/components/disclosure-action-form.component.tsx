import useForm, { type TFormSubmitResult } from "@/core/hooks/use-form.hook";
import { Stack } from "@mui/material";
import z from "zod";
import DisclosureStatusAutocomplete from "./disclosure-status-autocomplete";
import {
  DisclosureStatus,
  type TDisclosure,
  type TDisclosureStatus,
} from "../types/disclosure.types";
import STRINGS from "@/core/constants/strings.constant";
import EmployeesAutocomplete from "@/features/employees/components/employees-autocomplete.component";
import type { TEmployee } from "@/features/employees/types/employee.types";
import PriorityDegreesAutocomplete from "@/features/priority-degres/components/priority-degees-autocomplete.component";
import type { TPriorityDegree } from "@/features/priority-degres/types/priority-degree.types";
import { useEffect, useImperativeHandle, type Ref } from "react";
import type { TBenefieciary } from "@/features/beneficiaries/types/beneficiary.types";
import BeneficiariesAutocomplete from "@/features/beneficiaries/components/beneficiaries-autocomplete.component";

const createDisclosureSchema = (beneficiaryAlreadyDefined = false) =>
  z
    .object({
      status: z.custom<{ id: TDisclosureStatus; label: string } | null>(
        (data) => !!data,
        {
          message: "required",
        },
      ),
      employee: z.custom<TEmployee | null>(),
      beneficiary: z.custom<TBenefieciary | null>(),
      priorityDegree: z.custom<TPriorityDegree | null>((data) => !!data, {
        message: "required",
      }),
    })
    .superRefine((state, ctx) => {
      if (!beneficiaryAlreadyDefined && !state.beneficiary) {
        ctx.addIssue({
          code: "custom",
          message: "required",
          path: ["beneficiary"],
        });
      }
    });

export type TDisclosureFormHandlers = {
  handleSubmit: () => Promise<
    TFormSubmitResult<z.infer<ReturnType<typeof createDisclosureSchema>>>
  >;
};

type TProps = {
  ref: Ref<TDisclosureFormHandlers>;
  disclosureData?: TDisclosure;
  beneficiaryAlreadyDefined?: boolean;
};

const DisclosureActionForm = ({
  ref,
  disclosureData,
  beneficiaryAlreadyDefined,
}: TProps) => {
  const { formState, formErrors, setValue, handleSubmit, setFormState } =
    useForm({
      schema: createDisclosureSchema(beneficiaryAlreadyDefined),
      initalState: {
        status: {
          id: DisclosureStatus.active,
          label: STRINGS.active,
        },
        priorityDegree: null,
        employee: null,
        beneficiary: null,
      },
    });

  useImperativeHandle(
    ref,
    () => ({
      handleSubmit() {
        return handleSubmit();
      },
    }),
    [handleSubmit],
  );

  useEffect(() => {
    if (disclosureData) {
      setFormState({
        beneficiary: disclosureData.patient,
        employee: disclosureData.employee
          ? ({
              id: disclosureData.employee?.id,
              name: disclosureData.employee.name,
            } as TEmployee)
          : null,
        priorityDegree: disclosureData.priority,
        status: {
          id: disclosureData.status,
          label: STRINGS[disclosureData.status],
        },
      });
    }
  }, [disclosureData, setFormState]);

  return (
    <Stack gap={2}>
      <DisclosureStatusAutocomplete
        required
        multiple={false}
        value={formState.status}
        onChange={(v) => setValue({ status: v })}
        errorText={formErrors.status?.[0].message}
      />
      <PriorityDegreesAutocomplete
        required
        multiple={false}
        value={formState.priorityDegree}
        onChange={(v) => setValue({ priorityDegree: v })}
        errorText={formErrors.priorityDegree?.[0].message}
      />

      {!beneficiaryAlreadyDefined && (
        <BeneficiariesAutocomplete
          required
          multiple={false}
          value={formState.beneficiary}
          onChange={(v) => setValue({ beneficiary: v })}
          errorText={formErrors.beneficiary?.[0].message}
        />
      )}
      <EmployeesAutocomplete
        roles={["scout"]}
        label={STRINGS.disclosure_scout}
        multiple={false}
        value={formState.employee}
        onChange={(v) => setValue({ employee: v })}
        errorText={formErrors.employee?.[0].message}
      />
    </Stack>
  );
};

export default DisclosureActionForm;

import useForm, { type TFormSubmitResult } from "@/core/hooks/use-form.hook";
import type { TEmployeeRole } from "@/features/accounts-forms/types/employee.types";
import z from "zod";
import EmployeeRoleAutocomplete from "./employee-role-autocomplete.component";
import { Stack } from "@mui/material";
import FormTextFieldInput from "@/core/components/common/inputs/form-text-field-input.component";
import STRINGS from "@/core/constants/strings.constant";
import type { TArea } from "@/features/banks/types/work-areas.types";
import type { TCity } from "@/features/banks/types/city.types";
import CitiesAutocomplete from "@/features/banks/components/work-areas/cities-autocomplete/cities-autocomplete.component";
import AreasAutocomplete from "@/features/banks/components/work-areas/work-area-autocomplete/work-area-autocomplete.component";
import { useEffect, useImperativeHandle, useState, type Ref } from "react";
import citiesApi from "@/features/banks/api/cities-api/cities.api";
import { useAppDispatch } from "@/core/store/root.store.types";
import workAreasApi from "@/features/banks/api/work-areas/work-areas.api";
import LoadingOverlay from "@/core/components/common/loading-overlay/loading-overlay";

const createEmployeeFormSchema = (optionalPassword = false) => {
  return z
    .object({
      role: z.custom<{ id: TEmployeeRole; label: string } | null>(
        (data) => !!data,
        {
          message: "Role is required",
        },
      ),
      name: z.string().min(5, { message: "too short" }),
      password: z.string(),
      phone: z.string().min(10, { message: "invalid" }),
      city: z.custom<TCity | null>(),
      area: z.custom<TArea | null>(),
    })
    .superRefine((state, ctx) => {
      if (
        (!optionalPassword && (!state.password || state.password.length < 8)) ||
        (optionalPassword && state.password && state.password.length < 8)
      ) {
        ctx.addIssue({
          code: "custom",
          message: "Weaka password",
          path: ["password"],
        });
      }
    });
};

export type TEmployeeFormHandlers = {
  handleSubmit: () => Promise<
    TFormSubmitResult<z.infer<ReturnType<typeof createEmployeeFormSchema>>>
  >;
};

type TProps = {
  ref: Ref<TEmployeeFormHandlers>;
  employeeData?: any;
};

const EmployeeActionForm = ({ ref, employeeData }: TProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { formState, setValue, formErrors, handleSubmit, setFormState } =
    useForm({
      schema: createEmployeeFormSchema(!!employeeData),
      initalState: {
        role: null,
        name: "",
        password: "",
        phone: "",
        city: null,
        area: null,
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

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (employeeData) {
      setIsLoading(true);
      (async () => {
        let _city: TCity | null = null;
        let _area: TArea | null = null;

        const cities = await dispatch(
          citiesApi.endpoints.getCities.initiate({}),
        ).unwrap();

        if (employeeData.area) {
          const areas = await dispatch(
            workAreasApi.endpoints.getWorkAreas.initiate({
              cityId: employeeData.area?.cityId,
              name: employeeData.area.name,
            }),
          ).unwrap();
          _area =
            areas.items.find((a) => a.id === employeeData.area.id) ?? null;
          console.log({ _area, areas });

          _city =
            cities.items.find((c) => c.id === employeeData.area.cityId) ?? null;
        }

        setFormState({
          name: employeeData.name,
          area: _area,
          city: _city,
          phone: employeeData.phone,
          role: {
            id: employeeData.role,
            label: STRINGS[employeeData.role as keyof typeof STRINGS],
          },
          password: "",
        });
      })();
      setIsLoading(false);
    }
  }, [dispatch, employeeData, setFormState]);
  console.log(formErrors);

  return (
    <Stack gap={2}>
      <FormTextFieldInput
        required
        label={STRINGS.name}
        value={formState.name}
        onChange={(v) => setValue({ name: v })}
        errorText={formErrors.name?.[0].message}
      />

      <FormTextFieldInput
        required
        label={STRINGS.phone_number}
        value={formState.phone}
        onChange={(v) => setValue({ phone: v })}
        errorText={formErrors.phone?.[0].message}
      />

      <FormTextFieldInput
        required
        label={STRINGS.password}
        value={formState.password}
        onChange={(v) => setValue({ password: v })}
        errorText={formErrors.password?.[0].message}
      />

      <EmployeeRoleAutocomplete
        required
        multiple={false}
        value={formState.role}
        onChange={(v) => setValue({ role: v })}
        errorText={formErrors.role?.[0].message}
      />
      <CitiesAutocomplete
        value={formState.city}
        onChange={(v) => setValue({ city: v })}
        errorText={formErrors.city?.[0].message}
      />
      <AreasAutocomplete
        multiple={false}
        cityId={formState.city?.id}
        value={formState.area}
        onChange={(v) => setValue({ area: v })}
        errorText={formErrors.area?.[0].message}
      />
      {isLoading && <LoadingOverlay />}
    </Stack>
  );
};

export default EmployeeActionForm;

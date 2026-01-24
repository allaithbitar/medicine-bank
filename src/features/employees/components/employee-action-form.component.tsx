import useForm, { type TFormSubmitResult } from '@/core/hooks/use-form.hook';
import type { TEmployeeRole } from '@/features/accounts-forms/types/employee.types';
import z from 'zod';
import EmployeeRoleAutocomplete from './employee-role-autocomplete.component';
import { Stack } from '@mui/material';
import FormTextFieldInput from '@/core/components/common/inputs/form-text-field-input.component';
import STRINGS from '@/core/constants/strings.constant';
import CitiesAutocomplete from '@/features/banks/components/cities/cities-autocomplete/cities-autocomplete.component';
import AreasAutocomplete from '@/features/banks/components/work-areas/work-area-autocomplete/work-area-autocomplete.component';
import { useEffect, useImperativeHandle, useState, type Ref } from 'react';
import citiesApi from '@/features/banks/api/cities-api/cities.api';
import { useAppDispatch } from '@/core/store/root.store.types';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import type { TEmployee } from '../types/employee.types';
import type { TAutocompleteItem } from '@/core/types/common.types';

const createEmployeeFormSchema = (optionalPassword = false) => {
  return z
    .object({
      role: z.custom<{ id: TEmployeeRole; label: string } | null>((data) => !!data, {
        message: 'Role is required',
      }),
      name: z.string().min(5, { message: 'too short' }),
      password: z.string(),
      phone: z.string().min(10, { message: 'invalid' }),
      city: z.custom<TAutocompleteItem | null>(),
      areas: z.custom<TAutocompleteItem[]>(),
    })
    .superRefine((state, ctx) => {
      if (
        (!optionalPassword && (!state.password || state.password.length < 8)) ||
        (optionalPassword && state.password && state.password.length < 8)
      ) {
        ctx.addIssue({
          code: 'custom',
          message: 'Weaka password',
          path: ['password'],
        });
      }
    });
};

export type TEmployeeFormHandlers = {
  handleSubmit: () => Promise<TFormSubmitResult<z.infer<ReturnType<typeof createEmployeeFormSchema>>>>;
};

type TProps = {
  ref: Ref<TEmployeeFormHandlers>;
  employeeData?: TEmployee;
};

const EmployeeActionForm = ({ ref, employeeData }: TProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { formState, setValue, formErrors, handleSubmit, setFormState } = useForm({
    schema: createEmployeeFormSchema(!!employeeData),
    initalState: {
      role: null,
      name: '',
      password: '',
      phone: '',
      city: null,
      areas: [],
    },
  });

  useImperativeHandle(
    ref,
    () => ({
      handleSubmit() {
        return handleSubmit();
      },
    }),
    [handleSubmit]
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (employeeData) {
      setIsLoading(true);
      (async () => {
        let _city: TAutocompleteItem | null = null;
        let _areas: TAutocompleteItem[] = [];

        const cities = await dispatch(citiesApi.endpoints.getCities.initiate({})).unwrap();
        const allCities = cities.pages.flatMap((page) => page.items);

        if (employeeData.areas) {
          _areas = employeeData.areas.map((a) => a.area);

          _city = allCities.find((c: any) => c.id === _areas[0]?.cityId) ?? null;
        }

        setFormState({
          name: employeeData.name,
          areas: _areas,
          city: _city,
          phone: employeeData.phone,
          role: {
            id: employeeData.role,
            label: STRINGS[employeeData.role as keyof typeof STRINGS],
          },
          password: '',
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
        multiple={false}
        value={formState.city}
        onChange={(v) => setValue({ city: v })}
        errorText={formErrors.city?.[0].message}
      />
      <AreasAutocomplete
        multiple={true}
        cityId={formState.city?.id}
        value={formState.areas}
        onChange={(v) => setValue({ areas: v })}
      />
      {isLoading && <LoadingOverlay />}
    </Stack>
  );
};

export default EmployeeActionForm;

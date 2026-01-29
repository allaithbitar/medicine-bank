import z from 'zod';
import { EMPLOYEE_ROLE } from '../types/employee.types';
import STRINGS from '@/core/constants/strings.constant';

const baseEmployeeSchema = z.object({
  name: z.string().min(3, STRINGS.schema_employee_name_short),
  phone: z
    .string()
    .min(10, STRINGS.schema_phone_digits)
    .regex(/^\+?[0-9\s-()]{7,20}$/, STRINGS.schema_invalid_phone_format),
  role: z.enum([EMPLOYEE_ROLE.manager, EMPLOYEE_ROLE.supervisor, EMPLOYEE_ROLE.scout]),
  workArea: z.any(),
});

export const employeeAccountSchema = baseEmployeeSchema
  .extend({
    password: z.string().min(6, STRINGS.schema_password_min),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: STRINGS.schema_passwords_mismatch,
    path: ['confirmPassword'],
  });

export const updateEmployeeAccountSchema = baseEmployeeSchema.extend({
  id: z.string().uuid(STRINGS.schema_invalid_id_format),
  password: z.string().min(6).optional(),
});

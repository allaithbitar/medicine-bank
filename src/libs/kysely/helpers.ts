import type { ExpressionBuilder, ReferenceExpression } from 'kysely';
import type { TLocalDb } from './schema';
import { jsonObjectFrom } from 'kysely/helpers/sqlite';

export function withCreatedBy<V extends keyof TLocalDb>(
  eb: ExpressionBuilder<TLocalDb, V>,
  ref: ReferenceExpression<TLocalDb, V>
) {
  return jsonObjectFrom(
    eb
      .selectFrom('employees')
      .select(['employees.id', 'employees.name'] as any)
      .whereRef(ref as any, '=', 'employees.id' as any)
  ).as('createdBy');
}

export function withUpdatedBy<V extends keyof TLocalDb>(
  eb: ExpressionBuilder<TLocalDb, V>,
  ref: ReferenceExpression<TLocalDb, V>
) {
  return jsonObjectFrom(
    eb
      .selectFrom('employees')
      .select(['employees.id', 'employees.name'] as any)
      .whereRef(ref as any, '=', 'employees.id' as any)
  ).as('updatedBy');
}

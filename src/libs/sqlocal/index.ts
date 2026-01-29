import { SQLocalKysely } from 'sqlocal/kysely';
import { Kysely } from 'kysely';
import type { TLocalDb } from '../kysely/schema';
import { SerializePlugin } from 'kysely-plugin-serialize';

const { dialect } = new SQLocalKysely({
  databasePath: 'mdc_bank_local.db',
  verbose: import.meta.env.DEV,
});

export const localDb = new Kysely<TLocalDb>({
  dialect,
  plugins: [new SerializePlugin()],
});

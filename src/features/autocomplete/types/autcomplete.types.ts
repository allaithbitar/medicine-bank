import type { TAutocompleteItem } from '@/core/types/common.types';
import type { TMedicine } from '@/features/banks/types/medicines.types';

export type TMedicinesAutocompleteItem = TAutocompleteItem & Pick<TMedicine, 'doseVariants'>;

export interface FieldDiff {
  field: string;
  localValue: any;
  serverValue: any;
  hasConflict: boolean;
  displayName: string;
}

export function compareObjects(
  localData: Record<string, any>,
  serverData: Record<string, any>,
  fieldDisplayNames: Record<string, string>
): FieldDiff[] {
  const diffs: FieldDiff[] = [];
  const allFields = new Set([...Object.keys(localData), ...Object.keys(serverData)]);

  const excludeFields = ['id', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy'];

  allFields.forEach((field) => {
    if (excludeFields.includes(field)) return;

    const localValue = localData[field];
    const serverValue = serverData[field];

    const hasConflict = !isEqual(localValue, serverValue);

    diffs.push({
      field,
      localValue,
      serverValue,
      hasConflict,
      displayName: fieldDisplayNames[field] || field,
    });
  });

  // Sort: conflicts first, then alphabetically
  return diffs.sort((a, b) => {
    if (a.hasConflict && !b.hasConflict) return -1;
    if (!a.hasConflict && b.hasConflict) return 1;
    return a.displayName.localeCompare(b.displayName, 'ar');
  });
}

function isEqual(a: any, b: any): boolean {
  // Handle null/undefined
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a !== a && b !== b) return true;

  if (typeof a !== 'object' || typeof b !== 'object') {
    return a === b;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((val, idx) => isEqual(val, b[idx]));
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  return keysA.every((key) => isEqual(a[key], b[key]));
}

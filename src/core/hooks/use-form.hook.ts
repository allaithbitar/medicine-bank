import { useCallback, useState } from "react";
import { Schema, ZodError } from "zod";

type TFormErrors<T> = Partial<
  Record<
    keyof T,
    Record<
      number,
      {
        message: string;
        code: string;
      }
    >
  >
>;

export type TFormSubmitResult<T> =
  | { isValid: false; result?: never; errors: TFormErrors<T> }
  | {
      isValid: true;
      errors?: never;
      result: T;
    };

async function validateFormAsync<T>({
  schema,
  values,
}: {
  schema: Schema;
  values: T;
}): Promise<TFormSubmitResult<T>> {
  try {
    const result = await schema.parseAsync(values);
    return { isValid: true, result: result as typeof values };
  } catch (error) {
    if (error instanceof ZodError) {
      const mappedErrors = error.issues.reduce(
        (acc, curr) => {
          const key = curr.path[0] as keyof TFormErrors<typeof values>;
          if (acc[key]) {
            acc[key] = {
              ...acc[key],
              [curr.path[1]]: {
                message: curr.message,
                code: curr.code,
              },
            };
          } else {
            acc[key] = {
              [curr.path[1] ?? 0]: {
                message: curr.message,
                code: curr.code,
              },
            };
          }
          return acc;
        },
        {} as TFormErrors<typeof values>,
      );

      return { isValid: false, errors: mappedErrors };
    }
    return { isValid: false, errors: error as any };
  }
}

function useForm<T extends Schema>({
  initalState,
  schema,
}: {
  schema: T;
  initalState: T["_type"];
}) {
  const [formState, setFormState] = useState(() => initalState);

  const [formErrors, setFormErrors] = useState<TFormErrors<typeof initalState>>(
    {} as any,
  );

  // useDebouncedEffect({
  //   func: async () => {
  //     setFormErrors(
  //       (await validateFormAsync({ schema, values: formState })).errors ?? {},
  //     );
  //   },
  //   deps: [formState],
  // });

  const handleSubmit = useCallback(async () => {
    const result = await validateFormAsync({ schema, values: formState });
    setFormErrors(result.errors ?? {});
    return result;
  }, [formState, schema]);

  const setValue = useCallback((dto: Partial<typeof initalState>) => {
    setFormState((prev) => ({ ...prev, ...dto }));
  }, []);

  return { formState, formErrors, handleSubmit, setFormState, setValue };
}

export default useForm;

import { AbstractControl } from '@angular/forms';
import { ZodError, ZodSchema } from 'zod';

export function zodValidator(
  schema: ZodSchema,
  key = 'zod',
  message = (error: ZodError) => error.issues[0].message
) {
  return (control: AbstractControl) => {
    const result = schema.safeParse(control.value);

    if (result.success) return null;

    return { [key]: message(result.error) };
  };
}
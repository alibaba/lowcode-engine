import { type Spec } from '@alilc/lowcode-shared';

const SCHEMA_VALIDATIONS_OPTIONS: Partial<
  Record<
    keyof Spec.Project,
    {
      valid: (value: any) => boolean;
      description: string;
    }
  >
> = {};

export function schemaValidation<K extends keyof Spec.Project>(key: K, value: Spec.Project[K]) {
  const validOption = SCHEMA_VALIDATIONS_OPTIONS[key];

  if (validOption) {
    const result = validOption.valid(value);

    if (!result) {
      throw Error(validOption.description);
    }
  }

  return true;
}

import { type Spec } from '@alilc/lowcode-shared';

interface ValidationRule<T> {
  valid: (value: T) => boolean;
  description: string;
}

type ValidOptionRecord = {
  [K in keyof Spec.Project]: ValidationRule<Spec.Project[K]>;
};

const SCHEMA_KEYS = [
  'version',
  'componentsMap',
  'componentsTree',
  'utils',
  'i18n',
  'constants',
  'css',
  'config',
  'meta',
  'router',
  'pages',
];

const SCHEMA_VALIDATIONS_OPTIONS: Partial<ValidOptionRecord> = {
  componentsMap: {
    valid(value) {
      return Array.isArray(value);
    },
    description: 'componentsMap 必须是一个数组',
  },
  componentsTree: {
    valid(value) {
      return Array.isArray(value);
    },
    description: 'componentsTree 必须是一个数组',
  },
};

export function schemaValidation<K extends keyof Spec.Project>(key: K, value: Spec.Project[K]) {
  if (!SCHEMA_KEYS.includes(key)) {
    return `schema 的字段名必须是${JSON.stringify(SCHEMA_KEYS)}中的一个`;
  }

  const validOption = SCHEMA_VALIDATIONS_OPTIONS[key];

  if (validOption) {
    const result = validOption.valid(value);
    if (!result) {
      return validOption.description;
    }
  }

  return true;
}

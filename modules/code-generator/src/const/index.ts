export const NATIVE_ELE_PKG = 'native';

export const CONTAINER_TYPE = {
  COMPONENT: 'Component',
  BLOCK: 'Block',
  PAGE: 'Page',
};

export const SUPPORT_SCHEMA_VERSION_LIST = ['0.0.1', '1.0.0'];

// built-in slot names which have been handled in ProjectBuilder
export const BUILTIN_SLOT_NAMES = [
  'pages',
  'components',
  'router',
  'entry',
  'appConfig',
  'buildConfig',
  'constants',
  'utils',
  'i18n',
  'globalStyle',
  'htmlEntry',
  'packageJSON',
  'demo',
];

export const isBuiltinSlotName = function (name: string) {
  return BUILTIN_SLOT_NAMES.includes(name);
};

export * from './file';
export * from './generator';

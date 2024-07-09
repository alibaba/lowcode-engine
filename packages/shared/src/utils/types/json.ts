export function getDefaultValue(type: string | string[] | undefined): any {
  const t = Array.isArray(type) ? (<string[]>type)[0] : <string>type;
  switch (t) {
    case 'boolean':
      return false;
    case 'number':
      return 0;
    case 'string':
      return '';
    case 'array':
      return [];
    case 'object':
      return {};
    default:
      return null;
  }
}

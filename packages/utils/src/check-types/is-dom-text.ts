export function isDOMText(data: any): data is string {
  return typeof data === 'string';
}

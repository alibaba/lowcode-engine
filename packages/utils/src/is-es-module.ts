export function isESModule(obj: any): obj is { [key: string]: any } {
  return obj && obj.__esModule;
}

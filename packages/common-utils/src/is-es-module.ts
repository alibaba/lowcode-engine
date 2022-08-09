export type ESModule = {
  __esModule: true;
  default: any;
};
export function isESModule(obj: any): obj is ESModule {
  return obj && obj.__esModule;
}

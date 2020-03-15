interface Window {
  __isDebug?: boolean;
  __newFunc?: (funcStr: string) => ((...args: any[]) => any);
}
declare interface MTopConfig {
  prefix?: string;
  subDomain?: string;
  mainDomain?: string;
  [index: string]: unknown;
}

declare module '@ali/universal-mtop' {
  const request: <T>(config: any) => Promise<{ data: T; ret: string[] }>;
  const config: (key: string, value: unknown) => void;
}

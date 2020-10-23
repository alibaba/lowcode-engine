export interface PackageJSON {
  name: string;
  version: string;
  description?: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  scripts?: Record<string, string>;
  engines?: Record<string, string>;
  repository?: {
    type: string;
    url: string;
  };
  private?: boolean;
}

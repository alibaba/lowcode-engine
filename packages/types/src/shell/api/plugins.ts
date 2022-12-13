export interface IPublicApiPlugins {
  register(
    pluginConfigCreator: (ctx: any, options: any) => any,
    options?: any,
    registerOptions?: any,
  ): Promise<void>;
}
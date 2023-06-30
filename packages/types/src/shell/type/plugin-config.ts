export interface IPublicTypePluginConfig {
  init(): Promise<void>;
  destroy?(): Promise<void>;
  exports?(): any;
}

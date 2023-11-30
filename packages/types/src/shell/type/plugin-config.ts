export interface IPublicTypePluginConfig {
  init(): Promise<void> | void;
  destroy?(): Promise<void> | void;
  exports?(): any;
}

export interface IPublicTypePluginConfig {
  init(): void;
  destroy?(): void;
  exports?(): any;
}

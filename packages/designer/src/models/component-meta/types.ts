export interface ComponentConfigure {
  /**
   * 属性面板配置
   */
  props?: IPublicTypeFieldConfig[];
  /**
   * 组件能力配置
   */
  component?: IPublicTypeComponentConfigure;
  /**
   * 通用扩展面板支持性配置
   */
  supports?: ConfigureSupport;
  /**
   * 高级特性配置
   */
  advanced?: IPublicTypeAdvanced;
}

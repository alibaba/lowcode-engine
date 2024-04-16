export interface PluginInstance {
  init(): Promise<void> | void;
  destroy?(): Promise<void> | void;
  exports?(): any;
}

export interface PluginMeta {
  /**
   * define dependencies which the plugin depends on
   */
  dependencies?: string[];

  /**
   * specify which engine version is compatible with the plugin
   */
  engines?: {
    /** e.g. '^1.0.0' */
    lowcodeEngine?: string;
  };

  preferenceDeclaration?: PluginDeclaration;

  /**
   * use 'common' as event prefix when eventPrefix is not set.
   * strongly recommend using pluginName as eventPrefix
   *
   * eg.
   *   case 1, when eventPrefix is not specified
   *        event.emit('someEventName') is actually sending event with name 'common:someEventName'
   *
   *   case 2, when eventPrefix is 'myEvent'
   *        event.emit('someEventName') is actually sending event with name 'myEvent:someEventName'
   */
  eventPrefix?: string;

  /**
   * 如果要使用 command 注册命令，需要在插件 meta 中定义 commandScope
   */
  commandScope?: string;
}

export interface PluginDeclaration {
  // this will be displayed on configuration UI, can be plugin name
  title: string;
  properties: PluginDeclarationProperty[];
}

export interface PluginDeclarationProperty {
  // shape like 'name' or 'group.name' or 'group.subGroup.name'
  key: string;
  // must have either one of description & markdownDescription
  description: string;
  // value in 'number', 'string', 'boolean'
  type: string;
  // default value
  // NOTE! this is only used in configuration UI, won`t affect runtime
  default?: PluginPreferenceValue;
  // only works when type === 'string', default value false
  useMultipleLineTextInput?: boolean;
  // enum values, only works when type === 'string'
  enum?: any[];
  // descriptions for enum values
  enumDescriptions?: string[];
  // message that describing deprecation of this property
  deprecationMessage?: string;
}

export type PluginPreferenceValue = string | number | boolean;

export type PluginPreference = Map<string, Record<string, PluginPreferenceValue>>;

export interface PluginCreater<Context> {
  (ctx: Context, options: any): PluginInstance;
  pluginName: string;
  meta?: PluginMeta;
}

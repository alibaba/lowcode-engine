import { IPublicTypeIconType, IPublicTypeNpmInfo, IPublicTypeFieldConfig, IPublicTypeI18nData, IPublicTypeComponentSchema, IPublicTypeTitleContent, IPublicTypePropConfig, IPublicTypeConfigure, IPublicTypeSnippet } from './';

/**
 * 组件 meta 配置
 */

export interface IPublicTypeComponentMetadata {

  /** 其他扩展协议 */
  [key: string]: any;

  /**
   * 组件名
   */
  componentName: string;

  /**
   * unique id
   */
  uri?: string;

  /**
   * title or description
   */
  title?: IPublicTypeTitleContent;

  /**
   * svg icon for component
   */
  icon?: IPublicTypeIconType;

  /**
   * 组件标签
   */
  tags?: string[];

  /**
   * 组件描述
   */
  description?: string;

  /**
   * 组件文档链接
   */
  docUrl?: string;

  /**
   * 组件快照
   */
  screenshot?: string;

  /**
   * 组件研发模式
   */
  devMode?: 'proCode' | 'lowCode';

  /**
   * npm 源引入完整描述对象
   */
  npm?: IPublicTypeNpmInfo;

  /**
   * 组件属性信息
   */
  props?: IPublicTypePropConfig[];

  /**
   * 编辑体验增强
   */
  configure?: IPublicTypeFieldConfig[] | IPublicTypeConfigure;

  /**
   * @todo 待补充文档
   */
  schema?: IPublicTypeComponentSchema;

  /**
   * 可用片段
   */
  snippets?: IPublicTypeSnippet[];

  /**
   * 一级分组
   */
  group?: string | IPublicTypeI18nData;

  /**
   * 二级分组
   */
  category?: string | IPublicTypeI18nData;

  /**
   * 组件优先级排序
   */
  priority?: number;
}

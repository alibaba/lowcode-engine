import { IPublicTypeNodeSchema } from './';

/**
 * 可用片段
 *
 * 内容为组件不同状态下的低代码 schema (可以有多个)，用户从组件面板拖入组件到设计器时会向页面 schema 中插入 snippets 中定义的组件低代码 schema
 */
export interface IPublicTypeSnippet {
  /**
   * 组件分类 title
   */
  title?: string;
  /**
   * snippet 截图
   */
  screenshot?: string;
  /**
   * 待插入的 schema
   */
  schema?: IPublicTypeNodeSchema;
}

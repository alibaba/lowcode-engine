import { ReactNode } from 'react';
import { IconType } from './icon';
import { TipContent } from './tip';
import { TitleContent } from './title';
import { PropConfig } from './prop-config';
import { NpmInfo } from './npm';
import { FieldConfig } from './field-config';

export interface NestingRule {
  childWhitelist?: string[];
  parentWhitelist?: string[];
  descendantBlacklist?: string[];
  ancestorWhitelist?: string[];
}

export interface ComponentConfigure {
  isContainer?: boolean;
  isModal?: boolean;
  isNullNode?: boolean;
  descriptor?: string;
  nestingRule?: NestingRule;
  rectSelector?: string;
  // copy,move,delete
  disableBehaviors?: string[];
  actions?: ComponentAction[];
}

export interface Configure {
  props?: FieldConfig[];
  styles?: object;
  events?: object;
  component?: ComponentConfigure;
}

export interface ActionContentObject {
  // 图标
  icon?: IconType;
  // 描述
  description?: TipContent;
  // 执行动作
  action?: (node: any) => void;
}

export interface ComponentAction {
  // behaviorName
  name: string;
  // 菜单名称
  content: string | ReactNode | ActionContentObject;
  // 子集
  items?: ComponentAction[];
  // 不显示
  condition?: boolean | ((node: any) => boolean);
  // 显示在工具条上
  important?: boolean;
}

export function isActionContentObject(obj: any): obj is ActionContentObject {
  return obj && typeof obj === 'object';
}

export interface ComponentMetadata {
  componentName: string;
  /**
   * unique id
   */
  uri?: string;
  /**
   * title or description
   */
  title?: TitleContent;
  /**
   * svg icon for component
   */
  icon?: IconType;
  tags?: string[];
  description?: string;
  docUrl?: string;
  screenshot?: string;
  devMode?: 'procode' | 'lowcode';
  npm?: NpmInfo;
  props?: PropConfig[];
  configure?: FieldConfig[] | Configure;
}

export interface TransformedComponentMetadata extends ComponentMetadata {
  configure: Configure & { combined?: FieldConfig[] };
}

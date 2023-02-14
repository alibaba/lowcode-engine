import { IPublicTypeNodeSchema, IPublicTypeCompositeValue } from '@alilc/lowcode-types';
import { HandlerSet, BaseGenerator, NodeGenerator } from './core';

export enum PIECE_TYPE {
  BEFORE = 'NodeCodePieceBefore',
  TAG = 'NodeCodePieceTag',
  ATTR = 'NodeCodePieceAttr',
  CHILDREN = 'NodeCodePieceChildren',
  AFTER = 'NodeCodePieceAfter',
}

export interface CodePiece {
  name?: string;
  value: string;
  type: PIECE_TYPE;
}

export interface AttrData {
  attrName: string;
  attrValue: IPublicTypeCompositeValue;
}
// 对 JSX 出码的理解，目前定制点包含【包装】【标签名】【属性】
export type AttrPlugin = BaseGenerator<AttrData, CodePiece[], NodeGeneratorConfig>;
export type NodePlugin = BaseGenerator<IPublicTypeNodeSchema, CodePiece[], NodeGeneratorConfig>;

export interface NodeGeneratorConfig {
  handlers?: HandlerSet<string>;
  tagMapping?: (input: string) => string;
  attrPlugins?: AttrPlugin[];
  nodePlugins?: NodePlugin[];
  self?: NodeGenerator<string>;

  /**
   * 是否要容忍对 JSExpression 求值时的异常
   * 默认：true
   * 注：如果容忍异常，则会在求值时包裹 try-catch 块 -- 通过 __$$eval / __$$evalArray
   *     catch 到异常时默认会抛出一个 CustomEvent 事件里面包含异常信息和求值的表达式
   */
  tolerateEvalErrors?: boolean;
}

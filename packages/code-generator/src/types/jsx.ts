import { NodeSchema, CompositeValue } from '@ali/lowcode-types';
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

export type AttrData = { attrName: string; attrValue: CompositeValue };
// 对 JSX 出码的理解，目前定制点包含 【包装】【标签名】【属性】
export type AttrPlugin = BaseGenerator<AttrData, CodePiece[], NodeGeneratorConfig>;
export type NodePlugin = BaseGenerator<NodeSchema, CodePiece[], NodeGeneratorConfig>;

export type NodeGeneratorConfig = {
  handlers?: HandlerSet<string>;
  tagMapping?: (input: string) => string;
  attrPlugins?: AttrPlugin[];
  nodePlugins?: NodePlugin[];
  self?: NodeGenerator<string>;
};

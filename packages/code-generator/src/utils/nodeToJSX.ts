import _ from 'lodash';
import { NodeSchema, isNodeSchema, NodeDataType, CompositeValue } from '@ali/lowcode-types';

import {
  IScope,
  CodeGeneratorError,
  PIECE_TYPE,
  CodePiece,
  NodeGenerator,
  NodeGeneratorConfig,
  NodePlugin,
  AttrData,
} from '../types';

import { generateCompositeType } from './compositeType';
import { executeFunctionStack } from './aopHelper';

function mergeNodeGeneratorConfig(cfg1: NodeGeneratorConfig, cfg2: NodeGeneratorConfig = {}): NodeGeneratorConfig {
  const resCfg: NodeGeneratorConfig = {};
  if (cfg1.handlers || cfg2.handlers) {
    resCfg.handlers = {
      ...(cfg1.handlers || {}),
      ...(cfg2.handlers || {}),
    };
  }

  if (cfg1.tagMapping || cfg2.tagMapping) {
    resCfg.tagMapping = cfg2.tagMapping || cfg1.tagMapping;
  }

  if (cfg1.attrPlugins || cfg2.attrPlugins) {
    resCfg.attrPlugins = [];
    resCfg.attrPlugins.push(...(cfg2.attrPlugins || []));
    resCfg.attrPlugins.push(...(cfg1.attrPlugins || []));
  }

  if (cfg1.nodePlugins || cfg2.nodePlugins) {
    resCfg.nodePlugins = [];
    resCfg.nodePlugins.push(...(cfg2.nodePlugins || []));
    resCfg.nodePlugins.push(...(cfg1.nodePlugins || []));
  }

  return resCfg;
}

function generateAttrValue(
  attrData: { attrName: string; attrValue: CompositeValue },
  scope: IScope,
  config?: NodeGeneratorConfig,
): CodePiece[] {
  const valueStr = generateCompositeType(attrData.attrValue, scope, {
    handlers: config?.handlers,
    nodeGenerator: config?.self,
  });
  return [
    {
      type: PIECE_TYPE.ATTR,
      name: attrData.attrName,
      value: valueStr,
    },
  ];
}

function generateAttr(
  attrName: string,
  attrValue: CompositeValue,
  scope: IScope,
  config?: NodeGeneratorConfig,
): CodePiece[] {
  let pieces: CodePiece[];
  if (config?.attrPlugins) {
    pieces = executeFunctionStack<AttrData, CodePiece[], NodeGeneratorConfig>(
      { attrName, attrValue },
      scope,
      config.attrPlugins,
      generateAttrValue,
      config,
    );
  } else {
    pieces = generateAttrValue({ attrName, attrValue }, scope, config);
  }

  pieces = pieces.map((p) => {
    // FIXME: 在经过 generateCompositeType 处理过之后，其实已经无法通过传入值的类型判断传出值是否为纯字面值字符串了（可能包裹了加工函数之类的）
    //        因此这个处理最好的方式是对传出值做语法分析，判断以哪种模版产出 Attr 值
    let newValue: string;
    if (p.value && p.value[0] === "'" && p.value[p.value.length - 1] === "'") {
      newValue = `"${p.value.substring(1, p.value.length - 1)}"`;
    } else {
      newValue = `{${p.value}}`;
    }

    return {
      value: `${p.name}=${newValue}`,
      type: PIECE_TYPE.ATTR,
    };
  });

  return pieces;
}

function generateAttrs(nodeItem: NodeSchema, scope: IScope, config?: NodeGeneratorConfig): CodePiece[] {
  const { props } = nodeItem;

  let pieces: CodePiece[] = [];

  if (props) {
    if (!Array.isArray(props)) {
      Object.keys(props).forEach((propName: string) => {
        pieces = pieces.concat(generateAttr(propName, props[propName], scope, config));
      });
    } else {
      props.forEach((prop) => {
        if (prop.name && !prop.spread) {
          pieces = pieces.concat(generateAttr(prop.name, prop.value, scope, config));
        }

        // TODO: 处理 spread 场景（<Xxx {...(something)}/>)
        // 这种在 schema 里面怎么描述
      });
    }
  }

  return pieces;
}

function generateBasicNode(nodeItem: NodeSchema, scope: IScope, config?: NodeGeneratorConfig): CodePiece[] {
  const pieces: CodePiece[] = [];
  const tagName = (config?.tagMapping || _.identity)(nodeItem.componentName);

  pieces.push({
    value: tagName || '', // FIXME: type detection error
    type: PIECE_TYPE.TAG,
  });

  return pieces;
}

function generateSimpleNode(nodeItem: NodeSchema, scope: IScope, config?: NodeGeneratorConfig): CodePiece[] {
  const basicParts = generateBasicNode(nodeItem, scope, config) || [];
  const attrParts = generateAttrs(nodeItem, scope, config) || [];

  return [...basicParts, ...attrParts];
}

function linkPieces(pieces: CodePiece[]): string {
  const tagsPieces = pieces.filter((p) => p.type === PIECE_TYPE.TAG);
  if (tagsPieces.length !== 1) {
    throw new CodeGeneratorError('One node only need one tag define');
  }
  const tagName = tagsPieces[0].value;

  const beforeParts = pieces
    .filter((p) => p.type === PIECE_TYPE.BEFORE)
    .map((p) => p.value)
    .join('');

  const afterParts = pieces
    .filter((p) => p.type === PIECE_TYPE.AFTER)
    .map((p) => p.value)
    .join('');

  const childrenParts = pieces
    .filter((p) => p.type === PIECE_TYPE.CHILDREN)
    .map((p) => p.value)
    .join('');

  let attrsParts = pieces
    .filter((p) => p.type === PIECE_TYPE.ATTR)
    .map((p) => p.value)
    .join(' ');

  attrsParts = !!attrsParts ? ` ${attrsParts}` : '';

  if (childrenParts) {
    return `${beforeParts}<${tagName}${attrsParts}>${childrenParts}</${tagName}>${afterParts}`;
  }

  return `${beforeParts}<${tagName}${attrsParts} />${afterParts}`;
}

function generateNodeSchema(nodeItem: NodeSchema, scope: IScope, config?: NodeGeneratorConfig): string {
  const pieces: CodePiece[] = [];
  if (config?.nodePlugins) {
    const res = executeFunctionStack<NodeSchema, CodePiece[], NodeGeneratorConfig>(
      nodeItem,
      scope,
      config.nodePlugins,
      generateSimpleNode,
      config,
    );
    pieces.push(...res);
  } else {
    pieces.push(...generateSimpleNode(nodeItem, scope, config));
  }

  if (nodeItem.children && config?.self) {
    const childrenStr = config.self(nodeItem.children, scope);

    pieces.push({
      type: PIECE_TYPE.CHILDREN,
      value: childrenStr,
    });
  }

  return linkPieces(pieces);
}

// TODO: 生成文档
// 为包裹的代码片段生成子上下文，集成父级上下文，并传入子级上下文新增内容。（如果存在多级上下文怎么处理？）
// 创建新的上下文，并从作用域中取对应同名变量塞到作用域里面？
// export function createSubContext() {}

/**
 * JSX 生成逻辑插件。在 React 代码模式下生成 loop 相关的逻辑代码
 * @type NodePlugin Extended
 *
 * @export
 * @param {NodeSchema} nodeItem 当前 UI 节点
 * @returns {CodePiece[]} 实现功能的相关代码片段
 */
export function generateReactLoopCtrl(
  nodeItem: NodeSchema,
  scope: IScope,
  config?: NodeGeneratorConfig,
  next?: NodePlugin,
): CodePiece[] {
  const pieces: CodePiece[] = next ? next(nodeItem, scope, config) : [];

  if (nodeItem.loop) {
    const loopItemName = nodeItem.loopArgs?.[0] || 'item';
    const loopIndexName = nodeItem.loopArgs?.[1] || 'index';

    const loopDataExpr = generateCompositeType(nodeItem.loop, scope, {
      handlers: config?.handlers,
    });

    pieces.unshift({
      value: `${loopDataExpr}.map((${loopItemName}, ${loopIndexName}) => (`,
      type: PIECE_TYPE.BEFORE,
    });

    pieces.push({
      value: '))',
      type: PIECE_TYPE.AFTER,
    });
  }

  return pieces;
}

/**
 * JSX 生成逻辑插件。在 React 代码模式下生成 condition 相关的逻辑代码
 * @type NodePlugin
 *
 * @export
 * @param {NodeSchema} nodeItem 当前 UI 节点
 * @returns {CodePiece[]} 实现功能的相关代码片段
 */
export function generateConditionReactCtrl(
  nodeItem: NodeSchema,
  scope: IScope,
  config?: NodeGeneratorConfig,
  next?: NodePlugin,
): CodePiece[] {
  const pieces: CodePiece[] = next ? next(nodeItem, scope, config) : [];

  if (nodeItem.condition) {
    const value = generateCompositeType(nodeItem.condition, scope, {
      handlers: config?.handlers,
    });

    pieces.unshift({
      value: `(${value}) && (`,
      type: PIECE_TYPE.BEFORE,
    });

    pieces.push({
      value: ')',
      type: PIECE_TYPE.AFTER,
    });
  }

  return pieces;
}

/**
 * JSX 生成逻辑插件。在 React 代码模式下，如果 Node 生成结果是一个表达式，则对其进行 { Expression } 包装
 * @type NodePlugin
 *
 * @export
 * @param {NodeSchema} nodeItem 当前 UI 节点
 * @returns {CodePiece[]} 实现功能的相关代码片段
 */
export function generateReactExprInJS(
  nodeItem: NodeSchema,
  scope: IScope,
  config?: NodeGeneratorConfig,
  next?: NodePlugin,
): CodePiece[] {
  const pieces: CodePiece[] = next ? next(nodeItem, scope, config) : [];

  if (nodeItem.condition || nodeItem.loop) {
    pieces.unshift({
      value: '{',
      type: PIECE_TYPE.BEFORE,
    });

    pieces.push({
      value: '}',
      type: PIECE_TYPE.AFTER,
    });
  }

  return pieces;
}

const handleChildren = (v: string[]) => v.join('');

export function createNodeGenerator(cfg: NodeGeneratorConfig = {}): NodeGenerator<string> {
  const generateNode = (nodeItem: NodeDataType, scope: IScope): string => {
    if (_.isArray(nodeItem)) {
      const resList = nodeItem.map((n) => generateNode(n, scope));
      return handleChildren(resList);
    }

    if (isNodeSchema(nodeItem)) {
      return generateNodeSchema(nodeItem, scope, {
        ...cfg,
        self: generateNode,
      });
    }

    return generateCompositeType(nodeItem, scope, {
      handlers: cfg.handlers,
      nodeGenerator: generateNode,
    });
  };

  return generateNode;
}

const defaultReactGeneratorConfig: NodeGeneratorConfig = {
  nodePlugins: [generateReactExprInJS, generateConditionReactCtrl, generateReactLoopCtrl],
};

export function createReactNodeGenerator(cfg?: NodeGeneratorConfig): NodeGenerator<string> {
  const newCfg = mergeNodeGeneratorConfig(defaultReactGeneratorConfig, cfg);

  return createNodeGenerator(newCfg);
}

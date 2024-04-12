import { ActivityType, IPublicTypeNodeSchema, IPublicTypeRootSchema } from '@alilc/lowcode-types';
import { isJSBlock, isJSSlot } from './check-types';
import { isVariable } from './misc';
import { isPlainObject } from './is-plain-object';

function isJsObject(props: any) {
  if (typeof props === 'object' && props !== null) {
    return props.type && props.source && props.compiled;
  }
}
function isActionRef(props: any): boolean {
  return props.type && props.type === 'actionRef';
}

/**
 * 将「乐高版本」协议升级成 JSExpression / JSSlot 等标准协议的结构
 * @param props
 * @returns
 */
export function compatibleLegaoSchema(props: any): any {
  if (!props) {
    return props;
  }

  if (Array.isArray(props)) {
    return props.map((k) => compatibleLegaoSchema(k));
  }

  if (!isPlainObject(props)) {
    return props;
  }

  if (isJSBlock(props)) {
    if (props.value.componentName === 'Slot') {
      return {
        type: 'JSSlot',
        title: (props.value.props as any)?.slotTitle,
        name: (props.value.props as any)?.slotName,
        value: compatibleLegaoSchema(props.value.children),
        params: (props.value.props as any)?.slotParams,
      };
    } else {
      return props.value;
    }
  }
  if (isVariable(props)) {
    return {
      type: 'JSExpression',
      value: props.variable,
      mock: props.value,
    };
  }
  if (isJsObject(props)) {
    return {
      type: 'JSExpression',
      value: props.compiled,
      extType: 'function',
    };
  }
  if (isActionRef(props)) {
    return {
      type: 'JSExpression',
      value: `${props.id}.bind(this)`,
    };
  }
  const newProps: any = {};
  Object.keys(props).forEach((key) => {
    if (/^__slot__/.test(key) && props[key] === true) {
      return;
    }
    // TODO: 先移除，目前没有业务使用
    // if (key === 'dataSource') {
    //   newProps[key] = props[key];
    //   return;
    // }
    newProps[key] = compatibleLegaoSchema(props[key]);
  });
  return newProps;
}

export function getNodeSchemaById(
  schema: IPublicTypeNodeSchema,
  nodeId: string,
): IPublicTypeNodeSchema | undefined {
  let found: IPublicTypeNodeSchema | undefined;
  if (schema.id === nodeId) {
    return schema;
  }
  const { children, props } = schema;
  // 查找 children
  if (Array.isArray(children)) {
    for (const child of children) {
      found = getNodeSchemaById(child as IPublicTypeNodeSchema, nodeId);
      if (found) return found;
    }
  }
  if (isPlainObject(props)) {
    // 查找 props，主要是 slot 类型
    found = getNodeSchemaFromPropsById(props, nodeId);
    if (found) return found;
  }
}

function getNodeSchemaFromPropsById(props: any, nodeId: string): IPublicTypeNodeSchema | undefined {
  let found: IPublicTypeNodeSchema | undefined;
  for (const [, value] of Object.entries(props)) {
    if (isJSSlot(value)) {
      // value 是数组类型 { type: 'JSSlot', value: IPublicTypeNodeSchema[] }
      if (Array.isArray(value.value)) {
        for (const child of value.value) {
          found = getNodeSchemaById(child as IPublicTypeNodeSchema, nodeId);
          if (found) return found;
        }
      }
      // value 是对象类型 { type: 'JSSlot', value: IPublicTypeNodeSchema }
      found = getNodeSchemaById(value.value as IPublicTypeNodeSchema, nodeId);
      if (found) return found;
    } else if (isPlainObject(value)) {
      found = getNodeSchemaFromPropsById(value, nodeId);
      if (found) return found;
    }
  }
}

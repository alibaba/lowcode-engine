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

/**
 * TODO: not sure if this is used anywhere
 * @deprecated
 */
export function applyActivities(
  pivotSchema: IPublicTypeRootSchema,
  activities: any,
): IPublicTypeRootSchema {
  const schema = { ...pivotSchema };
  if (!Array.isArray(activities)) {
    activities = [activities];
  }
  return activities.reduce((accSchema: IPublicTypeRootSchema, activity: any) => {
    if (activity.type === ActivityType.MODIFIED) {
      const found = getNodeSchemaById(accSchema, activity.payload.schema.id);
      if (!found) return accSchema;
      Object.assign(found, activity.payload.schema);
    } else if (activity.type === ActivityType.ADDED) {
      const { payload } = activity;
      const { location, schema } = payload;
      const { parent } = location;
      const found = getNodeSchemaById(accSchema, parent.nodeId);
      if (found) {
        if (Array.isArray(found.children)) {
          found.children.splice(parent.index, 0, schema);
        } else if (!found.children) {
          found.children = [schema];
        }
        // TODO: 是 JSExpression / DOMText
      }
    } else if (activity.type === ActivityType.DELETED) {
      const { payload } = activity;
      const { location } = payload;
      const { parent } = location;
      const found = getNodeSchemaById(accSchema, parent.nodeId);
      if (found && Array.isArray(found.children)) {
        found.children.splice(parent.index, 1);
      }
    }
    return accSchema;
  }, schema);
}

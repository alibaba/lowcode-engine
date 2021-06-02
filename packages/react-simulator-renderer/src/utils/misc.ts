import { ReactInstance } from 'react';
import { ActivityData } from '@ali/lowcode-types';
import { DocumentInstance } from '../renderer';

interface UtilsMetadata {
  name: string;
  npm: {
    package: string;
    version?: string;
    exportName: string;
    subName?: string;
    destructuring?: boolean;
    main?: string;
  }
}

interface LibrayMap {
  [key: string]: string;
}

export function getProjectUtils(librayMap: LibrayMap, utilsMetadata: UtilsMetadata[]) {
  const projectUtils: { [packageName: string]: any } = {};
  if (utilsMetadata) {
    utilsMetadata.forEach(meta => {
      if (librayMap[meta?.npm.package]) {
        const lib = window[librayMap[meta?.npm.package]];
      }
    });
  }
}

/**
 * 获取最靠近 Props / PropStash 的 prop 实例
 * @param prop
 * @returns
 */
export function getUppermostPropKey(prop: any): string {
  let curProp = prop;
  while (curProp.parent.isProp) {
    curProp = curProp.parent;
  }
  return curProp.key;
}

function haveForceUpdate(instances: any[]): boolean {
  return instances.every(inst => 'forceUpdate' in inst);
}

/**
 * 是否支持快捷属性值设值
 * @param data
 * @param doc
 * @returns
 */
export function supportsQuickPropSetting(data: ActivityData, doc: DocumentInstance) {
  const { payload } = data;
  const { schema, prop } = payload;
  const nodeId = schema.id!;
  // const key = data.payload.prop.key;
  const instances = doc.instancesMap.get(nodeId);
  const uppermostPropKey = getUppermostPropKey(prop);

  return (
    nodeId &&
    Array.isArray(instances) &&
    instances.length > 0 &&
    haveForceUpdate(instances) &&
    uppermostPropKey &&
    !uppermostPropKey.startsWith('___')
  );
}

/**
 * 设置属性值
 * @param data
 * @param doc
 */
export function setInstancesProp(data: ActivityData, doc: DocumentInstance) {
  const { payload } = data;
  const { schema, prop, newValue } = payload;
  const nodeId = schema.id!;
  const instances = doc.instancesMap.get(nodeId)!;
  const propKey = getUppermostPropKey(prop);
  let value = (schema.props as any)[propKey];
  // 当 prop 是在 PropStash 中产生时，该 prop 需要在下一个 obx 的时钟周期才能挂载到相应位置，
  // 而 schema 是同步 export 得到的，此时 schema 中还没有对应的值，所以直接取 newValue
  if (prop.parent.isPropStash) {
    value = newValue;
  }

  instances.forEach((inst: any) => {
    inst.props[propKey] = value;
    inst.forceUpdate();
  });
}
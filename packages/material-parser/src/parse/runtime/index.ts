import { isEmpty } from 'lodash';
// import * as path from 'path';
// @ts-ignore
import parsePropTypes from 'parse-prop-types';
import PropTypes from 'prop-types';
import { transformItem } from '../transform';
import { IParseArgs } from '../index';
import requireInSandbox from './requireInSandbox';

export interface IComponentInfo {
  component: any;
  meta: {
    exportName: string;
    subName?: string;
  };
}

const reservedKeys = [
  'propTypes',
  'defaultProps',
  'name',
  'arguments',
  'caller',
  'length',
  'contextTypes',
  'displayName',
  '__esModule',
  'version',
];

function getKeys(com: any) {
  const keys = Object.keys(com).filter((x) => {
    return !reservedKeys.includes(x) && !x.startsWith('_');
  });

  return keys;
}

function isComponent(obj: any) {
  return typeof obj === 'function' && (obj.hasOwnProperty('propTypes') || obj.hasOwnProperty('defaultProps'));
}

export default function (filePath: string) {
  // const { filePath } = arg;
  // const modulePath = path.resolve(workDir, 'node_modules', 'parse-prop-types');
  // const parsePropTypes = require(modulePath).default;
  const Com = requireInSandbox(filePath, PropTypes);
  const components: IComponentInfo[] = [];
  let index = 0;

  if (Com.__esModule) {
    const keys = getKeys(Com);
    keys.forEach((k) => {
      if (isComponent(Com[k])) {
        components.push({
          component: Com[k],
          meta: {
            exportName: k,
          },
        });
      }
    });
  } else if (isComponent(Com)) {
    components.push({
      component: Com,
      meta: {
        exportName: 'default',
      },
    });
  }

  // dps
  while (index < components.length) {
    const item = components[index++];

    const keys = getKeys(item.component);
    const subs = keys
      .filter((k) => isComponent(item.component[k]))
      .map((k) => ({
        component: item.component[k],
        meta: {
          ...item.meta,
          subName: k,
        },
      }));
    if (subs.length) {
      components.splice(index, 0, ...subs);
    }
  }

  const result = components.reduce((acc: any, { meta, component }) => {
    const componentInfo = parsePropTypes(component);
    if (!isEmpty(componentInfo)) {
      const props = Object.keys(componentInfo).reduce((acc: any[], name) => {
        try {
          const item: any = transformItem(name, componentInfo[name]);
          acc.push(item);
        } catch (e) {
        } finally {
          return acc;
        }
      }, []);

      return [
        ...acc,
        {
          meta,
          props,
          componentName: meta.subName || meta.exportName || component.displayName,
        },
      ];
    }
    return acc;
  }, []);

  return result;
}

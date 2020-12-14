import set from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';
import '../../fixtures/window';
import { Node } from '../../../src/document/node/node';
import { Designer } from '../../../src/designer/designer';
import divMeta from '../../fixtures/component-metadata/div';
import { ComponentMeta, isComponentMeta, removeBuiltinComponentAction, addBuiltinComponentAction } from '../../../src/component-meta';

const mockCreateSettingEntry = jest.fn();
jest.mock('../../../src/designer/designer', () => {
  return {
    Designer: jest.fn().mockImplementation(() => {
      return {
        getGlobalComponentActions: () => [],
      };
    }),
  };
});

let designer = null;
beforeAll(() => {
  designer = new Designer({});
});

describe('组件元数据处理', () => {
  it('构造函数', () => {
    const meta = new ComponentMeta(designer, divMeta);
    expect(meta.isContainer).toBeTruthy();
    expect(isComponentMeta(meta)).toBeTruthy();
    expect(meta.acceptable).toBeFalsy();
    expect(meta.isRootComponent()).toBeFalsy();
    expect(meta.isModal).toBeFalsy();
    expect(meta.rootSelector).toBeUndefined();
    expect(meta.liveTextEditing).toBeUndefined();
    expect(meta.descriptor).toBeUndefined();
    expect(typeof meta.icon).toBe('function');
    expect(meta.getMetadata().title).toBe('容器');
    expect(meta.title).toEqual({ type: 'i18n', 'en-US': 'Div', 'zh-CN': '容器' });

    meta.setNpm({ package: '@ali/vc-div', componentName: 'Div' });
    expect(meta.npm).toEqual({ package: '@ali/vc-div', componentName: 'Div' });

    meta.setMetadata(divMeta);
  });

  it('availableActions', () => {
    const meta = new ComponentMeta(designer, divMeta);
    expect(meta.availableActions).toHaveLength(3);
    expect(meta.availableActions[0].name).toBe('remove');
    expect(meta.availableActions[1].name).toBe('hide');
    expect(meta.availableActions[2].name).toBe('copy');

    removeBuiltinComponentAction('remove');
    // availableActions 有 computed 缓存
    expect(meta.availableActions[0].name).toBe('remove');
    expect(meta.availableActions[1].name).toBe('hide');
    expect(meta.availableActions[2].name).toBe('copy');

    addBuiltinComponentAction({
      name: 'new',
      content: {
        action() {}
      }
    });
    // availableActions 有 computed 缓存
    expect(meta.availableActions).toHaveLength(3);
    expect(meta.availableActions[0].name).toBe('remove');
    expect(meta.availableActions[1].name).toBe('hide');
    expect(meta.availableActions[2].name).toBe('copy');
  });
});
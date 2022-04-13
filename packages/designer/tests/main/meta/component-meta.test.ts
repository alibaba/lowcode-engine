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
  designer = new Designer({} as any);
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
    expect(meta.availableActions).toHaveLength(5);
    expect(meta.availableActions[0].name).toBe('remove');
    expect(meta.availableActions[1].name).toBe('hide');
    expect(meta.availableActions[2].name).toBe('copy');

    removeBuiltinComponentAction('remove');
    expect(meta.availableActions).toHaveLength(4);
    expect(meta.availableActions[0].name).toBe('hide');
    expect(meta.availableActions[1].name).toBe('copy');

    addBuiltinComponentAction({
      name: 'new',
      content: {
        action() {},
      },
    });
    expect(meta.availableActions).toHaveLength(5);
    expect(meta.availableActions[0].name).toBe('hide');
    expect(meta.availableActions[1].name).toBe('copy');
    expect(meta.availableActions[4].name).toBe('new');
  });
});

describe('组件元数据transducers', () => {
  it('legacyIssues', () => {
    const legacyMeta: any = {
      ...divMeta,
      devMode: 'procode'
    }
    const meta = new ComponentMeta(designer, legacyMeta);
    const metadata = meta.getMetadata();
    expect(metadata.devMode).toBe('proCode');
  })
})

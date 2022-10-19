import '../../fixtures/window';
import { Node } from '../../../src/document/node/node';
import { Designer } from '../../../src/designer/designer';
import divMeta from '../../fixtures/component-metadata/div';
import div2Meta from '../../fixtures/component-metadata/div2';
import div3Meta from '../../fixtures/component-metadata/div3';
import div4Meta from '../../fixtures/component-metadata/div4';
import div5Meta from '../../fixtures/component-metadata/div5';
import div6Meta from '../../fixtures/component-metadata/div6';
import div7Meta from '../../fixtures/component-metadata/div7';
import div8Meta from '../../fixtures/component-metadata/div8';
import div9Meta from '../../fixtures/component-metadata/div9';
import div10Meta from '../../fixtures/component-metadata/div10';
import abcgroup from '../../fixtures/component-metadata/abcgroup';
import abcitem from '../../fixtures/component-metadata/abcitem';
import abcnode from '../../fixtures/component-metadata/abcnode';
import abcoption from '../../fixtures/component-metadata/abcoption';
import page2Meta from '../../fixtures/component-metadata/page2';
import {
  ComponentMeta,
  isComponentMeta,
  removeBuiltinComponentAction,
  addBuiltinComponentAction,
  modifyBuiltinComponentAction,
  ensureAList,
  buildFilter,
  registerMetadataTransducer,
  getRegisteredMetadataTransducers,
} from '../../../src/component-meta';
import { componentDefaults } from '../../../src/transducers';

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
    expect(meta.isMinimalRenderUnit).toBeFalsy();
    expect(meta.isTopFixed).toBeFalsy();

    meta.setNpm({ package: '@ali/vc-div', componentName: 'Div' });
    expect(meta.npm).toEqual({ package: '@ali/vc-div', componentName: 'Div' });
    meta.npm = { package: '@ali/vc-div', componentName: 'Div' };
    expect(meta.npm).toEqual({ package: '@ali/vc-div', componentName: 'Div' });


    const mockFn = jest.fn();
    const offFn = meta.onMetadataChange(mockFn);
    meta.setMetadata(divMeta);
    expect(mockFn).toHaveBeenCalledTimes(1);
    offFn();
    meta.setMetadata(divMeta);
    // 不会再触发函数
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('构造函数 - 兼容场景（title 是个普通对象）', () => {
    const meta = new ComponentMeta(designer, div2Meta);
    expect(meta.title).toEqual('容器');

    expect(meta.isTopFixed).toBeTruthy();
  });

  it('构造函数 - 兼容场景（title fallback 到 componentName）', () => {
    const meta = new ComponentMeta(designer, div3Meta);
    expect(meta.title).toEqual('Div');
  });

  it('构造函数 - 兼容场景（configure 是个数组）', () => {
    const meta = new ComponentMeta(designer, div4Meta);
    expect(meta.configure).toEqual(div4Meta.configure);
  });

  it('构造函数 - 兼容场景（使用 experimental）', () => {
    const meta = new ComponentMeta(designer, div6Meta);
    expect(meta.getMetadata().configure.advanced.initials).toHaveLength(9);
  });

  it('构造函数 - 兼容场景（没有 configure.component）', () => {
    const meta = new ComponentMeta(designer, div7Meta);
    expect(meta.isContainer).toBeFalsy();
    expect(meta.isModal).toBeFalsy();
  });

  it('构造函数 - 兼容场景（没有 configure）', () => {
    const meta = new ComponentMeta(designer, div8Meta);
    expect(meta.configure).toEqual([]);
  });

  it('构造函数 - 兼容场景（没有 npm）', () => {
    const meta = new ComponentMeta(designer, div9Meta);
    expect(meta.npm).toBeUndefined();

    meta.setNpm({ package: '@ali/vc-div', componentName: 'Div' });
    expect(meta.npm).toEqual({ package: '@ali/vc-div', componentName: 'Div' });
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

  it('availableActions - disableBehaviors: *', () => {
    const meta = new ComponentMeta(designer, div5Meta);
    expect(meta.availableActions).toHaveLength(0);
  });

  it('availableActions - rootCompoment', () => {
    const meta = new ComponentMeta(designer, page2Meta);
    // (hide + new) left
    expect(meta.availableActions).toHaveLength(2);
  });

  describe('checkNesting', () => {
    const mockNode = (componentName) => {
      return {
        internalToShellNode() {
          return {
            componentName,
          };
        },
        isNode: true,
      };
    };
    const mockNodeForm = mockNode('Form');
    const mockNodeImage = mockNode('Image');
    const mockNodeDiv = mockNode('Div');
    it('checkNestingUp', () => {
      const meta1 = new ComponentMeta(designer, divMeta);
      // 没有配置 parentWhitelist，判断默认为 true
      expect(meta1.checkNestingUp(mockNodeDiv, mockNodeDiv)).toBeTruthy();

      const meta2 = new ComponentMeta(designer, div10Meta);
      expect(meta2.checkNestingUp(mockNodeDiv, mockNodeForm)).toBeTruthy();
      expect(meta2.checkNestingUp(mockNodeDiv, mockNodeDiv)).toBeFalsy();
    });

    it('checkNestingDown', () => {
      const meta1 = new ComponentMeta(designer, divMeta);
      // 没有配置 childWhitelist，判断默认为 true
      expect(meta1.checkNestingDown(mockNodeDiv, mockNodeDiv)).toBeTruthy();

      const meta2 = new ComponentMeta(designer, div10Meta);
      expect(meta2.checkNestingDown(mockNodeDiv, mockNodeForm)).toBeFalsy();
      expect(meta2.checkNestingDown(mockNodeDiv, mockNodeImage)).toBeTruthy();
    });
  });
});

describe('组件元数据 transducers', () => {
  it('legacyIssues', () => {
    const legacyMeta: any = {
      ...divMeta,
      devMode: 'procode',
    };
    const meta = new ComponentMeta(designer, legacyMeta);
    const metadata = meta.getMetadata();
    expect(metadata.devMode).toBe('proCode');
  });
});

describe('帮助函数', () => {
  it('ensureAList', () => {
    expect(ensureAList()).toBeNull();
    expect(ensureAList(1)).toBeNull();
    expect(ensureAList([])).toBeNull();
    expect(ensureAList('copy lock')).toEqual(['copy', 'lock']);
    expect(ensureAList(['copy', 'lock'])).toEqual(['copy', 'lock']);
  });

  it('buildFilter', () => {
    const mockFn = () => {};
    expect(buildFilter()).toBeNull();
    expect(buildFilter([])).toBeNull();
    expect(buildFilter(mockFn)).toBe(mockFn);

    const mockRE = /xxx/;
    const filter = buildFilter(mockRE);
    expect(filter({ componentName: 'xxx' })).toBeTruthy();
    expect(filter({ componentName: 'yyy' })).toBeFalsy();

    expect(buildFilter('xxx yyy')({ componentName: 'xxx' })).toBeTruthy();
    expect(buildFilter('xxx yyy')({ componentName: 'zzz' })).toBeFalsy();
  });

  it('registerMetadataTransducer', () => {
    expect(getRegisteredMetadataTransducers()).toHaveLength(2);
    // 插入到 legacy-issues 和 component-defaults 的中间
    registerMetadataTransducer((metadata) => metadata, 3, 'noop');
    expect(getRegisteredMetadataTransducers()).toHaveLength(3);

    registerMetadataTransducer((metadata) => metadata);
    expect(getRegisteredMetadataTransducers()).toHaveLength(4);
  });

  it('modifyBuiltinComponentAction', () => {
    modifyBuiltinComponentAction('copy', (action) => {
      expect(action.name).toBe('copy');
    });
  });
});

describe('transducers', () => {
  it('componentDefaults', () => {
    const meta1 = new ComponentMeta(designer, abcgroup);
    const meta2 = new ComponentMeta(designer, abcitem);
    const meta3 = new ComponentMeta(designer, abcnode);
    const meta4 = new ComponentMeta(designer, abcoption);
    expect(meta1.getMetadata().configure.component.nestingRule.childWhitelist).toEqual(['Abc']);
    expect(meta2.getMetadata().configure.component.nestingRule.parentWhitelist).toEqual(['Abc']);
    expect(meta3.getMetadata().configure.component.nestingRule.parentWhitelist).toEqual(['Abc', 'Abc.Node']);
    expect(meta4.getMetadata().configure.component.nestingRule.parentWhitelist).toEqual(['Abc']);
  });
});

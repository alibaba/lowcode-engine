import '../fixtures/window';
import { Node, Designer, getConvertedExtraKey } from '@ali/lowcode-designer';
import { Editor, globalContext } from '@ali/lowcode-editor-core';
import { initNodeReducer } from '../../src/props-reducers/init-node-reducer';
import formSchema from '../fixtures/schema/form';

describe('initNodeReducer 测试', () => {
  it('initNodeReducer 测试 - 有 initials', () => {
    const mockNode = {
      componentMeta: {
        getMetadata() {
          return {
            experimental: {
              initials: [
                {
                  name: 'propA',
                  initial: () => '111',
                },
                {
                  name: 'propB',
                  initial: () => '111',
                },
                {
                  name: 'propC',
                  initial: () => {
                    throw new Error('111');
                  },
                },
                {
                  name: 'propD',
                  initial: () => '111',
                },
                {
                  name: 'propE',
                  initial: () => '111',
                },
                {
                  name: 'propF',
                  initial: () => '111',
                },
              ],
            },
          };
        },
        prototype: {
          options: {
            configure: [
              {
                name: 'propF',
                setter: {
                  type: {
                    displayName: 'I18nSetter',
                  },
                },
              },
            ],
          },
        },
      },
      settingEntry: {
        getProp(propName) {
          return { name: propName };
        },
      },
      props: {
        has() {
          return false;
        },
        add() {},
      },
    };
    expect(
      initNodeReducer(
        {
          propA: '111',
          propC: '222',
          propD: {
            type: 'JSExpression',
            mock: '111',
          },
          propE: {
            type: 'variable',
            value: '111',
          },
        },
        mockNode,
      ),
    ).toEqual({
      propA: '111',
      propB: '111',
      propC: '222',
      propD: {
        type: 'JSExpression',
        mock: '111',
      },
      propE: {
        type: 'variable',
        value: '111',
      },
      propF: {
        type: 'i18n',
        use: 'zh_CN',
        zh_CN: '111',
      },
    });
  });

  it('filterReducer 测试 - 无 initials', () => {
    const mockNode = {
      componentMeta: {
        getMetadata() {
          return {
            experimental: {},
          };
        },
      },
      settingEntry: {
        getProp(propName) {
          return { name: propName };
        },
      },
    };
    expect(
      initNodeReducer(
        {
          propA: 111,
        },
        mockNode,
      ),
    ).toEqual({
      propA: 111,
    });
  });

  describe('i18n', () => {
    const mockNode = {
      componentMeta: {
        getMetadata() {
          return {
            experimental: {
              initials: [
                {
                  name: 'propF',
                  initial: () => 111,
                },
              ],
            },
          };
        },
      },
      prototype: {
        options: {
          configure: [
            {
              name: 'propF',
              setter: {
                type: {
                  displayName: 'I18nSetter',
                },
              },
            },
          ],
        },
      },
      props: {
        has() {
          return false;
        },
        add() {},
      },
    };

    it('isI18NObject(ov): true', () => {
      expect(
        initNodeReducer(
          {
            propF: {
              type: 'i18n',
              zh_CN: '222',
            },
          },
          mockNode,
        ),
      ).toEqual({
        propF: {
          type: 'i18n',
          zh_CN: '222',
        },
      });
    });

    it('isJSExpression(ov): true', () => {
      expect(
        initNodeReducer(
          {
            propF: {
              type: 'JSExpression',
              value: 'state.a',
            },
          },
          mockNode,
        ),
      ).toEqual({
        propF: {
          type: 'JSExpression',
          value: 'state.a',
        },
      });
    });

    it('isJSBlock(ov): true', () => {
      expect(
        initNodeReducer(
          {
            propF: {
              type: 'JSBlock',
              value: 'state.a',
            },
          },
          mockNode,
        ),
      ).toEqual({
        propF: {
          type: 'JSBlock',
          value: 'state.a',
        },
      });
    });

    it('isJSSlot(ov): true', () => {
      expect(
        initNodeReducer(
          {
            propF: {
              type: 'JSSlot',
              value: 'state.a',
            },
          },
          mockNode,
        ),
      ).toEqual({
        propF: {
          type: 'JSSlot',
          value: 'state.a',
        },
      });
    });

    it('isVariable(ov): true', () => {
      expect(
        initNodeReducer(
          {
            propF: {
              type: 'variable',
              value: 'state.a',
            },
          },
          mockNode,
        ),
      ).toEqual({
        propF: {
          type: 'variable',
          value: 'state.a',
        },
      });
    });

    it('isI18NObject(v): false', () => {
      const mockNode = {
        componentMeta: {
          getMetadata() {
            return {
              experimental: {
                initials: [
                  {
                    name: 'propF',
                    initial: () => 111,
                  },
                ],
              },
            };
          },
          prototype: {
            options: {
              configure: [
                {
                  name: 'propF',
                  setter: {
                    type: {
                      displayName: 'I18nSetter',
                    },
                  },
                },
              ],
            },
          },
        },
        props: {
          has() {
            return false;
          },
          add() {},
        },
      };
      expect(
        initNodeReducer(
          {
            propF: {
              type: 'variable',
              value: 'state.a',
            },
          },
          mockNode,
        ),
      ).toEqual({
        propF: {
          type: 'variable',
          value: 'state.a',
        },
      });
    });

    it('isI18NObject(v): false', () => {
      const mockNode = {
        componentMeta: {
          getMetadata() {
            return {
              experimental: {
                initials: [{
                  name: 'propF',
                  initial: () => 111,
                }],
              },
            };
          },
        },
        prototype: {
          options: {
            configure: [
              {
                name: 'propF',
                setter: {
                  type: {
                    displayName: 'I18nSetter',
                  },
                },
              },
            ],
          },
        },
        props: {
          has() {
            return false;
          },
          add() {},
        },
      };
      expect(
        initNodeReducer(
          {
            propF: {
              type: 'variable',
              value: 'state.a',
            },
          },
          mockNode,
        ),
      ).toEqual({
        propF: {
          type: 'variable',
          value: 'state.a',
        },
      });
    });
  });

  it('成功使用兼容后的 i18n 对象', () => {
    const mockNode = {
      componentMeta: {
        getMetadata() {
          return {
            experimental: {
              initials: [{
                name: 'propF',
                initial: () => {
                  return {
                    type: 'i18n',
                    use: 'zh_CN',
                    zh_CN: '111',
                  };
                },
              }],
            },
          };
        },
        prototype: {
          options: {
            configure: [
              {
                name: 'propF',
                setter: {
                  type: {
                    displayName: 'I18nSetter',
                  },
                },
              },
            ],
          },
        },
      },
      props: {
        has() {
          return false;
        },
        add() {},
      },
    };
    expect(
      initNodeReducer(
        {
          propF: '111',
        },
        mockNode,
      ),
    ).toEqual({
      propF: {
        type: 'i18n',
        use: 'zh_CN',
        zh_CN: '111',
      },
    });
  });

  describe('fieldId', () => {
    const mockNode = {
      componentMeta: {
        getMetadata() {
          return {
            experimental: {
              initials: [
                {
                  name: 'propA',
                  initial: () => '111',
                },
              ],
            },
          };
        },
      },
      settingEntry: {
        getProp(propName) {
          return { name: propName };
        },
      },
      props: {
        has() {
          return false;
        },
        add() {},
      },
    };
    const editor = new Editor();
    globalContext.register(editor, Editor);
    const designer = new Designer({ editor });
    editor.set('designer', designer);
    designer.project.open(formSchema);
    it('fieldId - 已存在', () => {
      expect(initNodeReducer({
        propA: '111',
        fieldId: 'form',
      }, mockNode)).toEqual({
        propA: '111',
        fieldId: undefined,
      });
    });

    it('fieldId - 已存在，但有全局关闭标识', () => {
      window.__disable_unique_id_checker__ = true;
      expect(initNodeReducer({
        propA: '111',
        fieldId: 'form',
      }, mockNode)).toEqual({
        propA: '111',
        fieldId: 'form',
      });
    });
  });
});

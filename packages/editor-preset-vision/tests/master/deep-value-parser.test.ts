import '../fixtures/window';
import { deepValueParser } from '../../src/deep-value-parser';
import { editor } from '../../src/editor';

describe('deepValueParser 测试', () => {
  it('null & undefined', () => {
    expect(deepValueParser()).toBeNull;
    expect(deepValueParser()).toBeUndefined;
  });

  it('designMode: design', () => {
    expect(deepValueParser({
      a: {
        type: 'variable',
        variable: 'state.a',
        value: '111',
      },
      b: {
        type: 'JSExpression',
        value: 'state.b',
        mock: '222',
      },
      c: {
        type: 'i18n',
        use: 'zh_CN',
        zh_CN: '中文',
        en_US: 'eng',
      },
      slot: {
        type: 'JSSlot',
        value: [{
          componentName: 'Div',
          props: {},
        }],
      },
      arr: [
        {
          type: 'variable',
          variable: 'state.a',
          value: '111',
        },
        {
          type: 'variable',
          variable: 'state.b',
          value: '111',
        },
      ],
    })).toMatchSnapshot();
  });

  it('designMode: live', () => {
    editor.set('designMode', 'live');
    expect(deepValueParser({
      a: {
        type: 'variable',
        variable: 'state.a',
        value: '111',
      },
      b: {
        type: 'JSExpression',
        value: 'state.b',
        mock: '222',
      },
      c: {
        type: 'i18n',
        use: 'zh_CN',
        zh_CN: '中文',
        en_US: 'eng',
      },
      arr: [
        {
          type: 'variable',
          variable: 'state.a',
          value: '111',
        },
        {
          type: 'variable',
          variable: 'state.b',
          value: '111',
        },
      ],
    })).toMatchSnapshot();
  });
});

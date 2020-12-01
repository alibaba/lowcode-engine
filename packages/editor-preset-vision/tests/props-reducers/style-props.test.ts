import '../fixtures/window';
import { Node, Designer, getConvertedExtraKey } from '@ali/lowcode-designer';
import { Editor, globalContext } from '@ali/lowcode-editor-core';
import { stylePropsReducer } from '../../src/props-reducers/style-reducer';
import formSchema from '../fixtures/schema/form';

const editor: Editor = new Editor();
globalContext.register(editor, Editor);

beforeEach(() => {
  // const designer = new Designer({ editor });
  editor.set('designer', {
    currentDocument: {
      simulator: {
        contentDocument: document,
      },
    },
  });
});
// designer.project.open(formSchema);

describe('stylePropsReducer 测试', () => {
  it('无 style 相关属性', () => {
    expect(stylePropsReducer({ propA: 1 })).toEqual({ propA: 1 });
  });

  it('__style__', () => {
    const props = {
      __style__: {
        'font-size': '50px',
      },
    };
    const mockNode = { id: 'id1' };
    expect(stylePropsReducer(props, mockNode)).toEqual({
      className: '_css_pesudo_id1',
      __style__: {
        'font-size': '50px',
      },
    });
    expect(document.querySelector('#_style_pesudo_id1')).textContent =
      '._css_pesudo_id1 { font-size: 50px; }';
  });

  it('__style__ - 无 contentDocument', () => {
    editor.set('designer', {
      currentDocument: {
        simulator: {
          contentDocument: undefined,
        },
      },
    });
    const props = {
      __style__: {
        'font-size': '50px',
      },
    };
    const mockNode = { id: 'id11' };
    expect(stylePropsReducer(props, mockNode)).toEqual({
      __style__: {
        'font-size': '50px',
      },
    });
    expect(document.querySelector('#_style_pesudo_id11')).toBeNull;
  });

  it('__style__ - css id 已存在', () => {
    const s = document.createElement('style');
    s.setAttribute('type', 'text/css');
    s.setAttribute('id', '_style_pesudo_id2');
    document.getElementsByTagName('head')[0].appendChild(s);
    s.appendChild(document.createTextNode('body {}'));
    const props = {
      __style__: {
        'font-size': '50px',
      },
    };
    const mockNode = { id: 'id2' };
    expect(stylePropsReducer(props, mockNode)).toEqual({
      className: '_css_pesudo_id2',
      __style__: {
        'font-size': '50px',
      },
    });
    expect(document.querySelector('#_style_pesudo_id2')).textContent =
      '._css_pesudo_id2 { font-size: 50px; }';
  });

  it('containerStyle', () => {
    const props = {
      containerStyle: {
        'font-size': '50px',
      },
    };
    const mockNode = { id: 'id3' };
    expect(stylePropsReducer(props, mockNode)).toEqual({
      className: '_css_pesudo_id3',
      containerStyle: {
        'font-size': '50px',
      },
    });
    expect(document.querySelector('#_style_pesudo_id3')).textContent =
      '._css_pesudo_id3 { font-size: 50px; }';
  });

  it('pageStyle', () => {
    const props = {
      pageStyle: {
        'font-size': '50rpx',
      },
    };
    const mockNode = { id: 'id4' };
    expect(stylePropsReducer(props, mockNode)).toEqual({
      className: 'engine-document',
      pageStyle: {
        'font-size': '50rpx',
      },
    });
    expect(document.querySelector('#_style_pesudo_id4')).textContent =
      '._css_pesudo_id4 { font-size: 50px; }';
  });
});

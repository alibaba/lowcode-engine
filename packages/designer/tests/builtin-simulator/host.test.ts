import React from 'react';
import set from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';
import '../fixtures/window';
import { Editor, globalContext } from '@ali/lowcode-editor-core';
import {
  AssetLevel,
  Asset,
  AssetList,
  assetBundle,
  assetItem,
  AssetType,
} from '@ali/lowcode-utils';
import { Project } from '../../src/project/project';
import { Node } from '../../src/document/node/node';
import { Designer } from '../../src/designer/designer';
import { DocumentModel } from '../../src/document/document-model';
import formSchema from '../fixtures/schema/form';
import { getMockDocument, getMockWindow, getMockEvent } from '../utils';
import { BuiltinSimulatorHost } from '../../src/builtin-simulator/host';
import { fireEvent } from '@testing-library/react';

const editor = new Editor();

describe('host 测试', () => {
  let editor: Editor;
  let designer: Designer;
  let project: Project;
  let doc: DocumentModel;

  beforeAll(() => {
    editor = new Editor();
    !globalContext.has(Editor) && globalContext.register(editor, Editor);
  });

  beforeEach(() => {
    designer = new Designer({ editor });
    project = designer.project;
    doc = project.createDocument(formSchema);
  });

  afterEach(() => {
    project.unload();
    project.mountSimulator(undefined);
    designer._componentMetasMap.clear();
    designer.purge();
    designer = null;
    project = null;
  });

  describe('基础方法测试', () => {
    it('setProps / get / set', async () => {
      const host = new BuiltinSimulatorHost(designer.project);
      expect(host.currentDocument).toBe(designer.project.currentDocument);
      expect(host.renderEnv).toBe('default');
      expect(host.device).toBe('default');
      expect(host.deviceClassName).toBeUndefined();
      expect(host.requestHandlersMap).toBeNull();
      host.setProps({
        renderEnv: 'rax',
        device: 'mobile',
        deviceClassName: 'mobile-rocks',
        componentsAsset: [{
          type: AssetType.JSText,
          content: 'console.log(1)',
        }, {
          type: AssetType.JSUrl,
          content: '//path/to/js',
        }],
        theme: {
          type: AssetType.CSSText,
          content: '.theme {font-size: 50px;}',
        },
        requestHandlersMap: {},
      });
      expect(host.renderEnv).toBe('rax');
      expect(host.device).toBe('mobile');
      expect(host.deviceClassName).toBe('mobile-rocks');
      expect(host.componentsAsset).toEqual([{
        type: AssetType.JSText,
        content: 'console.log(1)',
      }, {
        type: AssetType.JSUrl,
        content: '//path/to/js',
      }]);
      expect(host.theme).toEqual({
        type: AssetType.CSSText,
        content: '.theme {font-size: 50px;}',
      });
      expect(host.componentsMap).toBe(designer.componentsMap);
      expect(host.requestHandlersMap).toEqual({});

      host.set('renderEnv', 'vue');
      expect(host.renderEnv).toBe('vue');

      expect(host.getComponentContext).toThrow('Method not implemented.');
    });

    it('connect', () => {});
    it('mountViewport', () => {});
    it('mountContentFrame', () => {});
    it('autorun', () => {});
    it('purge', () => {});

  });

  describe('事件测试', () => {
    it('setupDragAndClick', () => {

    });
  });

  it('事件测试', async () => {
    const host = new BuiltinSimulatorHost(designer.project);
    const mockDocument = getMockDocument();
    const mockWindow = getMockWindow(mockDocument);
    const mockIframe = {
      contentWindow: mockWindow,
      contentDocument: mockDocument,
      dispatchEvent() {},
    };

    // 非法分支测试
    host.mountContentFrame();
    expect(host._iframe).toBeUndefined();

    host.set('library', [{
      package: '@ali/vc-deep',
      library: 'lib',
      urls: ['a.js', 'b.js']
    }]);

    host.componentsConsumer.consume(() => {});
    host.injectionConsumer.consume(() => {});
    await host.mountContentFrame(mockIframe);

    expect(host.contentWindow).toBe(mockWindow);

    mockDocument.triggerEventListener(
      'mouseover',
      getMockEvent(mockDocument.createElement('div')),
      host,
    );
    mockDocument.triggerEventListener(
      'mouseleave',
      getMockEvent(mockDocument.createElement('div')),
      host,
    );
    mockDocument.triggerEventListener(
      'mousedown',
      getMockEvent(mockDocument.createElement('div')),
      host,
    );
    mockDocument.triggerEventListener(
      'mouseup',
      getMockEvent(mockDocument.createElement('div')),
      host,
    );
    mockDocument.triggerEventListener(
      'mousemove',
      getMockEvent(mockDocument.createElement('div')),
      host,
    );
    mockDocument.triggerEventListener(
      'click',
      getMockEvent(document.createElement('input')),
      host,
    );
    mockDocument.triggerEventListener(
      'dblclick',
      getMockEvent(mockDocument.createElement('div')),
      host,
    );
    mockDocument.triggerEventListener(
      'contextmenu',
      getMockEvent(mockDocument.createElement('div')),
      host,
    );
  })
});

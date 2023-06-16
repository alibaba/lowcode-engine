import { IPublicTypePluginMeta } from './../../../../lib/packages/types/src/shell/type/plugin-meta.d';
import '../fixtures/window';
import {
  Editor,
  globalContext,
  Hotkey as InnerHotkey,
  Setters as InnerSetters,
} from '@alilc/lowcode-editor-core';
import { Workspace as InnerWorkspace } from '@alilc/lowcode-workspace';
import {
  AssetType,
} from '@alilc/lowcode-utils';
import {
  IPublicEnumDragObjectType,
} from '@alilc/lowcode-types';
import { Project } from '../../src/project/project';
import pageMetadata from '../fixtures/component-metadata/page';
import { Designer } from '../../src/designer/designer';
import { DocumentModel } from '../../src/document/document-model';
import formSchema from '../fixtures/schema/form';
import { getMockDocument, getMockWindow, getMockEvent, delayObxTick } from '../utils';
import { BuiltinSimulatorHost } from '../../src/builtin-simulator/host';
import { fireEvent } from '@testing-library/react';
import { shellModelFactory } from '../../../engine/src/modules/shell-model-factory';
import { Setters, Workspace } from '@alilc/lowcode-shell';
import { ILowCodePluginContextApiAssembler, ILowCodePluginContextPrivate, LowCodePluginManager } from '@alilc/lowcode-designer';

describe('Host 测试', () => {
  let editor: Editor;
  let designer: Designer;
  let project: Project;
  let doc: DocumentModel;
  let host: BuiltinSimulatorHost;

  beforeAll(() => {
    editor = new Editor();
    const pluginContextApiAssembler: ILowCodePluginContextApiAssembler = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      assembleApis: (context: ILowCodePluginContextPrivate, pluginName: string, meta: IPublicTypePluginMeta) => {
        context.project = project;
        const eventPrefix = meta?.eventPrefix || 'common';
        context.workspace = workspace;
      },
    };
    const innerPlugins = new LowCodePluginManager(pluginContextApiAssembler);
    const innerWorkspace = new InnerWorkspace(() => {}, {});
    const workspace = new Workspace(innerWorkspace);
    editor.set('innerHotkey', new InnerHotkey())
    editor.set('setters', new Setters(new InnerSetters()));
    editor.set('innerPlugins' as any, innerPlugins);
    !globalContext.has(Editor) && globalContext.register(editor, Editor);
    !globalContext.has('workspace') && globalContext.register(innerWorkspace, 'workspace');
  });

  beforeEach(() => {
    designer = new Designer({ editor, shellModelFactory });
    project = designer.project;
    designer.createComponentMeta(pageMetadata);
    doc = project.createDocument(formSchema);
    host = new BuiltinSimulatorHost(designer.project, designer);
  });

  afterEach(() => {
    project.unload();
    project.mountSimulator(undefined);
    designer._componentMetasMap.clear();
    designer.purge();
    host.purge();
    designer = null;
    project = null;
    host = null;
  });

  describe('基础方法测试', () => {
    it('setProps / get / set', async () => {
      expect(host.currentDocument).toBe(designer.project.currentDocument);
      expect(host.renderEnv).toBe('default');
      expect(host.device).toBe('default');
      expect(host.deviceClassName).toBeUndefined();
      expect(host.requestHandlersMap).toBeNull();
      host.setProps({
        renderEnv: 'rax',
        device: 'mobile',
        deviceClassName: 'mobile-rocks',
        componentsAsset: [
          {
            type: AssetType.JSText,
            content: 'console.log(1)',
          },
          {
            type: AssetType.JSUrl,
            content: '//path/to/js',
          },
        ],
        theme: {
          type: AssetType.CSSText,
          content: '.theme {font-size: 50px;}',
        },
        requestHandlersMap: {},
      });
      expect(host.renderEnv).toBe('rax');
      expect(host.device).toBe('mobile');
      expect(host.deviceClassName).toBe('mobile-rocks');
      expect(host.componentsAsset).toEqual([
        {
          type: AssetType.JSText,
          content: 'console.log(1)',
        },
        {
          type: AssetType.JSUrl,
          content: '//path/to/js',
        },
      ]);
      expect(host.theme).toEqual({
        type: AssetType.CSSText,
        content: '.theme {font-size: 50px;}',
      });
      expect(host.componentsMap).toEqual(designer.componentsMap);
      expect(host.requestHandlersMap).toEqual({});

      host.set('renderEnv', 'vue');
      expect(host.renderEnv).toBe('vue');

      expect(host.getComponentContext).toThrow('Method not implemented.');
    });

    it('connect', () => {
      const mockFn = jest.fn();
      const mockRenderer = { isSimulatorRenderer: true };
      host.connect(mockRenderer, mockFn);
      expect(host.renderer).toEqual(mockRenderer);

      // await delayObxTick();
      expect(mockFn).toHaveBeenCalled();
    });

    it('mountViewport', () => {
      const mockBounds = {
        top: 10,
        bottom: 100,
        left: 10,
        right: 100,
      };
      host.mountViewport({
        getBoundingClientRect() {
          return mockBounds;
        },
      });
      expect(host.viewport.bounds).toEqual(mockBounds);
    });

    it('autorun', () => {
      const mockFn = jest.fn();
      host.autorun(mockFn);
      expect(mockFn).toHaveBeenCalled();
    });

    it('purge', () => {
      host.purge();
    });

    it('isEnter', () => {
      const mockBounds = {
        top: 10,
        bottom: 100,
        left: 10,
        right: 100,
      };
      host.mountViewport({
        getBoundingClientRect() {
          return mockBounds;
        },
      });
      expect(
        host.isEnter({
          globalX: 5,
          globalY: 50,
        }),
      ).toBeFalsy();
      expect(
        host.isEnter({
          globalX: 115,
          globalY: 50,
        }),
      ).toBeFalsy();
      expect(
        host.isEnter({
          globalX: 50,
          globalY: 50,
        }),
      ).toBeTruthy();
      expect(
        host.isEnter({
          globalX: 50,
          globalY: 5,
        }),
      ).toBeFalsy();
      expect(
        host.isEnter({
          globalX: 50,
          globalY: 150,
        }),
      ).toBeFalsy();
      expect(
        host.isEnter({
          globalX: 150,
          globalY: 150,
        }),
      ).toBeFalsy();
    });

    it('fixEvent', () => {
      expect(host.fixEvent({ fixed: true, clientX: 1 })).toEqual({ fixed: true, clientX: 1 });
    });

    it('findDOMNodes', () => {
      host.connect({
        findDOMNodes: () => {
          return null;
        },
      }, () => {});
      expect(host.findDOMNodes()).toBeNull();

      const mockElems = [document.createElement('div')];
      host.connect({
        findDOMNodes: () => {
          return mockElems;
        },
      }, () => {});
      expect(host.findDOMNodes({})).toBe(mockElems);
      expect(host.findDOMNodes({}, 'xxx')).toBeNull();
      expect(host.findDOMNodes({}, 'div')).toEqual(mockElems);
    });

    it('getClosestNodeInstance', () => {
      const mockFn = jest.fn(() => {
        return {
          node: {},
          nodeId: 'id',
          docId: 'docId',
        };
      });
      host.connect({
        getClosestNodeInstance: mockFn,
      }, () => {});
      expect(host.getClosestNodeInstance()).toEqual({
        node: {},
        nodeId: 'id',
        docId: 'docId',
      });
    });

    it('getNodeInstanceFromElement', () => {
      expect(host.getNodeInstanceFromElement()).toBeNull();
      host.getClosestNodeInstance = () => {
        return null;
      };
      expect(host.getNodeInstanceFromElement({})).toBeNull();
      host.getClosestNodeInstance = () => {
        return {
          docId: project.currentDocument.id,
          nodeId: 'xxx',
        };
      };
      expect(host.getNodeInstanceFromElement({})).toBeTruthy();
    });

    it('getDropContainer', () => {
      host.getNodeInstanceFromElement = () => {
        return {
          node: doc.rootNode,
        };
      };
      host.getDropContainer({
        target: {},
        dragObject: {
          type: IPublicEnumDragObjectType.Node,
          nodes: [doc.getNode('page')],
        },
      });
    });

    it('getComponentInstances', () => {
      const mockNode = {
        document: { id: 'docId' },
      };
      host.instancesMap = {
        docId: {
          get() {
            return [{ comp: true }, { comp2: true }];
          },
        },
      };
      expect(host.getComponentInstances(mockNode))
        .toEqual([{ comp: true }, { comp2: true }]);

      const mockInst = { inst: true };
      host.getClosestNodeInstance = () => {
        return {
          instance: mockInst,
        };
      };
      expect(host.getComponentInstances(mockNode, { instance: mockInst }))
        .toEqual([{ comp: true }, { comp2: true }]);
    });

    it('setNativeSelection / setDraggingState / setCopyState / clearState', () => {
      const mockFn1 = jest.fn();
      const mockFn2 = jest.fn();
      const mockFn3 = jest.fn();
      const mockFn4 = jest.fn();
      host.connect({
        setNativeSelection: mockFn1,
        setDraggingState: mockFn2,
        setCopyState: mockFn3,
        clearState: mockFn4,
      }, () => {});
      host.setNativeSelection(true);
      expect(mockFn1).toHaveBeenCalledWith(true);
      host.setDraggingState(false);
      expect(mockFn2).toHaveBeenCalledWith(false);
      host.setCopyState(true);
      expect(mockFn3).toHaveBeenCalledWith(true);
      host.clearState();
      expect(mockFn4).toHaveBeenCalled();
    });

    it('sensorAvailable / deactiveSensor', () => {
      expect(host.sensorAvailable).toBeTruthy();
      host.deactiveSensor();
      expect(host.sensing).toBeFalsy();
    });

    it('getComponent', () => {
      host.connect({
        getComponent: () => {
          return {};
        },
      }, () => {});
      expect(host.getComponent()).toEqual({});
      expect(host.createComponent()).toBeNull();
      expect(host.setSuspense()).toBeFalsy();
    });

    it('setInstance', () => {
      host.instancesMap = {};
      host.setInstance('docId1', 'id1', [{}]);
      expect(host.instancesMap.docId1.get('id1')).toEqual([{}]);

      host.setInstance('docId1', 'id1', null);
      expect(host.instancesMap.docId1.get('id1')).toBeUndefined();
    });
  });

  describe('locate 方法', () => {
    beforeEach(() => {
      const mockBounds = {
        top: 10,
        bottom: 100,
        left: 10,
        right: 100,
      };
      host.mountViewport({
        getBoundingClientRect() {
          return mockBounds;
        },
      });
    });
    it('locate，没有 nodes', () => {
      expect(host.locate({
        dragObject: {
          type: IPublicEnumDragObjectType.Node,
          nodes: [],
        },
      })).toBeUndefined();
    });
    it('locate，没有 document', () => {
      project.removeDocument(doc);
      expect(host.locate({
        dragObject: {
          type: IPublicEnumDragObjectType.Node,
          nodes: [doc.getNode('page')],
        },
      })).toBeNull();
    });
    it('notFoundComponent', () => {
      expect(host.locate({
        dragObject: {
          type: IPublicEnumDragObjectType.Node,
          nodes: [doc.getNode('form')],
        },
      })).toBeUndefined();
    })
    it('locate', () => {
      host.locate({
        dragObject: {
          type: IPublicEnumDragObjectType.Node,
          nodes: [doc.getNode('page')],
        },
      });
    });
  });

  describe('事件测试', () => {
    it('setupDragAndClick', () => {});
    it('setupContextMenu', async () => {
      const mockDocument = getMockDocument();
      const mockWindow = getMockWindow(mockDocument);
      const mockIframe = {
        contentWindow: mockWindow,
        contentDocument: mockDocument,
        dispatchEvent() {},
      };

      host.set('library', [
        {
          package: '@ali/vc-deep',
          library: 'lib',
          urls: ['a.js', 'b.js'],
        },
      ]);

      host.componentsConsumer.consume(() => {});
      host.injectionConsumer.consume(() => {});
      await host.mountContentFrame(mockIframe);

      host.setupContextMenu();
      host.getNodeInstanceFromElement = () => {
        return {
          node: { componentMeta: { componentName: 'Button', getMetadata() { return {} } }, contains() {} },
        };
      };
      const mockFn = jest.fn();
      host.designer.editor.on('designer.builtinSimulator.contextmenu', mockFn);
      fireEvent.contextMenu(document, {});
      // TODO:
      // expect(mockFn).toHaveBeenCalledWith({ selected: 'Button' });
    });
  });

  it('事件测试', async () => {
    const mockDocument = getMockDocument();
    const mockWindow = getMockWindow(mockDocument);
    const mockIframe = {
      contentWindow: mockWindow,
      contentDocument: mockDocument,
      dispatchEvent() {},
    };

    // 非法分支测试
    host.mountContentFrame();
    expect(host._iframe).toBeUndefined();

    host.set('library', [
      {
        package: '@ali/vc-deep',
        library: 'lib',
        urls: ['a.js', 'b.js'],
      },
    ]);

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
    mockDocument.triggerEventListener('click', getMockEvent(document.createElement('input')), host);
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
  });
});

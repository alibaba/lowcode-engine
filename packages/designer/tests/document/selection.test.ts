import set from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';
import '../fixtures/window';
import { Project } from '../../src/project/project';
import { Node } from '../../src/document/node/node';
import { Designer } from '../../src/designer/designer';
import formSchema from '../fixtures/schema/form';
import { getIdsFromSchema, getNodeFromSchemaById } from '../utils';

const mockCreateSettingEntry = jest.fn();
jest.mock('../../src/designer/designer', () => {
  return {
    Designer: jest.fn().mockImplementation(() => {
      return {
        getComponentMeta() {
          return {
            getMetadata() {
              return { experimental: null };
            },
          };
        },
        transformProps(props) { return props; },
        createSettingEntry: mockCreateSettingEntry,
        postEvent() {},
      };
    }),
  };
});

let designer = null;
beforeAll(() => {
  designer = new Designer({});
});

describe('选择区测试', () => {
  it('常规方法', () => {
    const project = new Project(designer, {
      componentsTree: [
        formSchema,
      ],
    });
    project.open();
    expect(project).toBeTruthy();
    const { currentDocument } = project;
    const { nodesMap, selection } = currentDocument!;
    const selectionChangeHandler = jest.fn();
    selection.onSelectionChange(selectionChangeHandler);

    selection.select('form');
    expect(selectionChangeHandler).toHaveBeenCalledTimes(1);
    expect(selection.selected).toEqual(['form']);
    selectionChangeHandler.mockClear();

    selection.select('form');
    expect(selectionChangeHandler).toHaveBeenCalledTimes(0);
    expect(selection.selected).toEqual(['form']);

    selection.select('node_k1ow3cbj');
    expect(selectionChangeHandler).toHaveBeenCalledTimes(1);
    expect(selectionChangeHandler.mock.calls[0][0]).toEqual(['node_k1ow3cbj']);
    expect(selection.selected).toEqual(['node_k1ow3cbj']);
    selectionChangeHandler.mockClear();

    selection.selectAll(['node_k1ow3cbj', 'form']);
    expect(selectionChangeHandler).toHaveBeenCalledTimes(1);
    expect(selectionChangeHandler.mock.calls[0][0]).toEqual(['node_k1ow3cbj', 'form']);
    expect(selection.selected).toEqual(['node_k1ow3cbj', 'form']);
    selectionChangeHandler.mockClear();

    selection.remove('node_k1ow3cbj');
    expect(selectionChangeHandler).toHaveBeenCalledTimes(1);
    expect(selectionChangeHandler.mock.calls[0][0]).toEqual(['form']);
    expect(selection.selected).toEqual(['form']);
    selectionChangeHandler.mockClear();

    selection.clear();
    expect(selectionChangeHandler).toHaveBeenCalledTimes(1);
    expect(selectionChangeHandler.mock.calls[0][0]).toEqual([]);
    expect(selection.selected).toEqual([]);
    selectionChangeHandler.mockClear();

    // 无选中时调用 clear，不再触发事件
    selection.clear();
    expect(selectionChangeHandler).toHaveBeenCalledTimes(0);
    expect(selection.selected).toEqual([]);
    selectionChangeHandler.mockClear();
  });

  it('add 方法', () => {
    const project = new Project(designer, {
      componentsTree: [
        formSchema,
      ],
    });
    project.open();
    expect(project).toBeTruthy();
    const { currentDocument } = project;
    const { nodesMap, selection } = currentDocument!;
    const selectionChangeHandler = jest.fn();
    selection.onSelectionChange(selectionChangeHandler);

    selection.add('form');
    expect(selectionChangeHandler).toHaveBeenCalledTimes(1);
    expect(selectionChangeHandler.mock.calls[0][0]).toEqual(['form']);
    expect(selection.selected).toEqual(['form']);
    selectionChangeHandler.mockClear();

    // 再加一次相同的节点，不触发事件
    selection.add('form');
    expect(selectionChangeHandler).toHaveBeenCalledTimes(0);
    expect(selection.selected).toEqual(['form']);
    selectionChangeHandler.mockClear();

    selection.add('form2');
    expect(selectionChangeHandler).toHaveBeenCalledTimes(1);
    expect(selectionChangeHandler.mock.calls[0][0]).toEqual(['form', 'form2']);
    expect(selection.selected).toEqual(['form', 'form2']);
    selectionChangeHandler.mockClear();
  });

  it('dispose 方法', () => {
    const project = new Project(designer, {
      componentsTree: [
        formSchema,
      ],
    });
    project.open();
    expect(project).toBeTruthy();
    const { currentDocument } = project;
    const { nodesMap, selection } = currentDocument!;

    selection.selectAll(['form', 'node_k1ow3cbj', 'form2']);

    const selectionChangeHandler = jest.fn();
    selection.onSelectionChange(selectionChangeHandler);
    selection.dispose();

    expect(selectionChangeHandler).toHaveBeenCalledTimes(1);
    expect(selectionChangeHandler.mock.calls[0][0]).toEqual(['form', 'node_k1ow3cbj']);
    expect(selection.selected).toEqual(['form', 'node_k1ow3cbj']);
    selectionChangeHandler.mockClear();
  });

  it('dispose 方法', () => {
    const project = new Project(designer, {
      componentsTree: [
        formSchema,
      ],
    });
    project.open();
    expect(project).toBeTruthy();
    const { currentDocument } = project;
    const { nodesMap, selection } = currentDocument!;

    selection.selectAll(['form', 'node_k1ow3cbj', 'form2']);

    const selectionChangeHandler = jest.fn();
    selection.onSelectionChange(selectionChangeHandler);
    selection.dispose();

    expect(selectionChangeHandler).toHaveBeenCalledTimes(1);
    expect(selectionChangeHandler.mock.calls[0][0]).toEqual(['form', 'node_k1ow3cbj']);
    expect(selection.selected).toEqual(['form', 'node_k1ow3cbj']);
    selectionChangeHandler.mockClear();
  });

  it('containsNode 方法', () => {
    const project = new Project(designer, {
      componentsTree: [
        formSchema,
      ],
    });
    project.open();
    expect(project).toBeTruthy();
    const { currentDocument } = project;
    const { nodesMap, selection } = currentDocument!;
    const selectionChangeHandler = jest.fn();
    selection.onSelectionChange(selectionChangeHandler);

    selection.select('form');
    expect(selectionChangeHandler).toHaveBeenCalledTimes(1);
    expect(selectionChangeHandler.mock.calls[0][0]).toEqual(['form']);
    expect(selection.selected).toEqual(['form']);
    expect(selection.has('form')).toBe(true);
    expect(selection.containsNode(currentDocument?.getNode('form'))).toBe(true);
    expect(selection.containsNode(currentDocument?.getNode('node_k1ow3cbj'))).toBe(true);
    expect(selection.containsNode(currentDocument?.getNode('page'))).toBe(false);
    expect(selection.getNodes()).toEqual([currentDocument?.getNode('form')]);
    selectionChangeHandler.mockClear();

    selection.add('node_k1ow3cbj');
    expect(selection.selected).toEqual(['form', 'node_k1ow3cbj']);
    expect(selection.getTopNodes()).toEqual([currentDocument?.getNode('form')]);
    expect(selection.getTopNodes(true)).toEqual([currentDocument?.getNode('form')]);
  });

  it('containsNode 方法 - excludeRoot: true', () => {
    const project = new Project(designer, {
      componentsTree: [
        formSchema,
      ],
    });
    project.open();
    expect(project).toBeTruthy();
    const { currentDocument } = project;
    const { nodesMap, selection } = currentDocument!;
    const selectionChangeHandler = jest.fn();
    selection.onSelectionChange(selectionChangeHandler);

    selection.select('page');
    expect(selectionChangeHandler).toHaveBeenCalledTimes(1);
    expect(selectionChangeHandler.mock.calls[0][0]).toEqual(['page']);
    expect(selection.selected).toEqual(['page']);
    expect(selection.has('page')).toBe(true);
    expect(selection.containsNode(currentDocument?.getNode('form'))).toBe(true);
    expect(selection.containsNode(currentDocument?.getNode('form'), true)).toBe(false);
    selectionChangeHandler.mockClear();
  });

  it('containsNode 方法 - excludeRoot: true', () => {
    const project = new Project(designer, {
      componentsTree: [
        formSchema,
      ],
    });
    project.open();
    expect(project).toBeTruthy();
    const { currentDocument } = project;
    const { nodesMap, selection } = currentDocument!;
    const selectionChangeHandler = jest.fn();
    const dispose = selection.onSelectionChange(selectionChangeHandler);

    selection.select('form');
    expect(selectionChangeHandler).toHaveBeenCalledTimes(1);
    expect(selectionChangeHandler.mock.calls[0][0]).toEqual(['form']);
    selectionChangeHandler.mockClear();

    // dispose 后，selected 会被赋值，但是变更事件不会被触发
    dispose();
    selection.select('page');
    expect(selectionChangeHandler).toHaveBeenCalledTimes(0);
    expect(selection.selected).toEqual(['page']);
    selectionChangeHandler.mockClear();
  });
});
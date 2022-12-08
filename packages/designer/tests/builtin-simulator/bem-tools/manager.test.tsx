import '../../fixtures/window';
import { Editor } from '@alilc/lowcode-editor-core';
import { Designer } from '../../../src/designer/designer';
import { BemToolsManager } from '../../../src/builtin-simulator/bem-tools/manager';
import { shellModelFactory } from '../../../../engine/src/modules/shell-model-factory';

describe('Node 方法测试', () => {
  let editor: Editor;
  let designer: Designer;
  // let project: Project;
  // let doc: DocumentModel;
  let manager: BemToolsManager;

  beforeEach(() => {
    editor = new Editor();
    designer = new Designer({ editor, shellModelFactory });
    // project = designer.project;
    // doc = new DocumentModel(project, formSchema);
    manager = new BemToolsManager(designer);
  });

  afterEach(() => {
    // project.unload();
    designer.purge();
    editor = null;
    designer = null;
    // project = null;
  });

  it('addBemTools / removeBemTools / getAllBemTools', () => {
    manager.addBemTools({
      name: 't1',
      item: (props: any) => { return <div />; },
    });
    expect(manager.getAllBemTools().length).toBe(1);

    expect(() => {
      manager.addBemTools({
        name: 't1',
        item: (props: any) => { return <div />; },
      });
    }).toThrow(/already exists/);

    manager.removeBemTools('t2');
    expect(manager.getAllBemTools().length).toBe(1);

    manager.removeBemTools('t1');
    expect(manager.getAllBemTools().length).toBe(0);
  });
});
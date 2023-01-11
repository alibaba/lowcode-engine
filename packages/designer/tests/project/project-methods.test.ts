import '../fixtures/window';
import { Editor } from '@alilc/lowcode-editor-core';
import { Project } from '../../src/project/project';
import { DocumentModel } from '../../src/document/document-model';
import { Designer } from '../../src/designer/designer';
import formSchema from '../fixtures/schema/form';
import { shellModelFactory } from '../../../engine/src/modules/shell-model-factory';

describe.only('Project 方法测试', () => {
  let editor: Editor;
  let designer: Designer;
  let project: Project;
  let doc: DocumentModel;

  beforeEach(() => {
    editor = new Editor();
    designer = new Designer({ editor, shellModelFactory });
    project = designer.project;
    doc = new DocumentModel(project, formSchema);
  });

  afterEach(() => {
    project.unload();
    designer.purge();
    editor = null;
    designer = null;
    project = null;
  });

  it('simulator', () => {
    const mockSimulator = { isSimulator: true, a: 1 };
    project.mountSimulator(mockSimulator);
    expect(project.simulator).toEqual(mockSimulator);
  });

  it('config / get / set', () => {
    const mockConfig = { version: '1.0.0', componentsTree: [] };
    project.config = mockConfig;
    expect(project.config).toEqual(mockConfig);
    const mockConfig2 = { version: '2.0.0', componentsTree: [] };
    project.set('config', mockConfig2);
    expect(project.get('config')).toEqual(mockConfig2);

    project.set('version', '2.0.0');
    expect(project.get('version')).toBe('2.0.0');
  });

  it('load', () => {
    project.load({
      componentsTree: [{
        componentName: 'Page',
        fileName: 'f1',
      }],
    }, 'f1');
    expect(project.currentDocument?.fileName).toBe('f1');
  });

  it.skip('setSchema', () => {
    project.load({
      componentsTree: [{
        componentName: 'Page',
        fileName: 'f1',
      }],
    }, true);
    project.setSchema({
      componentsTree: [{
        componentName: 'Page',
        props: { a: 1 },
      }],
    });
    expect(project.currentDocument?.rootNode?.propsData).toEqual({ a: 1 });
  });

  it('open / getDocument / checkExclusive', () => {
    project.load({
      componentsTree: [{
        componentName: 'Page',
        fileName: 'f1',
      }],
    });
    const doc1 = project.createDocument({
      componentName: 'Page',
      fileName: 'f2',
    });
    const doc2 = project.createDocument({
      componentName: 'Page',
      fileName: 'f3',
    });

    project.open();

    project.open('f2');
    expect(project.currentDocument).toBe(doc1);
    project.open('f3');
    expect(project.currentDocument).toBe(doc2);

    project.open('f1');
    expect(project.currentDocument?.fileName).toBe('f1');

    expect(project.open('not-existing')).toBeNull();

    project.open(doc2);
    expect(project.currentDocument).toBe(doc2);

    const doc3 = project.open({
      componentName: 'Page',
      fileName: 'f4',
    });
    expect(project.currentDocument).toBe(doc3);
    expect(project.documents.length).toBe(4);

    expect(project.getDocument(project.currentDocument?.id)).toBe(doc3);
    expect(project.getDocumentByFileName(project.currentDocument?.fileName)).toBe(doc3);
    expect(project.getDocumentByFileName('unknown')).toBeNull();
    expect(project.checkExclusive(project.currentDocument));

    expect(project.documents[0].opened).toBeTruthy();
    expect(project.documents[1].opened).toBeTruthy();
    expect(project.documents[2].opened).toBeTruthy();
    expect(project.documents[3].opened).toBeTruthy();
    expect(project.documents[0].suspensed).toBeTruthy();
    expect(project.documents[1].suspensed).toBeTruthy();
    expect(project.documents[2].suspensed).toBeTruthy();
    expect(project.documents[3].suspensed).toBeFalsy();

    project.closeOthers(project.currentDocument);
    expect(project.documents[0].opened).toBeFalsy();
    expect(project.documents[1].opened).toBeFalsy();
    expect(project.documents[2].opened).toBeFalsy();
    expect(project.documents[3].opened).toBeTruthy();
    expect(project.documents[0].suspensed).toBeTruthy();
    expect(project.documents[1].suspensed).toBeTruthy();
    expect(project.documents[2].suspensed).toBeTruthy();
    expect(project.documents[3].suspensed).toBeFalsy();
  });

  it('removeDocument', () => {
    const doc1 = project.createDocument({
      componentName: 'Page',
      fileName: 'f1',
    });
    project.removeDocument({});
    expect(project.documents.length).toBe(1);
  });

  it('simulatorProps', () => {
    designer._simulatorProps = { a: 1 };
    expect(designer.simulatorProps.a).toBe(1);
    designer._simulatorProps = () => ({ a: 1 });
    expect(designer.simulatorProps.a).toBe(1);
  });

  it('onCurrentDocumentChange', () => {
    const mockFn = jest.fn();
    const off = project.onCurrentDocumentChange(mockFn);

    project.open({
      componentName: 'Page',
    });

    expect(mockFn).toHaveBeenCalled();

    off();
    mockFn.mockClear();
    project.open({
      componentName: 'Page',
    });
    expect(mockFn).not.toHaveBeenCalled();
  });

  it('setRendererReady / onRendererReady', () => {
    const mockFn = jest.fn();
    const off = project.onRendererReady(mockFn);
    project.setRendererReady({ a: 1 });
    expect(mockFn).toHaveBeenCalledWith({ a: 1 });
    off();
    mockFn.mockClear();
    project.setRendererReady({ a: 1 });
    expect(mockFn).not.toHaveBeenCalled();
  });
});

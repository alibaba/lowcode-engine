import { designer } from './editor';
import { RootSchema } from '@ali/lowcode-types';
import { DocumentModel } from '@ali/lowcode-designer';

const { project } = designer;

export interface OldPageData {
  id: string;
  componentsTree: RootSchema[];
  [dataAddon: string]: any;
}

const pages = Object.assign(project, {
  setPages(pages: OldPageData[]) {
    if (!pages || !Array.isArray(pages) || pages.length === 0) {
      throw new Error('pages schema 不合法');
    }

    if (pages[0].componentsTree[0]) {
      pages[0].componentsTree[0].componentName = 'Page';
      // FIXME
      pages[0].componentsTree[0].lifeCycles = {};
      pages[0].componentsTree[0].methods = {};
    }

    project.load({
      version: '1.0.0',
      componentsMap: [],
      componentsTree: pages[0].componentsTree,
    }, true);
  },
  addPage(data: OldPageData) {
    return project.open(data.layout);
  },
  getPage(fnOrIndex: ((page: DocumentModel) => boolean) | number) {
    if (typeof fnOrIndex === 'number') {
      return project.documents[fnOrIndex];
    } else if (typeof fnOrIndex === 'function') {
      return project.documents.find(fnOrIndex);
    }
    return null;
  },
  removePage(page: DocumentModel) {
    page.remove();
  },
  getPages() {
    return project.documents;
  },
  setCurrentPage(page: DocumentModel) {
    page.active();
  },
  getCurrentPage() {
    return project.currentDocument;
  },
  onPagesChange() {
    // noop
  },
  onCurrentPageChange(fn: (page: DocumentModel) => void) {
    return project.onCurrentDocumentChange(fn);
  },
  toData() {
    return project.documents.map(doc => doc.toData());
  }
});

Object.defineProperty(pages, 'currentPage', {
  get() {
    return project.currentDocument;
  }
})

export default pages;

import { designer } from './editor';
import { RootSchema } from '@ali/lowcode-types';
import { DocumentModel } from '@ali/lowcode-designer';

const { project } = designer;

export interface OldPageData {
  id: string;
  layout: RootSchema;
  [dataAddon: string]: any;
}

const pages = Object.assign(project, {
  setPages(pages: OldPageData[]) {
    // FIXME: upgrade schema
    pages[0].componentsTree.forEach((item: any) => {
      item.lifeCycles = {};
      item.methods = {};
    });
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
  }
});

Object.defineProperty(pages, 'currentPage', {
  get() {
    return project.currentDocument;
  }
})

export default pages;

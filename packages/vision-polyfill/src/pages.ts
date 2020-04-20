import { designer } from './editor';
import { RootSchema } from '@ali/lowcode-globals';
import { DocumentModel } from '@ali/lowcode-designer';

const { project } = designer;

export interface OldPageData {
  id: string;
  layout: RootSchema;
  [dataAddon: string]: any;
}

const pages = Object.assign(project, {
  setPages(pages: OldPageData[]) {
    project.load({
      version: '1.0.0',
      componentsMap: [],
      componentsTree: pages.map(page => page.layout),
    });
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

export default pages;

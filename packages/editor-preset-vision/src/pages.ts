import { designer } from './editor';
import { RootSchema } from '@ali/lowcode-types';
import { DocumentModel } from '@ali/lowcode-designer';

const { project } = designer;

export interface PageDataV1 {
  id: string;
  componentsTree: RootSchema[];
  layout: RootSchema;
  [dataAddon: string]: any;
}

export interface PageDataV2 {
  id: string;
  componentsTree: RootSchema[];
  [dataAddon: string]: any;
}

function isPageDataV1(obj: any): obj is PageDataV1 {
  return obj && obj.layout;
}
function isPageDataV2(obj: any): obj is PageDataV2 {
  return obj && obj.componentsTree && Array.isArray(obj.componentsTree);
}

type OldPageData = PageDataV1 | PageDataV2;

const pages = Object.assign(project, {
  setPages(pages: OldPageData[]) {
    if (!pages || !Array.isArray(pages) || pages.length === 0) {
      throw new Error('pages schema 不合法');
    }

    let componentsTree: any;
    if (isPageDataV1(pages[0])) {
      componentsTree = [pages[0].layout];
    } else {
      componentsTree = pages[0].componentsTree;
      if (componentsTree[0]) {
        componentsTree[0].componentName = 'Page';
        // FIXME
        componentsTree[0].lifeCycles = {};
        componentsTree[0].methods = {};
      }
    }

    project.load({
      version: '1.0.0',
      componentsMap: [],
      componentsTree,
    }, true);
  },
  addPage(data: OldPageData | RootSchema) {
    if (isPageDataV1(data)) {
      data = data.layout;
    } else if (isPageDataV2(data)) {
      data = data.componentsTree[0];
    }
    return project.open(data);
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

import { RootSchema } from '@ali/lowcode-types';
import { DocumentModel } from '@ali/lowcode-designer';
import { designer } from './editor';
import NodeCacheVisitor from './rootNodeVisitor';

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
    // todo: miniapp
    let componentsTree: any = [];
    if (window.pageConfig?.isNoCodeMiniApp) {
      // 小程序多页面
      pages.forEach((item: any) => {
        if (isPageDataV1(item)) {
          componentsTree.push(item.layout);
        } else {
          componentsTree.push(item.componentsTree[0]);
        }
      });
    } else if (isPageDataV1(pages[0])) {
      componentsTree = [pages[0].layout];
    } else {
      // if (!pages[0].componentsTree) return;
      componentsTree = pages[0].componentsTree;
      if (componentsTree[0]) {
        componentsTree[0].componentName = componentsTree[0].componentName || 'Page';
        // FIXME
        if (componentsTree[0].componentName === 'Page' || componentsTree[0].componentName === 'Component') {
          componentsTree[0].methods = {};
        }
      }
    }

    componentsTree.forEach((item: any) => {
      item.componentName = item.componentName || 'Page';
      if (item.componentName === 'Page' || item.componentName === 'Component') {
        item.methods = {};
      }
    });
    project.load(
      {
        version: '1.0.0',
        componentsMap: [],
        componentsTree,
        id: pages[0].id,
        config: project.config,
      },
      true,
    );

    // FIXME: 根本原因应该是 propStash 导致的，这样可以避免页面加载之后就被标记为 isModified
    setTimeout(() => {
      project.currentDocument?.history.savePoint();
    }, 0);
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
    return project.documents.map((doc) => doc.toData());
  },
});

Object.defineProperty(pages, 'currentPage', {
  get() {
    return project.currentDocument;
  },
  set(_currentPage) {
    // do nothing
  },
});

pages.onCurrentPageChange((page: DocumentModel) => {
  if (!page) {
    return;
  }
  page.acceptRootNodeVisitor('NodeCache', (rootNode) => {
    const visitor: NodeCacheVisitor = page.getRootNodeVisitor('NodeCache');
    if (visitor) {
      visitor.destroy();
    }
    return new NodeCacheVisitor(page, rootNode);
  });
});

export default pages;

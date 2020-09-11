import { EventEmitter } from 'events';
import { obx, computed } from '@ali/lowcode-editor-core';
import { Designer } from '../designer';
import { DocumentModel, isDocumentModel, isPageSchema } from '../document';
import { ProjectSchema, RootSchema } from '@ali/lowcode-types';

export class Project {
  private emitter = new EventEmitter();

  @obx.val readonly documents: DocumentModel[] = [];

  private data: ProjectSchema = { version: '1.0.0', componentsMap: [], componentsTree: [] };

  @obx.ref canvasDisplayMode: 'exclusive' | 'overview' = 'exclusive';

  // TODO: 考虑项目级别 History

  constructor(readonly designer: Designer, schema?: ProjectSchema) {
    this.load(schema);
  }

  @computed get currentDocument() {
    return this.documents.find((doc) => doc.actived);
  }

  /**
   * 获取项目整体 schema
   */
  getSchema(): ProjectSchema {
    return {
      ...this.data,
      // todo: future change this filter
      componentsTree: this.documents.filter((doc) => !doc.isBlank()).map((doc) => doc.schema),
    };
  }

  /**
   * 替换当前document的schema,并触发渲染器的render
   * @param schema 
   */
  setSchema(schema?: ProjectSchema){
    let doc = this.documents.find((doc) => doc.actived);
    doc && doc.import(schema?.componentsTree[0]);
  }

  /**
   * 整体设置项目 schema
   *
   * @param autoOpen true 自动打开文档 string 指定打开的文件
   */
  load(schema?: ProjectSchema, autoOpen?: boolean | string) {
    this.unload();
    // load new document
    this.data = {
      version: '1.0.0',
      componentsMap: [],
      componentsTree: [],
      ...schema,
    };

    if (autoOpen) {
      if (autoOpen === true) {
        // auto open first document or open a blank page
        this.open(this.data.componentsTree[0]);
      } else {
        // auto open should be string of fileName
        this.open(autoOpen);
      }
    }
  }

  /**
   * 卸载当前项目数据
   */
  unload() {
    if (this.documents.length < 1) {
      return;
    }
    this.documents.forEach((doc) => doc.remove());
  }

  removeDocument(doc: DocumentModel) {
    const index = this.documents.indexOf(doc);
    if (index < 0) {
      return;
    }
    this.documents.splice(index, 1);
  }

  /**
   * 分字段设置储存数据，不记录操作记录
   */
  set(
    key:
    | 'version'
    | 'componentsTree'
    | 'componentsMap'
    | 'utils'
    | 'constants'
    | 'i18n'
    | 'css'
    | 'dataSource'
    | string,
    value: any,
  ): void {}

  /**
   * 分字段设置储存数据
   */
  get(
    key:
    | 'version'
    | 'componentsTree'
    | 'componentsMap'
    | 'utils'
    | 'constants'
    | 'i18n'
    | 'css'
    | 'dataSource'
    | string,
  ): any {}

  open(doc?: string | DocumentModel | RootSchema): DocumentModel {
    if (!doc) {
      const got = this.documents.find((item) => item.isBlank());
      if (got) {
        return got.open();
      }
      doc = new DocumentModel(this);
      this.documents.push(doc);
      return doc.open();
    }
    if (typeof doc === 'string') {
      const got = this.documents.find((item) => item.fileName === doc);
      if (got) {
        return got.open();
      }

      const data = this.data.componentsTree.find((data) => data.fileName === doc);
      if (data) {
        doc = new DocumentModel(this, data);
        this.documents.push(doc);
        return doc.open();
      }

      return;
    }

    if (isDocumentModel(doc)) {
      return doc.open();
    } else if (isPageSchema(doc)) {
      const foundDoc = this.documents.find(curDoc => curDoc?.rootNode?.id && curDoc?.rootNode?.id === doc?.id);
      if (foundDoc) {
        foundDoc.remove();
      }
    }

    doc = new DocumentModel(this, doc);
    this.documents.push(doc);
    return doc.open();
  }

  checkExclusive(actived: DocumentModel) {
    this.documents.forEach((doc) => {
      if (doc !== actived) {
        doc.suspense();
      }
    });
    this.emitter.emit('current-document.change', actived);
  }

  closeOthers(opened: DocumentModel) {
    this.documents.forEach((doc) => {
      if (doc !== opened) {
        doc.close();
      }
    });
  }

  onCurrentDocumentChange(fn: (doc: DocumentModel) => void): () => void {
    this.emitter.on('current-document.change', fn);
    return () => {
      this.emitter.removeListener('current-document.change', fn);
    };
  }
  // 通知标记删除，需要告知服务端
  // 项目角度编辑不是全量打开所有文档，是按需加载，哪个更新就通知更新谁，
  // 哪个删除就
}

import { signal, uniqueId, type ComponentTreeRootNode } from '@alilc/lowcode-shared';
import { type Project } from '../project';
import { History } from './history';

export interface DocumentSchema extends ComponentTreeRootNode {
  id: string;
}

export interface DocumentModel {
  /**
   * 文档编号
   */
  readonly id: string;

  /**
   * 获取当前文档所属的 project
   * get project which this documentModel belongs to
   */
  readonly project: Project;

  /**
   * 操作历史模型实例
   */
  history: History<DocumentSchema>;
}

export function createDocumentModel(project: Project) {
  const uid = uniqueId('doc');
  const currentDocumentSchema = signal<DocumentSchema>({});

  const documentHistory = new History(currentDocumentSchema, () => {});

  return {
    get id() {
      return uid;
    },
    get project() {
      return project;
    },

    get history() {
      return documentHistory;
    },
  };
}

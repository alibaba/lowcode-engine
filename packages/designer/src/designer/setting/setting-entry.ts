import { IPublicModelSettingTarget } from '@alilc/lowcode-types';
import { IComponentMeta } from '../../component-meta';
import { Designer } from '../designer';
import { INode } from '../../document';

export interface ISettingEntry extends IPublicModelSettingTarget {
  readonly nodes: INode[];
  readonly componentMeta: IComponentMeta | null;
  readonly designer: Designer;

  // 顶端
  readonly top: ISettingEntry;
  // 父级
  readonly parent: ISettingEntry;

  get: (propName: string | number) => ISettingEntry | null;
}

import { IPublicModelSettingTarget } from '@alilc/lowcode-types';
import { IComponentMeta } from '../../component-meta';
import { Designer } from '../designer';
import { INode } from '../../document';

export interface SettingEntry extends IPublicModelSettingTarget {
  readonly nodes: INode[];
  readonly componentMeta: IComponentMeta | null;
  readonly designer: Designer;

  // 顶端
  readonly top: SettingEntry;
  // 父级
  readonly parent: SettingEntry;

  get: (propName: string | number) => SettingEntry | null;
}

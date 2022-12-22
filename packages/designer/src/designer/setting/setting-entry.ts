import { IPublicModelSettingTarget } from '@alilc/lowcode-types';
import { ComponentMeta } from '../../component-meta';
import { Designer } from '../designer';
import { Node } from '../../document';

export interface SettingEntry extends IPublicModelSettingTarget {
  readonly nodes: Node[];
  readonly componentMeta: ComponentMeta | null;
  readonly designer: Designer;

  // 顶端
  readonly top: SettingEntry;
  // 父级
  readonly parent: SettingEntry;

  get: (propName: string | number) => SettingEntry | null;
}

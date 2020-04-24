import { SettingTarget } from '@ali/lowcode-globals';
import { ComponentMeta } from '../../component-meta';
import { Designer } from '../designer';
import { Node } from '../../document';

export interface SettingEntry extends SettingTarget {
  readonly nodes: Node[];
  readonly componentMeta: ComponentMeta | null;
  readonly designer: Designer;

  // 顶端
  readonly top: SettingEntry;
  // 父级
  readonly parent: SettingEntry;

  get(propName: string | number): SettingEntry;
}

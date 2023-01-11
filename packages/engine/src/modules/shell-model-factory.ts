import {
  Node as InnerNode,
  SettingField as InnerSettingField,
} from '@alilc/lowcode-designer';
import { IShellModelFactory, IPublicModelNode, IPublicModelSettingPropEntry } from '@alilc/lowcode-types';
import {
  Node,
  SettingPropEntry,
} from '@alilc/lowcode-shell';
class ShellModelFactory implements IShellModelFactory {
  createNode(node: InnerNode | null | undefined): IPublicModelNode | null {
    return Node.create(node);
  }
  createSettingPropEntry(prop: InnerSettingField): IPublicModelSettingPropEntry {
    return SettingPropEntry.create(prop);
  }
}
export const shellModelFactory = new ShellModelFactory();
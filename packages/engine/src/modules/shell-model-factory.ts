import {
  INode,
  ISettingField,
} from '@alilc/lowcode-designer';
import { IShellModelFactory, IPublicModelNode } from '@alilc/lowcode-types';
import { IPublicModelSettingField } from '../../../types/src/shell/model/setting-field';
import {
  Node,
  SettingField,
} from '../shell';

class ShellModelFactory implements IShellModelFactory {
  createNode(node: INode | null | undefined): IPublicModelNode | null {
    return Node.create(node);
  }
  createSettingField(prop: ISettingField): IPublicModelSettingField {
    return SettingField.create(prop);
  }
}

export const shellModelFactory = new ShellModelFactory();
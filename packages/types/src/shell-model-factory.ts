import { IPublicModelNode, IPublicModelSettingField } from './shell';

export interface IShellModelFactory {
  // TODO: 需要给 innerNode 提供一个 interface 并用在这里
  createNode(node: any | null | undefined): IPublicModelNode | null;
  // TODO: 需要给 InnerSettingField 提供一个 interface 并用在这里

  createSettingField(prop: any): IPublicModelSettingField;
}

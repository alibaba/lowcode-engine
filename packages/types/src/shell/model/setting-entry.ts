import { IPublicModelComponentMeta } from "./component-meta";
import { IPublicModelNode } from "./node";
import { IBaseModelSettingTarget } from "./setting-target";

export interface IBaseModelSettingEntry<
  Node,
  ComponentMeta,
  SettingEntry
> extends IBaseModelSettingTarget<
  SettingEntry
> {
  readonly nodes: Node[];
  readonly componentMeta: ComponentMeta | null;
}

export interface IPublicModelSettingEntry extends IBaseModelSettingEntry<
  IPublicModelNode,
  IPublicModelComponentMeta,
  IPublicModelSettingEntry
> {}
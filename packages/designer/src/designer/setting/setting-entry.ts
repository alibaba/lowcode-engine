import { IBaseModelSettingEntry, IPublicModelSettingPropEntry, IPublicTypeSetValueOptions } from '@alilc/lowcode-types';
import { IComponentMeta } from '../../component-meta';
import { IDesigner } from '../designer';
import { INode } from '../../document';

export interface ISettingEntry extends IBaseModelSettingEntry<
  INode,
  IComponentMeta,
  ISettingEntry
> {
  readonly designer: IDesigner;

  readonly isGroup: boolean;

  readonly id: string;

  get name(): string | number | undefined;

  internalToShellPropEntry(): IPublicModelSettingPropEntry;

  valueChange(options: IPublicTypeSetValueOptions): void;

  get valueState(): number;

  clearValue(): void;
}

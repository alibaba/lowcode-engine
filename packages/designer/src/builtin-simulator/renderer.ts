import { Component } from '../simulator';
import { IPublicTypeNodeSchema, IPublicTypeComponentInstance, IPublicTypeNodeInstance, Asset } from '@alilc/lowcode-types';

export interface BuiltinSimulatorRenderer {
  readonly isSimulatorRenderer: true;
  autoRepaintNode?: boolean;
  components: Record<string, Component>;
  rerender: () => void;
  createComponent(schema: IPublicTypeNodeSchema): Component | null;
  getComponent(componentName: string): Component;
  getClosestNodeInstance(
      from: IPublicTypeComponentInstance,
      nodeId?: string,
    ): IPublicTypeNodeInstance<IPublicTypeComponentInstance> | null;
  findDOMNodes(instance: IPublicTypeComponentInstance): Array<Element | Text> | null;
  getClientRects(element: Element | Text): DOMRect[];
  setNativeSelection(enableFlag: boolean): void;
  setDraggingState(state: boolean): void;
  setCopyState(state: boolean): void;
  loadAsyncLibrary(asyncMap: { [index: string]: any }): void;
  clearState(): void;
  stopAutoRepaintNode(): void;
  enableAutoRepaintNode(): void;
  run(): void;
  load(asset: Asset): Promise<any>;
}

export function isSimulatorRenderer(obj: any): obj is BuiltinSimulatorRenderer {
  return obj && obj.isSimulatorRenderer;
}

import { Asset } from '../../assets';
import {
  IPublicTypeNodeInstance,
  IPublicTypeProjectSchema,
  IPublicTypeComponentSchema,
} from './';

export interface IPublicTypeSimulatorRenderer<Component, ComponentInstance> {
  readonly isSimulatorRenderer: true;
  autoRepaintNode?: boolean;
  components: Record<string, Component>;
  rerender: () => void;
  createComponent(
    schema: IPublicTypeProjectSchema<IPublicTypeComponentSchema>,
  ): Component | null;
  getComponent(componentName: string): Component;
  getClosestNodeInstance(
    from: ComponentInstance,
    nodeId?: string,
  ): IPublicTypeNodeInstance<ComponentInstance> | null;
  findDOMNodes(instance: ComponentInstance): Array<Element | Text> | null;
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

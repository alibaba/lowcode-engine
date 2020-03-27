import { ComponentInstance, NodeInstance, Component } from '../simulator';

export interface BuiltinSimulatorRenderer {
  readonly isSimulatorRenderer: true;
  getComponent(componentName: string): Component;
  getComponentInstances(id: string): ComponentInstance[] | null;
  getClosestNodeInstance(from: ComponentInstance, nodeId?: string): NodeInstance<ComponentInstance> | null;
  findDOMNodes(instance: ComponentInstance): Array<Element | Text> | null;
  getClientRects(element: Element | Text): DOMRect[];
  setNativeSelection(enableFlag: boolean): void;
  setDraggingState(state: boolean): void;
  setCopyState(state: boolean): void;
  clearState(): void;
  run(): void;
}

export function isSimulatorRenderer(obj: any): obj is BuiltinSimulatorRenderer {
  return obj && obj.isSimulatorRenderer;
}

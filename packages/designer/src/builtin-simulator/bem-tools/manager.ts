import { ComponentType } from 'react';
import { Designer } from '../../designer';
import { invariant } from '../../utils';
import { BuiltinSimulatorHost } from '../../builtin-simulator/host';

export type BemToolsData = {
  name: string;
  item: ComponentType<{ host: BuiltinSimulatorHost }>;
};

export class BemToolsManager {
  private designer: Designer;

  private toolsContainer: BemToolsData[] = [];

  constructor(designer: Designer) {
    this.designer = designer;
  }

  addBemTools(toolsData: BemToolsData) {
    const found = this.toolsContainer.find(item => item.name === toolsData.name);
    invariant(!found, `${toolsData.name} already exists`);

    this.toolsContainer.push(toolsData);
  }

  removeBemTools(name: string) {
    const index = this.toolsContainer.findIndex(item => item.name === name);
    if (index !== -1) {
      this.toolsContainer.splice(index, 1);
    }
  }

  getAllBemTools() {
    return this.toolsContainer;
  }
}

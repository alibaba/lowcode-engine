import { InstantiationService } from '@alilc/lowcode-shared';
import { IConfigurationService } from '@alilc/lowcode-engine-core';

export class MainEngineApplication {
  instantiationService = new InstantiationService();

  constructor() {
    this.instantiationService.bootstrapModules();
  }

  startup(container: HTMLElement): void {
    const configurationService = this.instantiationService.get(IConfigurationService);
    const workspaceService = this.instantiationService.get(IWorkspaceService);

    configurationService.initialize();

    workspaceService.mount(container);
  }
}

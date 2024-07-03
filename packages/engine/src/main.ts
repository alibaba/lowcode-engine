import { InstantiationService } from '@alilc/lowcode-shared';

export class MainEngineApplication {
  instantiationService = new InstantiationService();

  constructor() {
    this.instantiationService.bootstrapModules();
  }

  startup(container: HTMLElement): void {}
}

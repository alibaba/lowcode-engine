import { InstantiationService } from '@alilc/lowcode-shared';
import { IWorkbenchService } from './workbench';
import { IConfigurationService } from './configuration';

class MainApplication {
  constructor() {
    console.log('main application');
  }

  async main() {
    const instantiationService = new InstantiationService();
    const configurationService = instantiationService.get(IConfigurationService);
    const workbench = instantiationService.get(IWorkbenchService);

    await configurationService.initialize();
    workbench.initialize();
  }
}

export async function createLowCodeEngineApp(): Promise<MainApplication> {
  const app = new MainApplication();

  await app.main();

  return app;
}

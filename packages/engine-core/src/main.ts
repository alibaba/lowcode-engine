import { InstantiationService } from '@alilc/lowcode-shared';
import { IWorkbenchService } from './workbench';
import { ConfigurationService, IConfigurationService } from './configuration';

class TestMainApplication {
  constructor() {
    console.log('main application');
  }

  async main() {
    const workbench = instantiationService.get(IWorkbenchService);

    await configurationService.initialize();
    workbench.initialize();
  }

  createServices() {
    const instantiationService = new InstantiationService();

    const configurationService = new ConfigurationService();
    instantiationService.container.set(IConfigurationService, configurationService);
  }

  initServices() {}
}

export async function createLowCodeEngineApp() {
  const app = new TestMainApplication();

  await app.main();

  return app;
}

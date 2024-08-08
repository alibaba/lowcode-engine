import { InstantiationService, BeanContainer, CtorDescriptor } from '@alilc/lowcode-shared';
import { ConfigurationService, IConfigurationService } from './configuration';
import { IWorkspaceService, WorkspaceService, toWorkspaceIdentifier } from './workspace';
import { IWindowService, WindowService } from './window';
import { IFileService, FileService, InMemoryFileSystemProvider } from './file';
import { URI } from './common/uri';
import * as Schemas from './common/schemas';

class TestMainApplication {
  instantiationService: InstantiationService;

  constructor() {
    console.log('main application');
  }

  async main() {
    await this._initServices();

    const [workspaceService, windowService, fileService] = this.instantiationService.invokeFunction((accessor) => [
      accessor.get(IWorkspaceService),
      accessor.get(IWindowService),
      accessor.get(IFileService),
    ]);

    fileService.registerProvider(Schemas.file, new InMemoryFileSystemProvider());

    try {
      const uri = URI.from({ path: '/Desktop' });

      await workspaceService.enterWorkspace(toWorkspaceIdentifier(uri.path));

      const fileUri = URI.joinPath(uri, 'test.lc');

      await windowService.open({
        urisToOpen: [{ fileUri }],
        openOnlyIfExists: false,
      });
    } catch (e) {
      console.log('error', e);
    }
  }

  private _createServices(): [IConfigurationService, IWorkspaceService] {
    const container = new BeanContainer();

    const configurationService = new ConfigurationService();
    container.set(IConfigurationService, configurationService);

    const workspaceService = new WorkspaceService();
    container.set(IWorkspaceService, workspaceService);

    container.set(IFileService, new FileService());

    container.set(IWindowService, new CtorDescriptor(WindowService));

    this.instantiationService = new InstantiationService(container);

    return [configurationService, workspaceService];
  }

  private async _initServices() {
    const [configurationService, workspaceService] = this._createServices();

    await configurationService.initialize();
    // init workspace
    await workspaceService.initialize();
  }
}

export async function createLowCodeEngineApp() {
  const app = new TestMainApplication();

  await app.main();

  return app;
}

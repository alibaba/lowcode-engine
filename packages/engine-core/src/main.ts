import { InstantiationService, BeanContainer, CtorDescriptor } from '@alilc/lowcode-shared';
import { URI } from './common/uri';
import * as Schemas from './common/schemas';

import { CommandService, ICommandService } from './command';
import { IKeybindingService, KeybindingService } from './keybinding';
import { ConfigurationService, IConfigurationService } from './configuration';
import { IExtensionService, ExtensionService } from './extension';
import { IWorkspaceService, WorkspaceService, toWorkspaceIdentifier } from './workspace';
import { IWindowService, WindowService } from './window';
import { IFileService, FileService, InMemoryFileSystemProvider } from './file';
import { IResourceService, ResourceService } from './resource';

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
      const root = URI.from({ scheme: Schemas.file, path: '/' });

      // empty or mutiple files
      // 展示目录结构
      const workspace = await workspaceService.enterWorkspace(toWorkspaceIdentifier(root.path));

      // 打开页面 or 保留空白页
      const fileUri = URI.joinPath(workspace.uri, 'test.lc');

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

    const resourceService = new ResourceService();
    container.set(IResourceService, resourceService);

    container.set(ICommandService, new CtorDescriptor(CommandService));
    container.set(IKeybindingService, new CtorDescriptor(KeybindingService));
    container.set(IExtensionService, new CtorDescriptor(ExtensionService));

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

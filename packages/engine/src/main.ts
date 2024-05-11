import { Provide } from '@alilc/lowcode-core';
import { IWorkspaceMainService } from './workspace';

@Provide('EngineMain')
export class EngineMain {
  constructor(@IWorkspaceMainService private workspaceMainService: IWorkspaceMainService) {}

  startup(container: HTMLElement): void {
    console.log('%c [ container ]-9', 'font-size:13px; background:pink; color:#bf2c9f;', container);
    this.workspaceMainService.initialize();
  }
}

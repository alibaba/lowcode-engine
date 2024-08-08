import { createDecorator, Disposable, IDisposable, toDisposable } from '@alilc/lowcode-shared';
import { type IFileSystemProvider } from './file';
import { URI } from '../common';

export interface IFileService {
  /**
   * Registers a file system provider for a certain scheme.
   */
  registerProvider(scheme: string, provider: IFileSystemProvider): IDisposable;

  /**
   * Returns a file system provider for a certain scheme.
   */
  getProvider(scheme: string): IFileSystemProvider | undefined;

  /**
   * Checks if the file service has a registered provider for the
   * provided resource.
   *
   * Note: this does NOT account for contributed providers from
   * extensions that have not been activated yet. To include those,
   * consider to call `await fileService.canHandleResource(resource)`.
   */
  hasProvider(resource: URI): boolean;

  withProvider(resource: URI): IFileSystemProvider | undefined;

  /**
   * Frees up any resources occupied by this service.
   */
  dispose(): void;
}

export const IFileService = createDecorator<IFileService>('fileService');

export class FileService extends Disposable implements IFileService {
  private readonly provider = new Map<string, IFileSystemProvider>();

  constructor() {
    super();
  }

  registerProvider(scheme: string, provider: IFileSystemProvider): IDisposable {
    this.provider.set(scheme, provider);

    return toDisposable(() => {
      this.provider.delete(scheme);
    });
  }

  getProvider(scheme: string): IFileSystemProvider | undefined {
    return this.provider.get(scheme);
  }

  hasProvider(resource: URI): boolean {
    return this.provider.has(resource.scheme);
  }

  withProvider(resource: URI): IFileSystemProvider | undefined {
    return this.provider.get(resource.scheme);
  }
}

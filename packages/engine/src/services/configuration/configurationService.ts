import { createDecorator, Provide } from '@alilc/lowcode-shared';

export interface IConfigurationService {}

export const IConfigurationService = createDecorator<IConfigurationService>('configurationService');

@Provide(IConfigurationService)
export class ConfigurationService implements IConfigurationService {}

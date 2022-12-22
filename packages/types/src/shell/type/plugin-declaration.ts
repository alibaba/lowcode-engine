import { IPublicTypePluginDeclarationProperty } from './';

/**
 * declaration of plugin`s preference
 * when strictPluginMode === true， only declared preference can be obtained from inside plugin.
 */
export interface IPublicTypePluginDeclaration {
  // this will be displayed on configuration UI, can be plugin name
  title: string;
  properties: IPublicTypePluginDeclarationProperty[];
}

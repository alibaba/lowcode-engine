import { ExtensionName } from '../types';
import MatBuildBundle from './MatBuildBundle';
import MatConfigContainer from './MatConfigContainer';
import MatConfigManifest from './MatConfigManifest';
import MatGenerateBuildJS from './MatGenerateBuildJS';

export default {
  [ExtensionName.CONFIGMANIFEST]: MatConfigManifest,
  [ExtensionName.BUILDBUNDLE]: MatBuildBundle,
  [ExtensionName.CONFIGCONTAINER]: MatConfigContainer,
  [ExtensionName.GENERATEBUILDJS]: MatGenerateBuildJS,
};

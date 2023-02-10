import { IProjectBuilder, IProjectBuilderOptions } from '../types';

import { createProjectBuilder } from '../generator/ProjectBuilder';

import esModule from '../plugins/common/esmodule';
import containerClass from '../plugins/component/rax/containerClass';
import containerLifeCycles from '../plugins/component/rax/containerLifeCycle';
import containerMethods from '../plugins/component/rax/containerMethods';
import containerInitState from '../plugins/component/rax/containerInitState';
import containerInjectContext from '../plugins/component/rax/containerInjectContext';
import containerInjectDataSourceEngine from '../plugins/component/rax/containerInjectDataSourceEngine';
import containerInjectUtils from '../plugins/component/rax/containerInjectUtils';
import jsx from '../plugins/component/rax/jsx';
import commonDeps from '../plugins/component/rax/commonDeps';
import css from '../plugins/component/style/css';
import constants from '../plugins/project/constants';
import i18n from '../plugins/project/i18n';
import utils from '../plugins/project/utils';

import raxApp from '../plugins/project/framework/rax';

import { prettier } from '../postprocessor';
import { RaxFrameworkOptions } from '../plugins/project/framework/rax/types/RaxFrameworkOptions';

export interface RaxProjectBuilderOptions extends IProjectBuilderOptions, RaxFrameworkOptions {}

export default function createRaxProjectBuilder(
  options?: RaxProjectBuilderOptions,
): IProjectBuilder {
  return createProjectBuilder({
    inStrictMode: options?.inStrictMode,
    extraContextData: { ...options },
    template: raxApp.template,
    plugins: {
      components: [
        commonDeps(),
        esModule({ fileType: 'jsx', useAliasName: false }),
        containerClass(),
        containerInitState(),
        containerMethods(),
        containerInjectContext(),
        containerInjectDataSourceEngine(options),
        containerInjectUtils(),
        containerLifeCycles(),
        jsx(),
        css(),
      ],
      pages: [
        commonDeps(),
        esModule({ fileType: 'jsx' }),
        containerClass(),
        containerInitState(),
        containerMethods(),
        containerInjectContext(),
        containerInjectDataSourceEngine(options),
        containerInjectUtils(),
        containerLifeCycles(),
        jsx(),
        css(),
      ],
      appConfig: [raxApp.plugins.appConfig(options)],
      buildConfig: [raxApp.plugins.buildConfig(options)],
      entry: [raxApp.plugins.entry(options)],
      constants: [constants()],
      utils: [esModule(), utils('rax')],
      i18n: [i18n()],
      globalStyle: [
        raxApp.plugins.globalStyle({ fileType: options?.globalStylesFileType || 'css' }),
      ],
      htmlEntry: [raxApp.plugins.entryDocument(options)],
      packageJSON: [raxApp.plugins.packageJSON(options)],
    },
    postProcessors: [prettier()],
    customizeBuilderOptions: options?.customizeBuilderOptions,
  });
}

export const plugins = {
  containerClass,
  containerLifeCycles,
  containerMethods,
  containerInitState,
  containerInjectContext,
  containerInjectDataSourceEngine,
  containerInjectUtils,
  jsx,
  commonDeps,
  raxApp,
};

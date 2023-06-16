import { IProjectBuilder, IProjectBuilderOptions } from '../types';

import { createProjectBuilder } from '../generator/ProjectBuilder';

import esmodule from '../plugins/common/esmodule';
import styleImport from '../plugins/common/styleImport';
import containerClass from '../plugins/component/react/containerClass';
import containerInitState from '../plugins/component/react/containerInitState';
import containerInjectContext from '../plugins/component/react/containerInjectContext';
import containerInjectUtils from '../plugins/component/react/containerInjectUtils';
import containerInjectDataSourceEngine from '../plugins/component/react/containerInjectDataSourceEngine';
import containerInjectConstants from '../plugins/component/react/containerInjectConstants';
import containerInjectI18n from '../plugins/component/react/containerInjectI18n';
import containerLifeCycle from '../plugins/component/react/containerLifeCycle';
import containerMethod from '../plugins/component/react/containerMethod';
import jsx from '../plugins/component/react/jsx';
import reactCommonDeps from '../plugins/component/react/reactCommonDeps';
import css from '../plugins/component/style/css';
import constants from '../plugins/project/constants';
import i18n from '../plugins/project/i18n';
import utils from '../plugins/project/utils';

import icejs3 from '../plugins/project/framework/icejs3';

import { prettier } from '../postprocessor';

export type IceJs3ProjectBuilderOptions = IProjectBuilderOptions;

export default function createIceJsProjectBuilder(
  options?: IceJs3ProjectBuilderOptions,
): IProjectBuilder {
  return createProjectBuilder({
    inStrictMode: options?.inStrictMode,
    extraContextData: { ...options },
    template: icejs3.template,
    plugins: {
      components: [
        reactCommonDeps(),
        esmodule({
          fileType: 'jsx',
        }),
        styleImport(),
        containerClass(),
        containerInjectContext(),
        containerInjectUtils(),
        containerInjectDataSourceEngine(),
        containerInjectI18n(),
        containerInitState(),
        containerLifeCycle(),
        containerMethod(),
        jsx({
          nodeTypeMapping: {
            Div: 'div',
            Component: 'div',
            Page: 'div',
            Block: 'div',
          },
        }),
        css(),
      ],
      pages: [
        reactCommonDeps(),
        esmodule({
          fileType: 'jsx',
        }),
        styleImport(),
        containerClass(),
        containerInjectContext(),
        containerInjectUtils(),
        containerInjectDataSourceEngine(),
        containerInjectI18n(),
        containerInjectConstants(),
        containerInitState(),
        containerLifeCycle(),
        containerMethod(),
        jsx({
          nodeTypeMapping: {
            Div: 'div',
            Component: 'div',
            Page: 'div',
            Block: 'div',
            Box: 'div',
          },
        }),
        css(),
      ],
      constants: [constants()],
      utils: [esmodule(), utils('react')],
      i18n: [i18n()],
      globalStyle: [icejs3.plugins.globalStyle()],
      packageJSON: [icejs3.plugins.packageJSON()],
      buildConfig: [icejs3.plugins.buildConfig()],
      appConfig: [icejs3.plugins.appConfig()],
      layout: [icejs3.plugins.layout()],
    },
    postProcessors: [prettier()],
    customizeBuilderOptions: options?.customizeBuilderOptions,
  });
}

export const plugins = {
  containerClass,
  containerInitState,
  containerInjectContext,
  containerInjectUtils,
  containerInjectI18n,
  containerInjectDataSourceEngine,
  containerLifeCycle,
  containerMethod,
  jsx,
  commonDeps: reactCommonDeps,
};

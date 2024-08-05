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

import icejs from '../plugins/project/framework/icejs';

import { prettier } from '../postprocessor';

export type IceJsProjectBuilderOptions = IProjectBuilderOptions;

export default function createIceJsProjectBuilder(
  options?: IceJsProjectBuilderOptions,
): IProjectBuilder {
  return createProjectBuilder({
    inStrictMode: options?.inStrictMode,
    extraContextData: { ...options },
    template: icejs.template,
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
            // Box: 'div',
          },
        }),
        css(),
      ],
      router: [esmodule(), icejs.plugins.router()],
      entry: [icejs.plugins.entry()],
      constants: [constants()],
      utils: [esmodule(), utils('react')],
      i18n: [i18n()],
      globalStyle: [icejs.plugins.globalStyle()],
      htmlEntry: [icejs.plugins.entryHtml()],
      packageJSON: [icejs.plugins.packageJSON()],
    },
    postProcessors: [prettier()],
    customizeBuilderOptions: options?.customizeBuilderOptions,
  });
}

export const plugins = {
  containerClass,
  containerInjectContext,
  containerInjectUtils,
  containerInjectDataSourceEngine,
  containerInjectI18n,
  containerInjectConstants,
  containerInitState,
  containerLifeCycle,
  containerMethod,
  jsx,
  commonDeps: reactCommonDeps,

  /** @deprecated Please use commonDeps */
  reactCommonDeps,
};

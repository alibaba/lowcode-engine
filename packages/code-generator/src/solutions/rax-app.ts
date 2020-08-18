import { IProjectBuilder } from '../types';

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

export default function createIceJsProjectBuilder(): IProjectBuilder {
  return createProjectBuilder({
    template: raxApp.template,
    plugins: {
      components: [
        commonDeps(),
        esModule({ fileType: 'jsx' }),
        containerClass(),
        containerInitState(),
        containerMethods(),
        containerInjectContext(),
        containerInjectDataSourceEngine(),
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
        containerInjectDataSourceEngine(),
        containerInjectUtils(),
        containerLifeCycles(),
        jsx(),
        css(),
      ],
      appConfig: [raxApp.plugins.appConfig()],
      buildConfig: [raxApp.plugins.buildConfig()],
      entry: [raxApp.plugins.entry()],
      constants: [constants()],
      utils: [esModule(), utils()],
      i18n: [i18n()],
      globalStyle: [raxApp.plugins.globalStyle()],
      htmlEntry: [raxApp.plugins.entryDocument()],
      packageJSON: [raxApp.plugins.packageJSON()],
    },
    postProcessors: process.env.NODE_ENV !== 'test' ? [prettier()] : [],
  });
}
